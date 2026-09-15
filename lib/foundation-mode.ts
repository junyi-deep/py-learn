const MODE_KEY = 'pypath.foundation-mode.v1';

export function readFoundationMode(): boolean {
  const requested = new URLSearchParams(window.location.search).get('mode');
  if (requested === 'practice' || requested === 'learn') return requested === 'practice';
  try {
    return window.localStorage.getItem(MODE_KEY) !== 'learn';
  } catch {
    return true;
  }
}

export function saveFoundationMode(practice: boolean) {
  try {
    window.localStorage.setItem(MODE_KEY, practice ? 'practice' : 'learn');
  } catch {
    // The current mode remains usable when browser storage is unavailable.
  }
}
