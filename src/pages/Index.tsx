import { useState, useCallback } from "react";
import { Settings, Info, Key, History } from "lucide-react";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import UrlInputPanel from "@/components/UrlInputPanel";
import DownloadTable from "@/components/DownloadTable";
import LogPanel from "@/components/LogPanel";
import StatusBar from "@/components/StatusBar";
import ActivationScreen from "@/components/ActivationScreen";
import SettingsPanel from "@/components/SettingsPanel";
import AboutScreen from "@/components/AboutScreen";
import CrashRecoveryBanner from "@/components/CrashRecoveryBanner";
import DownloadHistory from "@/components/DownloadHistory";

const Index = () => {
  const [activated, setActivated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [downloadKey, setDownloadKey] = useState(0);
  const [showCrashRecovery, setShowCrashRecovery] = useState(true);

  const handleDownload = useCallback(() => {
    setIsDownloading(false);
    setDownloadKey((k) => k + 1);
    setShowCrashRecovery(false);
    toast.info("🚀 Starting download queue...", { duration: 2000 });
    setTimeout(() => {
      setIsDownloading(true);
      toast.success("Download started — 5 items in queue");
    }, 50);
  }, []);

  const handleStop = useCallback(() => {
    setIsDownloading(false);
    setIsPaused(false);
    toast.warning("⏹ Download stopped");
  }, []);

  const handleTogglePause = useCallback(() => {
    setIsPaused((p) => {
      const next = !p;
      toast.info(next ? "⏸ Downloads paused" : "▶️ Downloads resumed", { duration: 1500 });
      return next;
    });
  }, []);

  if (!activated) {
    return <ActivationScreen onActivate={() => setActivated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <AppHeader
        licenseInfo={{ plan: "yearly", daysLeft: 247, isLifetime: false }}
        onLicenseClick={() => setActivated(false)}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-0.5 px-5 py-1 border-b border-border/40 bg-card/40">
        <ToolbarBtn icon={History} label="History" onClick={() => setShowHistory(true)} />
        <ToolbarBtn icon={Settings} label="Settings" onClick={() => setShowSettings(true)} />
        <ToolbarBtn icon={Info} label="About" onClick={() => setShowAbout(true)} />
        <ToolbarBtn icon={Key} label="License" onClick={() => setActivated(false)} />
      </div>

      {/* Crash Recovery Banner */}
      {showCrashRecovery && !isDownloading && (
        <CrashRecoveryBanner
          pendingUrls={3}
          crashTime="Mar 07, 2026 11:45 PM"
          onResume={handleDownload}
          onDismiss={() => setShowCrashRecovery(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin">
        <UrlInputPanel
          onDownload={handleDownload}
          onFetchMeta={() => {}}
          onStop={handleStop}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          isDownloading={isDownloading}
        />
        <DownloadTable key={downloadKey} isDownloading={isDownloading} />
        <LogPanel isDownloading={isDownloading} />
      </div>

      <StatusBar />

      {/* Modals */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showAbout && <AboutScreen onClose={() => setShowAbout(false)} />}
      {showHistory && <DownloadHistory onClose={() => setShowHistory(false)} />}
    </div>
  );
};

const ToolbarBtn = ({ icon: Icon, label, onClick }: {
  icon: React.ElementType; label: string; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default Index;
