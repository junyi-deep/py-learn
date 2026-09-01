from __future__ import annotations

import csv
import hashlib
import json
import os
import socketserver
import subprocess
import sys
import threading
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


@dataclass
class VerificationResult:
    ok: bool
    message: str
    details: list[str] = field(default_factory=list)
    stdout: str = ""


def run_solution(project_dir: Path, extra_env: dict[str, str] | None = None) -> tuple[bool, str, str]:
    solution = project_dir / "solution.py"
    if not solution.exists():
        return False, "", "缺少 solution.py"
    env = os.environ.copy()
    if extra_env:
        env.update(extra_env)
    try:
        completed = subprocess.run(
            [sys.executable, "solution.py"],
            cwd=project_dir,
            env=env,
            capture_output=True,
            text=True,
            timeout=12,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return False, "", "程序运行超过 12 秒"
    if completed.returncode != 0:
        error = completed.stderr.strip() or f"程序退出码为 {completed.returncode}"
        return False, completed.stdout, error
    return True, completed.stdout, ""


def read_json(path: Path) -> tuple[dict | list | None, str]:
    if not path.exists():
        return None, f"没有生成 {path.relative_to(path.parents[1])}"
    try:
        return json.loads(path.read_text(encoding="utf-8")), ""
    except (json.JSONDecodeError, OSError) as error:
        return None, f"输出不是有效 UTF-8 JSON：{error}"


def verify_json_project(project_dir: Path, relative_output: str, expected: dict, details: list[str]) -> VerificationResult:
    ok, stdout, error = run_solution(project_dir)
    if not ok:
        return VerificationResult(False, error, ["solution.py 未能正常完成"], stdout)
    value, error = read_json(project_dir / relative_output)
    if error:
        return VerificationResult(False, error, ["程序成功退出", "输出文件检查失败"], stdout)
    if value != expected:
        return VerificationResult(False, "输出内容与题目预期不一致", ["程序成功退出", "已读取输出文件，但字段或数值不正确"], stdout)
    return VerificationResult(True, "通过", details, stdout)


def verify_file_organizer(project_dir: Path) -> VerificationResult:
    expected = {
        "groups": {
            "document": ["report.pdf"],
            "image": ["photo.JPG"],
            "other": ["README"],
            "text": ["notes.txt"],
        },
        "total": 4,
    }
    return verify_json_project(project_dir, "output/plan.json", expected, ["solution.py 正常完成", "plan.json 结构正确", "大小写与无扩展名规则正确"])


def verify_expense_report(project_dir: Path) -> VerificationResult:
    expected = {
        "by_category": {"books": "68.90", "food": "41.50", "transport": "12.00"},
        "currency": "CNY",
        "total": "122.40",
    }
    return verify_json_project(project_dir, "output/summary.json", expected, ["solution.py 正常完成", "总金额 122.40 正确", "分类汇总和 Decimal 格式正确"])


class ApiHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        if self.path != "/v1/profile":
            self.send_response(404)
            self.end_headers()
            return
        body = json.dumps({"id": 7, "name": "Ada", "skills": ["python", "algorithms"], "active": True}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


class LocalHTTPServer(ThreadingHTTPServer):
    """HTTPServer without a reverse-DNS lookup during bind."""

    def server_bind(self) -> None:
        socketserver.TCPServer.server_bind(self)
        self.server_name = "localhost"
        self.server_port = self.server_address[1]


def verify_offline_api(project_dir: Path) -> VerificationResult:
    server = LocalHTTPServer(("127.0.0.1", 0), ApiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        url = f"http://127.0.0.1:{server.server_port}/v1/profile"
        ok, stdout, error = run_solution(
            project_dir,
            {
                "PYPATH_API_URL": url,
                "NO_PROXY": "127.0.0.1,localhost",
                "no_proxy": "127.0.0.1,localhost",
            },
        )
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
    if not ok:
        return VerificationResult(False, error, ["本地模拟 API 已启动", "solution.py 未能正常完成"], stdout)
    value, error = read_json(project_dir / "output/profile.json")
    expected = {"active": True, "display": "Ada (#7)", "skill_count": 2}
    if error:
        return VerificationResult(False, error, ["本地 HTTP 请求已完成", "输出文件检查失败"], stdout)
    if value != expected:
        return VerificationResult(False, "profile.json 字段或数值不正确", ["本地 HTTP 请求已完成", "JSON 摘要与预期不一致"], stdout)
    return VerificationResult(True, "通过", ["请求了动态分配端口的本地 API", "正确解析 HTTP JSON", "profile.json 内容正确"], stdout)


def verify_log_analyzer(project_dir: Path) -> VerificationResult:
    expected = {
        "error_rate": "40.00%",
        "invalid_lines": 1,
        "levels": {"ERROR": 2, "INFO": 2, "WARN": 1},
        "slowest": {"duration_ms": 800, "path": "/pay"},
    }
    return verify_json_project(project_dir, "output/report.json", expected, ["solution.py 正常完成", "损坏日志已被容错记录", "级别、错误率与最慢请求正确"])


def verify_batch_renamer(project_dir: Path) -> VerificationResult:
    ok, stdout, error = run_solution(project_dir)
    if not ok:
        return VerificationResult(False, error, ["solution.py 未能正常完成"], stdout)
    output = project_dir / "output/plan.csv"
    if not output.exists():
        return VerificationResult(False, "没有生成 output/plan.csv", ["程序成功退出", "输出文件不存在"], stdout)
    try:
        with output.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.DictReader(handle))
    except (OSError, csv.Error) as error_value:
        return VerificationResult(False, f"无法读取 plan.csv：{error_value}", ["程序成功退出", "CSV 解析失败"], stdout)
    expected = [
        {"original": "My Report.TXT", "new_name": "my-report.txt"},
        {"original": "team_photo.JPG", "new_name": "team-photo.jpg"},
        {"original": "My__Report.txt", "new_name": "my-report-2.txt"},
        {"original": "README", "new_name": "readme"},
    ]
    if rows != expected:
        return VerificationResult(False, "重命名计划与预期不一致", ["程序成功退出", "CSV 行、顺序或冲突后缀不正确"], stdout)
    return VerificationResult(True, "通过", ["CSV 可被标准库读取", "名称规范化正确", "冲突稳定追加 -2"], stdout)


def file_digest(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_backup_manifest(project_dir: Path) -> VerificationResult:
    ok, stdout, error = run_solution(project_dir)
    if not ok:
        return VerificationResult(False, error, ["solution.py 未能正常完成"], stdout)
    value, error = read_json(project_dir / "output/manifest.json")
    if error:
        return VerificationResult(False, error, ["程序成功退出", "输出文件检查失败"], stdout)
    source = project_dir / "fixtures/source"
    paths = [source / "app.ini", source / "data/users.csv"]
    expected_files = [
        {"path": path.relative_to(source).as_posix(), "size": path.stat().st_size, "sha256": file_digest(path)}
        for path in paths
    ]
    expected = {"file_count": 2, "files": expected_files}
    if value != expected:
        return VerificationResult(False, "manifest 内容不正确", ["程序成功退出", "路径、大小、哈希或排除规则不正确"], stdout)
    return VerificationResult(True, "通过", ["隐藏文件和 .tmp 已排除", "相对路径与文件大小正确", "SHA-256 哈希全部匹配"], stdout)


VERIFIERS = {
    "file-organizer": verify_file_organizer,
    "expense-report": verify_expense_report,
    "offline-api": verify_offline_api,
    "log-analyzer": verify_log_analyzer,
    "batch-renamer": verify_batch_renamer,
    "backup-manifest": verify_backup_manifest,
}


def verify_project(verifier: str, project_dir: Path) -> VerificationResult:
    if not project_dir.exists():
        return VerificationResult(False, f"题目目录不存在：{project_dir}")
    verify = VERIFIERS.get(verifier)
    if verify is None:
        return VerificationResult(False, f"没有找到验收器：{verifier}")
    return verify(project_dir)
