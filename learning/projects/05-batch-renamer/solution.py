"""生成安全的批量重命名计划。只需要修改这个文件。"""

from __future__ import annotations

import csv
from pathlib import Path


def build_plan(names: list[str]) -> list[dict[str, str]]:
    """返回 original / new_name 字典列表，并处理重名冲突。"""
    # TODO：可使用 re.sub(r"[\s_]+", "-", stem)。
    raise NotImplementedError


def main() -> None:
    names = Path("fixtures/names.txt").read_text(encoding="utf-8").splitlines()
    rows = build_plan([name for name in names if name])
    output = Path("output/plan.csv")
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["original", "new_name"])
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()
