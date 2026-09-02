from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from py_learn import cli


class CliTests(unittest.TestCase):
    @mock.patch("py_learn.cli.subprocess.call", return_value=0)
    @mock.patch("py_learn.cli.shutil.which", return_value="/usr/local/bin/npm")
    def test_missing_web_dependencies_are_installed_with_npm_ci(
        self,
        npm_path: mock.Mock,
        subprocess_call: mock.Mock,
    ) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            lock_file = root / "package-lock.json"
            lock_file.write_text("{}\n", encoding="utf-8")
            with (
                mock.patch.object(cli, "PACKAGE_LOCK_FILE", lock_file),
                mock.patch.object(
                    cli,
                    "NODE_MODULES_MARKER",
                    root / "node_modules" / ".package-lock.json",
                ),
            ):
                self.assertEqual(cli.ensure_web_dependencies(), 0)

        npm_path.assert_called_once_with("npm")
        subprocess_call.assert_called_once_with(
            ["npm", "ci", "--no-audit", "--no-fund"],
            cwd=cli.ROOT,
        )

    @mock.patch("py_learn.cli.subprocess.call", return_value=0)
    @mock.patch("py_learn.cli.ensure_web_dependencies", return_value=0)
    def test_build_runs_web_build_after_dependencies(
        self,
        ensure_dependencies: mock.Mock,
        subprocess_call: mock.Mock,
    ) -> None:
        self.assertEqual(cli.run_web_script("build"), 0)
        ensure_dependencies.assert_called_once_with()
        subprocess_call.assert_called_once_with(["npm", "run", "build"], cwd=cli.ROOT)

    @mock.patch("py_learn.cli.subprocess.call")
    @mock.patch("py_learn.cli.ensure_web_dependencies", return_value=2)
    def test_web_script_stops_when_dependency_setup_fails(
        self,
        ensure_dependencies: mock.Mock,
        subprocess_call: mock.Mock,
    ) -> None:
        self.assertEqual(cli.run_web_script("dev"), 2)
        ensure_dependencies.assert_called_once_with()
        subprocess_call.assert_not_called()


if __name__ == "__main__":
    unittest.main()
