import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'token';
// Secret key used to encrypt the JWT before storing it in localStorage
const STORAGE_SECRET = 'eduadmin_aes_vault_key_2026_client';

/**
 * Encrypt and store the raw JWT token in localStorage.
 * LocalStorage will only contain the encrypted ciphertext (e.g. U2FsdGVkX1...).
 *
 * @param {string} rawToken - The unencrypted JWT from backend authentication
 */
export const setEncryptedToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return;
  try {
    const encrypted = CryptoJS.AES.encrypt(rawToken.trim(), STORAGE_SECRET).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (err) {
    console.error('Failed to encrypt token for localStorage:', err);
    // Graceful fallback to prevent user lockout
    localStorage.setItem(STORAGE_KEY, rawToken);
  }
};

/**
 * Retrieve and decrypt the JWT token from localStorage.
 * This is called by the HTTP client (Axios) when constructing the
 * Authorization: Bearer <decryptedToken> header.
 *
 * @returns {string|null} The decrypted raw JWT, or null if none exists
 */
export const getDecryptedToken = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    // If already raw JWT (e.g. legacy/mock sessions starting with eyJ), return directly
    if (stored.startsWith('eyJ')) {
      return stored;
    }

    const bytes = CryptoJS.AES.decrypt(stored, STORAGE_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (decrypted && decrypted.trim().length > 0) {
      return decrypted.trim();
    }

    // In case decryption yields empty string, return stored fallback
    return stored;
  } catch (err) {
    console.error('Failed to decrypt token from localStorage:', err);
    return localStorage.getItem(STORAGE_KEY);
  }
};

/**
 * Remove the encrypted token from localStorage on logout or session invalidation.
 */
export const removeEncryptedToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not remove token from localStorage:', err);
  }
};

/**
 * Check if an active token is stored in localStorage.
 */
export const hasStoredToken = () => {
  return Boolean(getDecryptedToken());
};

