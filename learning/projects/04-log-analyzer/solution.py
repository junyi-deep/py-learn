"""分析 JSONL 服务日志。只需要修改这个文件。"""

from __future__ import annotations

import json
from pathlib import Path


def analyze(lines: list[str]) -> dict:
    """容错解析日志并返回统计报告。"""
    # TODO：逐行 json.loads；坏行只计数，不中断其余日志。
    raise NotImplementedError


def main() -> None:
    lines = Path("fixtures/app.jsonl").read_text(encoding="utf-8").splitlines()
    report = analyze(lines)
    output = Path("output/report.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
