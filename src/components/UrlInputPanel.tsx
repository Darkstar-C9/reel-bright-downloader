import {
  Download, Search, Square, RefreshCw, FolderOpen, FileText,
  Cookie, Pause, Play, FileType, Upload, FileUp
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { startDownload, stopDownload, togglePause, browseFolder, getConfig, updateYtdlp, fetchMetadata, exportCaptions } from "@/lib/bridge";

interface UrlInputPanelProps {
  onDownload: () => void;
  onFetchMeta: () => void;
  onStop: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isDownloading: boolean;
}

const UrlInputPanel = ({
  onDownload, onFetchMeta, onStop, isPaused, onTogglePause, isDownloading,
}: UrlInputPanelProps) => {
  const [urls, setUrls] = useState("");
  const [browser, setBrowser] = useState("firefox");
  const [namingMode, setNamingMode] = useState<"with_caption" | "without_caption">("with_caption");
  const [downloadFolder, setDownloadFolder] = useState("C:\\Users\\User\\Downloads\\FB Videos");

  const urlCount = urls.split("\n").filter((l) => l.trim()).length;
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load config from bridge on mount
  useEffect(() => {
    getConfig().then((cfg) => {
      setDownloadFolder(cfg.downloadFolder);
      setBrowser(cfg.cookieSource);
      setNamingMode(cfg.namingMode);
    });
  }, []);

  const handleDownloadClick = useCallback(async () => {
    const urlList = urls.split("\n").filter((l) => l.trim());
    if (urlList.length === 0) {
      toast.error("No URLs to download");
      return;
    }
    try {
      const result = await startDownload(urlList, browser, "");
      if (result.started) {
        onDownload();
      }
    } catch {
      toast.error("Failed to start download");
    }
  }, [urls, browser, onDownload]);

  const handleStopClick = useCallback(async () => {
    await stopDownload();
    onStop();
  }, [onStop]);

  const handleTogglePauseClick = useCallback(async () => {
    await togglePause();
    onTogglePause();
  }, [onTogglePause]);

  const handleBrowseFolder = useCallback(async () => {
    const folder = await browseFolder();
    if (folder) {
      setDownloadFolder(folder);
      toast.success(`Folder set: ${folder}`);
    }
  }, []);

  const handleUpdateYtdlp = useCallback(async () => {
    toast.info("Checking for yt-dlp updates...");
    const msg = await updateYtdlp();
    toast.success(msg);
  }, []);

  const handleFetchMeta = useCallback(async () => {
    const urlList = urls.split("\n").filter((l) => l.trim());
    if (urlList.length === 0) { toast.error("No URLs"); return; }
    toast.info("Fetching metadata...");
    await fetchMetadata(urlList);
    onFetchMeta();
  }, [urls, onFetchMeta]);

  const handleExportCaptions = useCallback(async () => {
    toast.info("Exporting captions...");
    const msg = await exportCaptions();
    toast.success(msg);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const text = e.dataTransfer.getData("text/plain");
    if (text) {
      setUrls((prev) => (prev ? prev + "\n" + text : text));
      toast.success(`${text.split("\n").filter(l => l.trim()).length} URL(s) added from drop`);
      return;
    }
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          if (content) {
            setUrls((prev) => (prev ? prev + "\n" + content : content));
            toast.success(`${content.split("\n").filter(l => l.trim()).length} URL(s) imported from ${file.name}`);
          }
        };
        reader.readAsText(file);
      } else {
        toast.error("Only .txt files are supported");
      }
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleFileImport = useCallback(() => { fileInputRef.current?.click(); }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        setUrls((prev) => (prev ? prev + "\n" + content : content));
        toast.success(`${content.split("\n").filter(l => l.trim()).length} URL(s) imported from ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    setTimeout(() => {
      const count = urls.split("\n").filter(l => l.trim()).length;
      if (count > 0) toast.info(`${count} URL(s) in queue`);
    }, 100);
  }, [urls]);

  return (
    <div className="space-y-3 animate-slide-up">
      <input ref={fileInputRef} type="file" accept=".txt,text/plain" className="hidden" onChange={handleFileChange} />

      {/* URL Input Card */}
      <div
        className={`glass-card rounded-lg p-4 transition-all duration-200 ${isDragOver ? "ring-2 ring-primary/50 bg-primary/[0.03]" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Facebook Video / Reel URLs (one per line)
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleFileImport}
              className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <FileUp className="w-3 h-3" />
              Import .txt
            </button>
            <span className={`text-[11px] font-mono font-semibold ${urlCount > 0 ? "text-primary" : "text-muted-foreground"}`}>
              {urlCount} link{urlCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {isDragOver && (
          <div className="flex items-center justify-center h-[100px] border-2 border-dashed border-primary/40 rounded-lg bg-primary/[0.05] mb-0">
            <div className="flex flex-col items-center gap-1 text-primary">
              <FileUp className="w-6 h-6" />
              <span className="text-[12px] font-semibold">Drop URLs or .txt file here</span>
            </div>
          </div>
        )}

        {!isDragOver && (
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            onPaste={handlePaste}
            placeholder={"https://www.facebook.com/reel/123456789\nhttps://www.facebook.com/watch/?v=987654321\nhttps://fb.watch/abc123\n\n💡 Drag & drop a .txt file or paste URLs here"}
            className="w-full h-[100px] bg-background/60 border border-border/50 rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono scrollbar-thin transition-all"
          />
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <FolderOpen className="w-3 h-3" />
              <span className="font-mono max-w-[240px] truncate">{downloadFolder}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <FileType className="w-3 h-3" />
            <span className="font-mono">01 [1207845171465713].mp4</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <ActionBtn icon={Download} label="Download" primary onClick={handleDownloadClick} disabled={isDownloading} />
        <ActionBtn icon={Search} label="Fetch Metadata" onClick={handleFetchMeta} />

        {isDownloading && (
          <>
            <ActionBtn
              icon={isPaused ? Play : Pause}
              label={isPaused ? "Resume" : "Pause"}
              variant="warning"
              onClick={handleTogglePauseClick}
            />
            <ActionBtn icon={Square} label="Stop" variant="destructive" onClick={handleStopClick} />
          </>
        )}

        <div className="h-5 w-px bg-border mx-1" />
        <ActionBtn icon={RefreshCw} label="Update yt-dlp" onClick={handleUpdateYtdlp} />
        <ActionBtn icon={FolderOpen} label="Save Folder" onClick={handleBrowseFolder} />
        <ActionBtn icon={FileText} label="Export Captions" onClick={handleExportCaptions} />
      </div>

      {/* Cookie & Naming Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2 flex-1">
          <Cookie className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">Cookies:</span>
          <select
            value={browser}
            onChange={(e) => setBrowser(e.target.value)}
            className="bg-background/60 border border-border/50 rounded-md px-2 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="firefox">Firefox</option>
            <option value="chrome">Chrome</option>
            <option value="edge">Edge</option>
            <option value="brave">Brave</option>
            <option value="">None</option>
          </select>
          <button className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors ml-1">
            <Upload className="w-3 h-3" />
            cookies.txt
          </button>
          <span className="text-[10px] text-primary/60 font-mono ml-auto">Auto: {browser || "disabled"}</span>
        </div>

        <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
          <FileType className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">Naming:</span>
          <select
            value={namingMode}
            onChange={(e) => setNamingMode(e.target.value as typeof namingMode)}
            className="bg-background/60 border border-border/50 rounded-md px-2 py-1 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="with_caption">With Caption</option>
            <option value="without_caption">ID Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({
  icon: Icon, label, primary, variant, onClick, disabled,
}: {
  icon: React.ElementType;
  label: string;
  primary?: boolean;
  variant?: "destructive" | "warning";
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
      ${primary
        ? "bg-primary text-primary-foreground hover:brightness-110 glow-primary shadow-sm"
        : variant === "destructive"
        ? "bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive/20"
        : variant === "warning"
        ? "bg-warning/10 text-warning border border-warning/25 hover:bg-warning/20"
        : "bg-secondary/80 text-secondary-foreground border border-border/50 hover:bg-secondary hover:border-border"
      }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default UrlInputPanel;
