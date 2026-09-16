"""Portable local web launcher. Bundled Node runs the standalone web build."""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.request
import webbrowser


def main() -> int:
    parser = argparse.ArgumentParser(description="PyPath portable learning app")
    parser.add_argument("--port", type=int, default=3000)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("port must be between 1 and 65535")
    root = Path(sys.executable).resolve().parent
    node = root / "runtime" / ("node.exe" if os.name == "nt" else "node")
    server = root / "web" / "server.js"
    if not node.is_file() or not server.is_file():
        print("Missing runtime or web files. Extract the entire release archive.", file=sys.stderr)
        return 1
    try:
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", args.port))
    except OSError:
        print(f"Port {args.port} is in use. Stop the other service or use --port 3001.", file=sys.stderr)
        return 1
    env = {**os.environ, "HOST": "127.0.0.1", "PORT": str(args.port), "NODE_ENV": "production"}
    # Keep bundled Node independent of the host's development configuration.
    env.pop("NODE_OPTIONS", None)
    env.pop("NODE_PATH", None)
    process = subprocess.Popen([str(node), str(server)], cwd=server.parent, env=env)
    url = f"http://127.0.0.1:{args.port}/foundations"
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        for _ in range(120):
            if process.poll() is not None:
                return process.returncode or 1
            try:
                with opener.open(url, timeout=1) as response:
                    if response.status == 200:
                        break
            except OSError:
                time.sleep(.25)
        else:
            print("The local server did not become ready.", file=sys.stderr)
            return 1
        print(f"PyPath: {url}\nPress Ctrl+C to stop.", flush=True)
        if not args.no_browser:
            webbrowser.open(url)
        return process.wait()
    except KeyboardInterrupt:
        return 0
    finally:
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    raise SystemExit(main())
