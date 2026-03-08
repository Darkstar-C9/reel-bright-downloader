/**
 * PyWebView Bridge — communicates with Python backend via window.pywebview.api
 * Falls back to mock behavior when running in browser (dev mode).
 */

import type { DownloadItem } from "@/components/DownloadTable";

// ─── Types ───────────────────────────────────────────────────────
export interface LicenseStatus {
  valid: boolean;
  plan: string;
  daysLeft: number;
  isLifetime: boolean;
  message?: string;
}

export interface AppConfig {
  downloadFolder: string;
  cookieSource: string;
  cookiePath: string;
  autoUpdateYtdlp: boolean;
  retryFailed: boolean;
  duplicateDetection: boolean;
  namingMode: "with_caption" | "without_caption";
}

export interface LogEntry {
  time: string;
  level: "DEBUG" | "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SYSTEM";
  message: string;
}

export interface StatusUpdate {
  totalLinks: number;
  successCount: number;
  errorCount: number;
  ytdlpVersion: string;
  ffmpegVersion: string;
}

export interface CrashBannerData {
  show: boolean;
  pendingUrls: number;
  crashTime: string;
}

// ─── Callback registry ──────────────────────────────────────────
type Callbacks = {
  onRowUpdate?: (items: DownloadItem[]) => void;
  onDownloadDone?: (summary: { success: number; failed: number }) => void;
  onLog?: (entry: LogEntry) => void;
  onStatusUpdate?: (status: StatusUpdate) => void;
  onCrashBanner?: (data: CrashBannerData) => void;
};

let _callbacks: Callbacks = {};

export function registerCallbacks(cbs: Partial<Callbacks>) {
  _callbacks = { ..._callbacks, ...cbs };
}

// Expose callbacks to Python so it can call them
if (typeof window !== "undefined") {
  (window as any).__bridge_callbacks = {
    onRowUpdate: (items: DownloadItem[]) => _callbacks.onRowUpdate?.(items),
    onDownloadDone: (summary: { success: number; failed: number }) => _callbacks.onDownloadDone?.(summary),
    onLog: (entry: LogEntry) => _callbacks.onLog?.(entry),
    onStatusUpdate: (status: StatusUpdate) => _callbacks.onStatusUpdate?.(status),
    onCrashBanner: (data: CrashBannerData) => _callbacks.onCrashBanner?.(data),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────
function getApi(): any | null {
  return (window as any)?.pywebview?.api ?? null;
}

function isBridgeAvailable(): boolean {
  return getApi() !== null;
}

// ─── Bridge API ──────────────────────────────────────────────────

/** Activate license key — returns LicenseStatus */
export async function activate(key: string): Promise<LicenseStatus> {
  const api = getApi();
  if (api?.activate) {
    return await api.activate(key);
  }
  // Mock fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      if (key.includes("FBPRO")) {
        resolve({ valid: true, plan: "yearly", daysLeft: 247, isLifetime: false, message: "✅ Valid | Plan: YEARLY | 247 days left" });
      } else {
        resolve({ valid: false, plan: "", daysLeft: 0, isLifetime: false, message: "❌ Invalid license key format" });
      }
    }, 1500);
  });
}

/** Get current license status */
export async function getLicenseStatus(): Promise<LicenseStatus | null> {
  const api = getApi();
  if (api?.getLicenseStatus) {
    return await api.getLicenseStatus();
  }
  // Mock: return null (not activated yet) or a default
  return null;
}

/** Start downloading URLs */
export async function startDownload(
  urls: string[],
  cookieSource: string,
  cookiePath: string
): Promise<{ started: boolean; count: number }> {
  const api = getApi();
  if (api?.startDownload) {
    return await api.startDownload(urls, cookieSource, cookiePath);
  }
  // Mock fallback
  return { started: true, count: urls.length };
}

/** Stop all downloads */
export async function stopDownload(): Promise<void> {
  const api = getApi();
  if (api?.stopDownload) {
    return await api.stopDownload();
  }
}

/** Pause / resume */
export async function togglePause(): Promise<boolean> {
  const api = getApi();
  if (api?.togglePause) {
    return await api.togglePause();
  }
  return false;
}

/** Resume crash recovery downloads */
export async function resumeCrashRecovery(): Promise<void> {
  const api = getApi();
  if (api?.resumeCrashRecovery) {
    return await api.resumeCrashRecovery();
  }
}

/** Dismiss crash banner */
export async function dismissCrashBanner(): Promise<void> {
  const api = getApi();
  if (api?.dismissCrashBanner) {
    return await api.dismissCrashBanner();
  }
}

/** Browse for folder — returns selected path or null */
export async function browseFolder(): Promise<string | null> {
  const api = getApi();
  if (api?.browseFolder) {
    return await api.browseFolder();
  }
  return null; // No-op in browser
}

/** Get full app config */
export async function getConfig(): Promise<AppConfig> {
  const api = getApi();
  if (api?.getConfig) {
    return await api.getConfig();
  }
  // Mock defaults
  return {
    downloadFolder: "C:\\Users\\User\\Downloads\\FB Videos",
    cookieSource: "firefox",
    cookiePath: "",
    autoUpdateYtdlp: true,
    retryFailed: true,
    duplicateDetection: true,
    namingMode: "with_caption",
  };
}

/** Save app config */
export async function saveConfig(config: Partial<AppConfig>): Promise<void> {
  const api = getApi();
  if (api?.saveConfig) {
    return await api.saveConfig(config);
  }
}

/** Update yt-dlp */
export async function updateYtdlp(): Promise<string> {
  const api = getApi();
  if (api?.updateYtdlp) {
    return await api.updateYtdlp();
  }
  return "yt-dlp is already up to date (2026.03.01)";
}

/** Fetch metadata for URLs */
export async function fetchMetadata(urls: string[]): Promise<any[]> {
  const api = getApi();
  if (api?.fetchMetadata) {
    return await api.fetchMetadata(urls);
  }
  return [];
}

/** Export utility */
export { isBridgeAvailable };
