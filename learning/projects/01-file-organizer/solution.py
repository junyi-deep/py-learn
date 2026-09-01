"""生成文件归档计划。只需要修改这个文件。"""

from __future__ import annotations

import json
from pathlib import Path


def classify(filename: str) -> str:
    """根据扩展名返回 text / image / document / other。"""
    # TODO：用 pathlib 取得小写扩展名，再匹配分类。
    raise NotImplementedError


def build_plan(names: list[str]) -> dict:
    """返回包含 groups 和 total 的归档计划。"""
    # TODO：分组并保证键与文件名列表都有稳定顺序。
    raise NotImplementedError


def main() -> None:
    names = Path("fixtures/inbox.txt").read_text(encoding="utf-8").splitlines()
    plan = build_plan([name for name in names if name])
    output = Path("output/plan.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(plan, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
