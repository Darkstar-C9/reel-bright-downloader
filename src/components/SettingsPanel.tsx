import { FolderOpen, Cookie, RefreshCw, Info, X } from "lucide-react";

const SettingsPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="bg-card w-full max-w-lg rounded-lg border border-border shadow-2xl animate-slide-in">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-bold text-foreground">Settings</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Download Folder */}
        <SettingRow
          icon={FolderOpen}
          title="Download Folder"
          desc="Where videos will be saved"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
              C:\Users\User\Downloads\FB Videos
            </span>
            <button className="text-xs text-primary font-semibold hover:text-primary/80">Browse</button>
          </div>
        </SettingRow>

        {/* Cookies */}
        <SettingRow
          icon={Cookie}
          title="Cookie Source"
          desc="Browser cookies for authenticated downloads"
        >
          <select className="bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Firefox</option>
            <option>Chrome</option>
            <option>Edge</option>
            <option>cookies.txt file</option>
          </select>
        </SettingRow>

        {/* Auto Update */}
        <SettingRow
          icon={RefreshCw}
          title="Auto-update yt-dlp"
          desc="Check for updates every 7 days"
        >
          <ToggleSwitch defaultOn />
        </SettingRow>

        {/* Retry */}
        <SettingRow
          icon={Info}
          title="Retry Failed Downloads"
          desc="Automatically retry up to 3 times"
        >
          <ToggleSwitch defaultOn />
        </SettingRow>
      </div>

      <div className="px-5 py-3 border-t border-border flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:brightness-110 transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
);

const SettingRow = ({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const ToggleSwitch = ({ defaultOn }: { defaultOn?: boolean }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-foreground after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
    </label>
  );
};

export default SettingsPanel;
