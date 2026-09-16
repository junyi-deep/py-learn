import unittest
from unittest import mock

from scripts.smoke_binary import cleanup_workspace


class SmokeCleanupTests(unittest.TestCase):
    @mock.patch("scripts.smoke_binary.time.sleep")
    def test_retries_transient_executable_lock(self, sleep):
        workspace = mock.Mock()
        workspace.cleanup.side_effect = [PermissionError("node.exe locked"), None]
        cleanup_workspace(workspace, attempts=3)
        self.assertEqual(workspace.cleanup.call_count, 2)
        sleep.assert_called_once_with(.25)

    @mock.patch("scripts.smoke_binary.time.sleep")
    def test_permanent_lock_still_fails(self, sleep):
        workspace = mock.Mock()
        workspace.cleanup.side_effect = PermissionError("still locked")
        with self.assertRaises(PermissionError):
            cleanup_workspace(workspace, attempts=3)
        self.assertEqual(workspace.cleanup.call_count, 3)
        self.assertEqual(sleep.call_count, 2)

    def test_other_errors_are_not_hidden(self):
        workspace = mock.Mock()
        workspace.cleanup.side_effect = OSError("unexpected error")
        with self.assertRaises(OSError):
            cleanup_workspace(workspace)
        workspace.cleanup.assert_called_once()
