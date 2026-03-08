import { FolderOpen, Cookie, RefreshCw, Info, X, RotateCcw, Shield, FileType } from "lucide-react";
import { useState, useEffect } from "react";
import { browseFolder, getConfig, saveConfig, type AppConfig } from "@/lib/bridge";
import { toast } from "sonner";

const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const [config, setConfig] = useState<AppConfig>({
    downloadFolder: "C:\\Users\\User\\Downloads\\FB Videos",
    cookieSource: "firefox",
    cookiePath: "",
    autoUpdateYtdlp: true,
    retryFailed: true,
    duplicateDetection: true,
    namingMode: "with_caption",
  });

  // Load config from bridge
  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  const handleBrowse = async () => {
    const folder = await browseFolder();
    if (folder) {
      setConfig((prev) => ({ ...prev, downloadFolder: folder }));
    }
  };

  const handleSave = async () => {
    await saveConfig(config);
    toast.success("Settings saved");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border/60 shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-muted/20">
          <h2 className="text-[14px] font-bold text-foreground">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <SettingRow icon={FolderOpen} title="Download Folder" desc="Where videos will be saved">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                {config.downloadFolder}
              </span>
              <button onClick={handleBrowse} className="text-[11px] text-primary font-bold hover:text-primary/80 transition-colors">Browse</button>
            </div>
          </SettingRow>

          <SettingRow icon={Cookie} title="Cookie Source" desc="Browser cookies for authenticated downloads">
            <select
              value={config.cookieSource}
              onChange={(e) => setConfig((prev) => ({ ...prev, cookieSource: e.target.value }))}
              className="bg-background/60 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="firefox">Firefox</option>
              <option value="chrome">Chrome</option>
              <option value="edge">Edge</option>
              <option value="brave">Brave</option>
              <option value="file">cookies.txt file</option>
            </select>
          </SettingRow>

          <SettingRow icon={RefreshCw} title="Auto-update yt-dlp" desc="Check for updates every 7 days">
            <ToggleSwitch checked={config.autoUpdateYtdlp} onChange={(v) => setConfig((prev) => ({ ...prev, autoUpdateYtdlp: v }))} />
          </SettingRow>

          <SettingRow icon={RotateCcw} title="Retry Failed Downloads" desc="Automatically retry up to 3 times">
            <ToggleSwitch checked={config.retryFailed} onChange={(v) => setConfig((prev) => ({ ...prev, retryFailed: v }))} />
          </SettingRow>

          <SettingRow icon={Shield} title="Duplicate Detection" desc="Skip already downloaded videos">
            <ToggleSwitch checked={config.duplicateDetection} onChange={(v) => setConfig((prev) => ({ ...prev, duplicateDetection: v }))} />
          </SettingRow>

          <SettingRow icon={FileType} title="File Naming" desc="How downloaded files are named">
            <select
              value={config.namingMode}
              onChange={(e) => setConfig((prev) => ({ ...prev, namingMode: e.target.value as AppConfig["namingMode"] }))}
              className="bg-background/60 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="with_caption">01 [VideoID].mp4</option>
              <option value="without_caption">Caption 01.mp4</option>
            </select>
          </SettingRow>
        </div>

        <div className="px-5 py-3 border-t border-border/50 flex justify-end gap-2 bg-muted/10">
          <button onClick={onClose} className="px-4 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-primary text-primary-foreground text-[11px] font-bold rounded-lg hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({ icon: Icon, title, desc, children }: {
  icon: React.ElementType; title: string; desc: string; children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-10 h-[22px] bg-muted rounded-full peer peer-checked:bg-primary transition-colors duration-200 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200 peer-checked:after:translate-x-[18px] peer-checked:after:bg-primary-foreground" />
  </label>
);

export default SettingsPanel;
