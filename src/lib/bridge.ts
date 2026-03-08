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
export function isPyWebview(): boolean {
  return typeof (window as any).pywebview !== "undefined";
}

function getApi(): any | null {
  return (window as any)?.pywebview?.api ?? null;
}

function isBridgeAvailable(): boolean {
  return getApi() !== null;
}

// ─── Bridge API ──────────────────────────────────────────────────

/** Activate license key — returns LicenseStatus */
export async function activate(key: string): Promise<LicenseStatus> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.activate(key);
    } catch (e) {
      console.error("[bridge] activate error:", e);
      return { valid: false, plan: "", daysLeft: 0, isLifetime: false, message: "❌ Bridge error: " + String(e) };
    }
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
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.get_license_status();
    } catch (e) {
      console.error("[bridge] getLicenseStatus error:", e);
      return null;
    }
  }
  return null;
}

/** Start downloading URLs */
export async function startDownload(
  urls: string[],
  cookieSource: string,
  cookiePath: string
): Promise<{ started: boolean; count: number }> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.start_download(urls, cookieSource, cookiePath);
    } catch (e) {
      console.error("[bridge] startDownload error:", e);
      return { started: false, count: 0 };
    }
  }
  return { started: true, count: urls.length };
}

/** Stop all downloads */
export async function stopDownload(): Promise<void> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      await api.stop_download();
    } catch (e) {
      console.error("[bridge] stopDownload error:", e);
    }
    return;
  }
}

/** Pause / resume */
export async function togglePause(): Promise<boolean> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.toggle_pause();
    } catch (e) {
      console.error("[bridge] togglePause error:", e);
      return false;
    }
  }
  return false;
}

/** Resume crash recovery downloads */
export async function resumeCrashRecovery(): Promise<void> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      await api.resume_crash_recovery();
    } catch (e) {
      console.error("[bridge] resumeCrashRecovery error:", e);
    }
    return;
  }
}

/** Dismiss crash banner */
export async function dismissCrashBanner(): Promise<void> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      await api.dismiss_crash_banner();
    } catch (e) {
      console.error("[bridge] dismissCrashBanner error:", e);
    }
    return;
  }
}

/** Browse for folder — returns selected path or null */
export async function browseFolder(): Promise<string | null> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.browse_folder();
    } catch (e) {
      console.error("[bridge] browseFolder error:", e);
      return null;
    }
  }
  return null;
}

/** Get full app config */
export async function getConfig(): Promise<AppConfig> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.get_config();
    } catch (e) {
      console.error("[bridge] getConfig error:", e);
    }
  }
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
  if (isPyWebview()) {
    try {
      const api = getApi();
      await api.save_config(config);
    } catch (e) {
      console.error("[bridge] saveConfig error:", e);
    }
    return;
  }
}

/** Update yt-dlp */
export async function updateYtdlp(): Promise<string> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.update_ytdlp();
    } catch (e) {
      console.error("[bridge] updateYtdlp error:", e);
      return "❌ Update failed: " + String(e);
    }
  }
  return "yt-dlp is already up to date (2026.03.01)";
}

/** Fetch metadata for URLs */
export async function fetchMetadata(urls: string[]): Promise<any[]> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.fetch_metadata(urls);
    } catch (e) {
      console.error("[bridge] fetchMetadata error:", e);
      return [];
    }
  }
  return [];
}

/** Export captions */
export async function exportCaptions(): Promise<string> {
  if (isPyWebview()) {
    try {
      const api = getApi();
      return await api.export_captions();
    } catch (e) {
      console.error("[bridge] exportCaptions error:", e);
      return "❌ Export failed: " + String(e);
    }
  }
  return "No captions to export (mock)";
}

/** Export utility */
export { isBridgeAvailable };
