from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

from .verifiers import VerificationResult, verify_project


ROOT = Path(__file__).resolve().parents[2]
COURSE_FILE = ROOT / "meta" / "course.json"
PROGRESS_FILE = ROOT / "meta" / "progress.json"
PACKAGE_LOCK_FILE = ROOT / "package-lock.json"
NODE_MODULES_MARKER = ROOT / "node_modules" / ".package-lock.json"


def load_course() -> dict:
    return json.loads(COURSE_FILE.read_text(encoding="utf-8"))


def load_progress() -> dict:
    if not PROGRESS_FILE.exists():
        return {"projects": []}
    try:
        progress = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"projects": []}
    projects = progress.get("projects", [])
    return {"projects": projects if isinstance(projects, list) else []}


def save_completed(project_id: str) -> None:
    progress = load_progress()
    if project_id not in progress["projects"]:
        progress["projects"].append(project_id)
        progress["projects"].sort()
    PROGRESS_FILE.write_text(
        json.dumps(progress, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def project_by_id(project_id: str) -> dict | None:
    return next((project for project in load_course()["projects"] if project["id"] == project_id), None)


def command_outline(_: argparse.Namespace) -> int:
    course = load_course()
    print(course["title"])
    print("=" * len(course["title"]))
    for index, stage in enumerate(course["stages"], 1):
        print(f"{index}. {stage['title']} · {stage['count']} 个节点")
        print(f"   通过条件：{stage['completion']}")
    return 0


def command_projects(_: argparse.Namespace) -> int:
    completed = set(load_progress()["projects"])
    print("本地实战项目")
    for index, project in enumerate(load_course()["projects"], 1):
        marker = "✓" if project["id"] in completed else "○"
        print(f"  {marker} {index:02d}  {project['id']:<18} {project['folder']}")
    return 0


def command_status(args: argparse.Namespace) -> int:
    course = load_course()
    completed = load_progress()["projects"]
    if args.json:
        print(json.dumps({"completed_projects": completed, "total_projects": len(course["projects"])}, ensure_ascii=False, indent=2))
        return 0
    print(f"实战项目：{len(completed)}/{len(course['projects'])} 已通过")
    for project in course["projects"]:
        marker = "✓" if project["id"] in completed else "○"
        print(f"  {marker} {project['id']}")
    print("\n基础练习与算法题进度保存在浏览器中。")
    return 0


def print_result(result: VerificationResult) -> None:
    for detail in result.details:
        print(f"  {'✓' if result.ok else '·'} {detail}")
    if result.stdout.strip():
        print("\n程序输出：")
        print(result.stdout.rstrip())


def command_check(args: argparse.Namespace) -> int:
    project = project_by_id(args.project_id)
    if project is None:
        print(f"未知项目：{args.project_id}", file=sys.stderr)
        print("运行 uv run pylearn projects 查看可用项目。", file=sys.stderr)
        return 2
    project_dir = ROOT / project["folder"]
    print(f"正在验收 {args.project_id} …")
    result = verify_project(project["verifier"], project_dir)
    print_result(result)
    if not result.ok:
        print(f"\n未通过：{result.message}", file=sys.stderr)
        return 1
    save_completed(project["id"])
    print("\n全部检查通过。把下面的凭证粘贴回网页：")
    print(project["token"])
    return 0


def command_doctor(_: argparse.Namespace) -> int:
    checks = [
        (sys.version_info >= (3, 11), f"Python {sys.version.split()[0]}（需要 3.11+）"),
        (shutil.which("uv") is not None, "uv"),
        (COURSE_FILE.exists(), "课程配置 meta/course.json"),
        (shutil.which("node") is not None, "Node.js"),
        (shutil.which("npm") is not None, "npm"),
        (all((ROOT / project["folder"]).exists() for project in load_course()["projects"]), "6 个实战题目目录"),
    ]
    for ok, label in checks:
        print(f"  {'✓' if ok else '✗'} {label}")
    return 0 if all(ok for ok, _ in checks) else 1


def ensure_web_dependencies() -> int:
    if shutil.which("npm") is None:
        print("没有找到 npm，请先安装 Node.js 22.13+。", file=sys.stderr)
        return 2

    dependencies_are_stale = (
        not NODE_MODULES_MARKER.exists()
        or (
            PACKAGE_LOCK_FILE.exists()
            and PACKAGE_LOCK_FILE.stat().st_mtime > NODE_MODULES_MARKER.stat().st_mtime
        )
    )
    if dependencies_are_stale:
        print("正在根据 package-lock.json 安装网页依赖 …")
        return subprocess.call(
            ["npm", "ci", "--no-audit", "--no-fund"],
            cwd=ROOT,
        )
    return 0


def run_web_script(script: str) -> int:
    try:
        dependency_result = ensure_web_dependencies()
        if dependency_result != 0:
            return dependency_result
        return subprocess.call(["npm", "run", script], cwd=ROOT)
    except KeyboardInterrupt:
        return 130


def command_serve(_: argparse.Namespace) -> int:
    return run_web_script("dev")


def command_build(_: argparse.Namespace) -> int:
    return run_web_script("build")


def command_package(args: argparse.Namespace) -> int:
    return subprocess.call([sys.executable, str(ROOT / "scripts" / "build_binary.py"), "--target", args.target], cwd=ROOT)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="pylearn", description="PyPath 本地学习与验收工具")
    subparsers = parser.add_subparsers(dest="command", required=True)

    outline = subparsers.add_parser("outline", help="查看三阶段学习大纲")
    outline.set_defaults(handler=command_outline)

    projects_parser = subparsers.add_parser("projects", help="列出本地实战项目")
    projects_parser.set_defaults(handler=command_projects)

    status = subparsers.add_parser("status", help="查看本地验收进度")
    status.add_argument("--json", action="store_true", help="输出 JSON")
    status.set_defaults(handler=command_status)

    check = subparsers.add_parser("check", help="运行一个实战项目并验收产物")
    check.add_argument("project_id", help="项目 ID，例如 file-organizer")
    check.set_defaults(handler=command_check)

    doctor = subparsers.add_parser("doctor", help="检查本地学习环境")
    doctor.set_defaults(handler=command_doctor)

    serve = subparsers.add_parser("serve", help="启动学习网站")
    serve.set_defaults(handler=command_serve)

    build = subparsers.add_parser("build", help="构建生产版学习网站")
    build.set_defaults(handler=command_build)
    package = subparsers.add_parser("package", help="构建本机平台的独立发行包（需要 --group build）")
    package.add_argument("--target", choices=["macos-arm64", "win-x64"], required=True)
    package.set_defaults(handler=command_package)
    return parser


def main() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    args = build_parser().parse_args()
    raise SystemExit(args.handler(args))
