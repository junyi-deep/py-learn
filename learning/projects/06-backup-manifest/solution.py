"""为备份目录生成可验证 manifest。只需要修改这个文件。"""

from __future__ import annotations

import json
from pathlib import Path


def create_manifest(root: Path) -> dict:
    """扫描 root 并返回 file_count / files。"""
    # TODO：用 hashlib.sha256() 和分块读取计算每个文件的哈希。
    raise NotImplementedError


def main() -> None:
    manifest = create_manifest(Path("fixtures/source"))
    output = Path("output/manifest.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
