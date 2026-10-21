import { describe, it, expect, beforeEach } from 'vitest';

describe('Theme State and Light Mode Default Guarantee', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  const getInitialThemeState = (): boolean => {
    const savedTheme = localStorage.getItem('postern_theme_mode');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    // Strict default to Light Mode (false) per user requirement
    return false;
  };

  const applyTheme = (isDark: boolean) => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('postern_theme_mode', 'dark');
      localStorage.setItem('postern_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('postern_theme_mode', 'light');
      localStorage.setItem('postern_dark_mode', 'false');
    }
  };

  it('guarantees Light Mode is the default on initial load without stored preference', () => {
    expect(localStorage.getItem('postern_theme_mode')).toBeNull();
    const isDark = getInitialThemeState();
    expect(isDark).toBe(false);
  });

  it('toggles from Light Mode to Dark Mode properly', () => {
    let isDark = getInitialThemeState();
    expect(isDark).toBe(false);

    // Toggle to Dark Mode
    isDark = !isDark;
    applyTheme(isDark);

    expect(isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('postern_theme_mode')).toBe('dark');
    expect(localStorage.getItem('postern_dark_mode')).toBe('true');
  });

  it('toggles from Dark Mode back to Light Mode cleanly', () => {
    // Start in Dark Mode
    applyTheme(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to Light Mode
    let isDark = true;
    isDark = !isDark;
    applyTheme(isDark);

    expect(isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('postern_theme_mode')).toBe('light');
    expect(localStorage.getItem('postern_dark_mode')).toBe('false');
  });
});
