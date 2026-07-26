/**
 * Theme Manager
 * Handles dark/light mode switching with localStorage persistence
 * and system theme detection
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'theme-preference';
    this.THEME_ATTRIBUTE = 'data-theme';
    this.TRANSITION_CLASS = 'theme-transitioning';
    this.VALID_THEMES = ['light', 'dark'];
    this.toggleButton = null;
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.applyStoredTheme();
    this.attachEventListeners();
    this.observeSystemThemeChanges();
  }

  /**
   * Apply stored theme or system preference
   */
  applyStoredTheme() {
    const storedTheme = this.getStoredTheme();
    const theme = storedTheme || this.getSystemTheme();
    this.setTheme(theme, false);
  }

  /**
   * Get theme from localStorage
   */
  getStoredTheme() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored && this.VALID_THEMES.includes(stored) ? stored : null;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Set theme and store preference
   * @param {string} theme - 'light' or 'dark'
   * @param {boolean} useTransition - Whether to animate the transition
   */
  setTheme(theme, useTransition = true) {
    if (!this.VALID_THEMES.includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Using system preference.`);
      theme = this.getSystemTheme();
    }

    // Add transition class for smooth switching
    if (useTransition && !this.prefersReducedMotion()) {
      document.documentElement.classList.add(this.TRANSITION_CLASS);
    }

    // Set the theme attribute
    document.documentElement.setAttribute(this.THEME_ATTRIBUTE, theme);

    // Store preference
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not store theme preference:', e);
    }

    // Update toggle button state if it exists
    this.updateToggleButton(theme);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    // Remove transition class after animation completes
    if (useTransition && !this.prefersReducedMotion()) {
      setTimeout(() => {
        document.documentElement.classList.remove(this.TRANSITION_CLASS);
      }, 300);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(this.THEME_ATTRIBUTE) || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, true);
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Find theme toggle button
    this.toggleButton = document.querySelector('[data-theme-toggle]');
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleTheme());
      this.toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    }

    // Listen for keyboard shortcut (e.g., Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyD') {
        this.toggleTheme();
      }
    });
  }

  /**
   * Observe system theme changes
   */
  observeSystemThemeChanges() {
    if (!window.matchMedia) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes in system theme preference
    darkModeQuery.addEventListener('change', (e) => {
      // Only apply if user hasn't set a preference
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  }

  /**
   * Update toggle button appearance
   */
  updateToggleButton(theme) {
    if (!this.toggleButton) return;

    const isDark = theme === 'dark';
    this.toggleButton.setAttribute('aria-pressed', isDark);
    this.toggleButton.classList.toggle('dark-mode-active', isDark);
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute(this.THEME_ATTRIBUTE) || 'light';
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
