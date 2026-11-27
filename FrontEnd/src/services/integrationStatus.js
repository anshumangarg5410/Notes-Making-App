import api from './api';

let cachedFlags = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 30000;

/**
 * Resolves Google Login and Google Drive availability flags
 * combining build-time env defaults and live backend /api/health config.
 */
export async function getIntegrationFlags(forceRefresh = false) {
  const envLoginFlag = import.meta.env.VITE_GOOGLE_LOGIN_ENABLED;
  const envDriveFlag = import.meta.env.VITE_GOOGLE_DRIVE_ENABLED;

  const envDefaults = {
    googleLoginEnabled: envLoginFlag !== undefined ? envLoginFlag.toLowerCase() === 'true' : true,
    googleDriveEnabled: envDriveFlag !== undefined ? envDriveFlag.toLowerCase() === 'true' : true
  };

  const now = Date.now();
  if (!forceRefresh && cachedFlags && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedFlags;
  }

  try {
    const res = await api.get('/health', { timeout: 4000 });
    const serverIntegrations = res?.data?.integrations;
    if (serverIntegrations) {
      cachedFlags = {
        googleLoginEnabled:
          envDefaults.googleLoginEnabled && Boolean(serverIntegrations.googleLoginEnabled),
        googleDriveEnabled:
          envDefaults.googleDriveEnabled && Boolean(serverIntegrations.googleDriveEnabled)
      };
      lastFetchedAt = now;
      return cachedFlags;
    }
  } catch (_) {
    // Offline or server unreachable — fall back to env flags without crashing
  }

  return envDefaults;
}

export function isDriveFlagDisabledInEnv() {
  const flag = import.meta.env.VITE_GOOGLE_DRIVE_ENABLED;
  return flag !== undefined && flag.toLowerCase() === 'false';
}

export function isLoginFlagDisabledInEnv() {
  const flag = import.meta.env.VITE_GOOGLE_LOGIN_ENABLED;
  return flag !== undefined && flag.toLowerCase() === 'false';
}
