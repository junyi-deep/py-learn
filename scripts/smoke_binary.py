"""Exercise the extracted release, outside the repository, without host Node."""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import re
import shutil
import signal
import socket
import subprocess
import tempfile
import time
import urllib.request


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="pypath-smoke-") as temporary:
        root = Path(temporary)
        shutil.unpack_archive(args.archive.resolve(), root)
        executable = root / "PyPath" / ("PyPath.exe" if os.name == "nt" else "PyPath")
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            port = probe.getsockname()[1]
        env = {**os.environ, "PATH": ""}
        with (root / "server.log").open("w+") as log:
            process = subprocess.Popen([str(executable), "--no-browser", "--port", str(port)], cwd=root, env=env, stdout=log, stderr=log, start_new_session=os.name != "nt")
            opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            base = f"http://127.0.0.1:{port}"
            try:
                for _ in range(120):
                    if process.poll() is not None:
                        raise RuntimeError("Launcher exited before becoming ready")
                    try:
                        with opener.open(base + "/foundations", timeout=1) as response:
                            html = response.read().decode()
                            assert "PyPath" in html
                            break
                    except OSError:
                        time.sleep(.25)
                else:
                    raise RuntimeError("Server timed out")
                for route in ["/", "/projects", "/algorithms"]:
                    with opener.open(base + route, timeout=15) as response:
                        assert response.status == 200, route
                assets = re.findall(r'(?:src|href)="(/[^"?]+\.(?:js|css))', html)
                assert assets, "No client assets in HTML"
                for asset in set(assets):
                    with opener.open(base + asset, timeout=15) as response:
                        assert response.status == 200 and response.read(), asset
                print(f"PASS: native launcher, four routes, {len(set(assets))} assets; no host Node/Python required")
            finally:
                if os.name == "nt":
                    subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"], check=False)
                else:
                    os.killpg(process.pid, signal.SIGTERM)
                process.wait(timeout=10)
                log.seek(0)
                print(log.read())


if __name__ == "__main__":
    main()
