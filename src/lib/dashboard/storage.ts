// src/lib/dashboard/storage.ts
// localStorage utilities for dashboard preferences

const STORAGE_KEY = 'mxwll-dashboard-set';
const CUSTOM_WIDGETS_KEY = 'mxwll-custom-widgets';

/**
 * Get selected set ID from localStorage
 * Returns 'default' if nothing stored or on server
 */
export function getSelectedSetId(): string {
  if (typeof window === 'undefined') return 'default';
  try {
    return localStorage.getItem(STORAGE_KEY) || 'default';
  } catch {
    return 'default';
  }
}

/**
 * Save selected set ID to localStorage
 */
export function setSelectedSetId(setId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, setId);
  } catch (e) {
    console.warn('Failed to save dashboard preference:', e);
  }
}

/**
 * Get custom widget selection (for future registered users)
 * Returns empty array if nothing stored
 */
export function getCustomWidgets(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CUSTOM_WIDGETS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save custom widget selection
 */
export function setCustomWidgets(widgetIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(widgetIds));
  } catch (e) {
    console.warn('Failed to save custom widgets:', e);
  }
}

/**
 * Clear all dashboard preferences
 */
export function clearDashboardPreferences(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOM_WIDGETS_KEY);
  } catch (e) {
    console.warn('Failed to clear preferences:', e);
  }
}
