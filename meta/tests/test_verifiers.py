from __future__ import annotations

import json
import tempfile
import textwrap
import unittest
from pathlib import Path

from py_learn.verifiers import verify_file_organizer, verify_offline_api


class VerifierTests(unittest.TestCase):
    def make_project(self, solution: str) -> Path:
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        project = Path(temporary.name)
        (project / "solution.py").write_text(textwrap.dedent(solution), encoding="utf-8")
        return project

    def test_file_organizer_accepts_exact_artifact(self) -> None:
        expected = {
            "groups": {
                "document": ["report.pdf"],
                "image": ["photo.JPG"],
                "other": ["README"],
                "text": ["notes.txt"],
            },
            "total": 4,
        }
        project = self.make_project(
            f"""
            import json
            from pathlib import Path
            output = Path("output/plan.json")
            output.parent.mkdir(parents=True)
            output.write_text(json.dumps({expected!r}), encoding="utf-8")
            """
        )
        self.assertTrue(verify_file_organizer(project).ok)

    def test_file_organizer_rejects_wrong_artifact(self) -> None:
        project = self.make_project(
            """
            import json
            from pathlib import Path
            output = Path("output/plan.json")
            output.parent.mkdir(parents=True)
            output.write_text(json.dumps({"groups": {}, "total": 0}), encoding="utf-8")
            """
        )
        result = verify_file_organizer(project)
        self.assertFalse(result.ok)
        self.assertIn("预期", result.message)

    def test_offline_api_uses_dynamic_local_server(self) -> None:
        project = self.make_project(
            """
            import json, os
            from pathlib import Path
            from urllib.request import urlopen
            with urlopen(os.environ["PYPATH_API_URL"], timeout=2) as response:
                data = json.load(response)
            result = {
                "active": data["active"],
                "display": f"{data['name']} (#{data['id']})",
                "skill_count": len(data["skills"]),
            }
            output = Path("output/profile.json")
            output.parent.mkdir(parents=True)
            output.write_text(json.dumps(result), encoding="utf-8")
            """
        )
        self.assertTrue(verify_offline_api(project).ok)


if __name__ == "__main__":
    unittest.main()
