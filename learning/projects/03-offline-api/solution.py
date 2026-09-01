"""调用验收器提供的本地 API。只需要修改这个文件。"""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.request import urlopen


def fetch_profile(url: str) -> dict:
    """请求 URL 并返回加工后的用户摘要。"""
    # TODO：使用 urlopen(url, timeout=2)，解析 UTF-8 JSON。
    raise NotImplementedError


def main() -> None:
    url = os.environ.get("PYPATH_API_URL")
    if not url:
        raise RuntimeError("缺少 PYPATH_API_URL；请用 pylearn check offline-api 运行")
    profile = fetch_profile(url)
    output = Path("output/profile.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(profile, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
