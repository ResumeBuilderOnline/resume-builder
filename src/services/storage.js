/**
 * Storage service.
 * Wraps localStorage with a configurable prefix and JSON serialization.
 */

const PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'resume_builder_';

/**
 * Get an item from storage.
 * @param {string} key
 * @param {*} [fallback]
 * @returns {*}
 */
export function getItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error('Storage read error:', error);
    return fallback;
  }
}

/**
 * Save an item to storage.
 * @param {string} key
 * @param {*} value
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Storage write error:', error);
  }
}

/**
 * Remove an item from storage.
 * @param {string} key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
}

/**
 * Clear all app-prefixed items.
 */
export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Storage clear error:', error);
  }
}

/**
 * Storage keys used across the app.
 */
export const STORAGE_KEYS = {
  RESUMES: 'resumes',
  ACTIVE_RESUME_ID: 'active_resume_id',
  SETTINGS: 'settings',
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  STORAGE_KEYS,
};
