import { Download, Search, Square, RefreshCw, FolderOpen, FileText, Cookie } from "lucide-react";
import { useState } from "react";

const UrlInputPanel = ({ onDownload }: { onDownload: () => void }) => {
  const [urls, setUrls] = useState("");
  const [browser, setBrowser] = useState("firefox");

  return (
    <div className="space-y-3">
      {/* URL Input */}
      <div className="bg-card rounded-lg border border-border p-4">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Paste Facebook URLs (one per line)
        </label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"https://www.facebook.com/reel/123456789\nhttps://www.facebook.com/watch/?v=987654321"}
          className="w-full h-28 bg-muted/50 border border-border rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary font-mono scrollbar-thin"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-muted-foreground">
            {urls.split("\n").filter(Boolean).length} link(s) detected
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">
            File: 01 [1207845171465713].mp4
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <ActionBtn icon={Download} label="Download" primary onClick={onDownload} />
        <ActionBtn icon={Search} label="Fetch Metadata" />
        <ActionBtn icon={Square} label="Stop" variant="destructive" />
        <ActionBtn icon={RefreshCw} label="Update yt-dlp" />
        <ActionBtn icon={FolderOpen} label="Save Folder" />
        <ActionBtn icon={FileText} label="Export Captions" />
      </div>

      {/* Cookie Selector */}
      <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-4 py-2.5">
        <Cookie className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Cookies:</span>
        <select
          value={browser}
          onChange={(e) => setBrowser(e.target.value)}
          className="bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="firefox">Firefox</option>
          <option value="chrome">Chrome</option>
          <option value="edge">Edge</option>
        </select>
        <button className="ml-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
          Load cookies.txt
        </button>
      </div>
    </div>
  );
};

const ActionBtn = ({
  icon: Icon,
  label,
  primary,
  variant,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  primary?: boolean;
  variant?: "destructive";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 active:scale-95
      ${primary
        ? "bg-primary text-primary-foreground hover:brightness-110 glow-primary"
        : variant === "destructive"
        ? "bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25"
        : "bg-secondary text-secondary-foreground border border-border hover:bg-muted"
      }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default UrlInputPanel;
