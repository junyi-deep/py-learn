"""汇总 CSV 支出。只需要修改这个文件。"""

from __future__ import annotations

import csv
import json
from decimal import Decimal
from pathlib import Path


def summarize(rows: list[dict[str, str]]) -> dict:
    """返回 total、currency 和 by_category。"""
    # TODO：用 Decimal 汇总，并把金额格式化为两位小数字符串。
    raise NotImplementedError


def main() -> None:
    with Path("fixtures/expenses.csv").open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    report = summarize(rows)
    output = Path("output/summary.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
