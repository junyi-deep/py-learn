"""Build a native launcher plus self-contained web/runtime distribution."""
from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", choices=["macos-arm64", "win-x64"], required=True)
    args = parser.parse_args()
    native = {("Darwin", "arm64"): "macos-arm64", ("Windows", "AMD64"): "win-x64"}.get((platform.system(), platform.machine()))
    if native != args.target:
        parser.error(f"Build {args.target} on its native runner (current: {platform.system()} {platform.machine()}).")
    node = shutil.which("node")
    npm = shutil.which("npm")
    if not node or not npm:
        parser.error("Node.js 22.13+ and npm are required on the build machine.")
    node_arch = subprocess.check_output([node, "-p", "process.arch"], text=True).strip()
    if node_arch != ("arm64" if args.target == "macos-arm64" else "x64"):
        parser.error(f"Wrong Node architecture: {node_arch}")
    env = {**os.environ, "PYPATH_PORTABLE": "1"}
    subprocess.run([npm, "ci", "--no-audit", "--no-fund"], cwd=ROOT, check=True)
    subprocess.run([npm, "run", "build"], cwd=ROOT, env=env, check=True)
    standalone = ROOT / "dist" / "standalone"
    if not (standalone / "server.js").is_file():
        raise RuntimeError("Standalone build is missing server.js")
    output = ROOT / "outputs" / "release"
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="pypath-package-") as temporary:
        work = Path(temporary)
        subprocess.run([
            sys.executable, "-m", "PyInstaller", "--noconfirm", "--clean", "--onedir",
            "--name", "PyPath", "--distpath", str(work / "dist"),
            "--workpath", str(work / "build"), "--specpath", str(work),
            str(ROOT / "meta" / "py_learn" / "desktop.py"),
        ], check=True, cwd=ROOT)
        bundle = work / "dist" / "PyPath"
        shutil.copytree(standalone, bundle / "web")
        (bundle / "runtime").mkdir()
        shutil.copy2(node, bundle / "runtime" / Path(node).name)
        shutil.copy2(ROOT / "README.md", bundle / "README.md")
        # Only committed course templates belong in a public release.
        subprocess.run(["git", "archive", "HEAD", "learning", "meta/course.json", "meta/py_learn", "pyproject.toml", "uv.lock" , "--output", str(work / "course.zip")], cwd=ROOT, check=True)
        shutil.unpack_archive(work / "course.zip", bundle / "course")
        shutil.copy2(ROOT / "README.md", bundle / "course" / "README.md")
        archive = shutil.make_archive(str(output / f"PyPath-{args.target}"), "gztar" if args.target == "macos-arm64" else "zip", root_dir=bundle.parent, base_dir="PyPath")
    path = Path(archive)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    path.with_name(path.name + ".sha256").write_text(f"{digest}  {path.name}\n", encoding="utf-8")
    print(path)


if __name__ == "__main__":
    main()
