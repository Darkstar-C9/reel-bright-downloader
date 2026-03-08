import { CheckCircle2, Clock, AlertCircle, Loader2, Globe, Trash2, Copy, SkipForward } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { registerCallbacks } from "@/lib/bridge";

export interface DownloadItem {
  id: number;
  title: string;
  url: string;
  duration: string;
  date: string;
  status: "completed" | "downloading" | "queued" | "error" | "stopped" | "duplicate" | "retrying";
  progress?: number;
  speed?: string;
  eta?: string;
  attempt?: number;
}

const initialData: DownloadItem[] = [
  { id: 1, title: "Amazing cooking recipe video", url: "facebook.com/reel/120784517", duration: "0:45", date: "Mar 08, 2026", status: "completed", progress: 100 },
  { id: 2, title: "Street food compilation #viral", url: "facebook.com/reel/983621045", duration: "1:23", date: "Mar 08, 2026", status: "downloading", progress: 0 },
  { id: 3, title: "Funny cat moments 2026", url: "facebook.com/reel/765432198", duration: "0:32", date: "Mar 08, 2026", status: "queued" },
  { id: 4, title: "Travel vlog Pakistan mountains", url: "facebook.com/reel/543216789", duration: "2:10", date: "Mar 07, 2026", status: "queued" },
  { id: 5, title: "DIY home decoration ideas", url: "facebook.com/reel/876543210", duration: "1:55", date: "Mar 07, 2026", status: "queued" },
];

const StatusBadge = ({ item }: { item: DownloadItem }) => {
  const configs: Record<string, { icon: React.ElementType; text: string; cls: string }> = {
    completed: { icon: CheckCircle2, text: "Done", cls: "text-success" },
    downloading: { icon: Loader2, text: `${item.progress ?? 0}%`, cls: "text-primary" },
    queued: { icon: Clock, text: "Queued", cls: "text-warning/80" },
    error: { icon: AlertCircle, text: "Failed", cls: "text-destructive" },
    stopped: { icon: AlertCircle, text: "Stopped", cls: "text-muted-foreground" },
    duplicate: { icon: SkipForward, text: "Duplicate", cls: "text-muted-foreground" },
    retrying: { icon: Loader2, text: `Retry ${item.attempt}/3`, cls: "text-warning" },
  };
  const c = configs[item.status] || configs.queued;
  const isSpinning = item.status === "downloading" || item.status === "retrying";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1.5 ${c.cls}`}>
        <c.icon className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} />
        <span className="text-[11px] font-semibold">{c.text}</span>
      </div>
      {item.status === "downloading" && item.progress !== undefined && (
        <div className="flex items-center gap-2">
          <div className="w-24 h-[5px] bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 ease-out"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          {item.speed && (
            <span className="text-[9px] text-muted-foreground font-mono">{item.speed}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface DownloadTableProps {
  isDownloading: boolean;
}

const DownloadTable = ({ isDownloading }: DownloadTableProps) => {
  const [items, setItems] = useState<DownloadItem[]>(initialData);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemId: number } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Register bridge callbacks for real-time updates from Python
  useEffect(() => {
    registerCallbacks({
      onRowUpdate: (newItems) => setItems(newItems),
      onDownloadDone: (summary) => {
        // Summary handled by parent — items already updated via onRowUpdate
      },
    });
  }, []);

  // Fallback: mock animation when bridge is not connected
  useEffect(() => {
    if (!isDownloading) return;
    // Check if bridge is providing updates — if onRowUpdate fires, this won't matter
    setItems(initialData.map((item, i) =>
      i === 0 ? { ...item, status: "completed", progress: 100 } :
      { ...item, status: i === 1 ? "downloading" : "queued", progress: i === 1 ? 0 : undefined }
    ));
  }, [isDownloading]);

  // Mock progress animation (only runs when no bridge)
  useEffect(() => {
    if (!isDownloading) return;
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        const dlIdx = next.findIndex((i) => i.status === "downloading");
        if (dlIdx === -1) { clearInterval(interval); return prev; }
        const current = next[dlIdx];
        const newProg = (current.progress ?? 0) + Math.floor(Math.random() * 6 + 2);
        const speeds = ["1.2 MB/s", "2.4 MB/s", "856 KB/s", "3.1 MB/s"];

        if (newProg >= 100) {
          next[dlIdx] = { ...current, status: "completed", progress: 100, speed: undefined };
          const nextQIdx = next.findIndex((i) => i.status === "queued");
          if (nextQIdx !== -1) {
            if (next[nextQIdx].id === 4) {
              next[nextQIdx] = { ...next[nextQIdx], status: "error", attempt: 3 };
              const after = next.findIndex((i, idx) => idx > nextQIdx && i.status === "queued");
              if (after !== -1) next[after] = { ...next[after], status: "downloading", progress: 0, speed: "1.8 MB/s" };
            } else {
              next[nextQIdx] = { ...next[nextQIdx], status: "downloading", progress: 0, speed: "2.1 MB/s" };
            }
          }
        } else {
          next[dlIdx] = { ...current, progress: newProg, speed: speeds[Math.floor(Math.random() * speeds.length)] };
        }
        return next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isDownloading]);

  const handleContextMenu = useCallback((e: React.MouseEvent, itemId: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, itemId });
  }, []);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const successCount = items.filter((i) => i.status === "completed").length;
  const errorCount = items.filter((i) => i.status === "error").length;
  const dlItem = items.find((i) => i.status === "downloading");

  return (
    <div ref={tableRef} className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Download Queue</h3>
          <span className="text-[10px] font-mono text-muted-foreground/60">({items.length} items)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          {dlItem && (
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
              Downloading...
            </span>
          )}
          <span className="text-success font-semibold">{successCount} done</span>
          {errorCount > 0 && <span className="text-destructive font-semibold">{errorCount} failed</span>}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin max-h-[260px] overflow-y-auto">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border/40 bg-muted/40 backdrop-blur-sm">
              {["#", "Title", "URL", "Duration", "Date", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-2 font-bold text-muted-foreground/80 uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                className={`border-b border-border/20 transition-all duration-300 cursor-default group ${
                  item.status === "downloading"
                    ? "bg-primary/[0.04]"
                    : item.status === "completed"
                    ? "bg-success/[0.03]"
                    : item.status === "error"
                    ? "bg-destructive/[0.03]"
                    : "hover:bg-muted/30"
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <td className="px-4 py-2.5 text-muted-foreground font-mono font-semibold">{String(item.id).padStart(2, "0")}</td>
                <td className="px-4 py-2.5 text-foreground font-medium max-w-[220px] truncate">{item.title}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono max-w-[160px] truncate text-[10px]">{item.url}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">{item.duration}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{item.date}</td>
                <td className="px-4 py-2.5"><StatusBadge item={item} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-card border border-border rounded-lg shadow-2xl py-1 min-w-[160px] animate-scale-in"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <CtxItem icon={Globe} label="Open URL" onClick={() => setContextMenu(null)} />
          <CtxItem icon={Copy} label="Copy Caption" onClick={() => setContextMenu(null)} />
          <div className="h-px bg-border/50 my-1" />
          <CtxItem icon={Trash2} label="Remove Row" danger onClick={() => {
            setItems((p) => p.filter((i) => i.id !== contextMenu.itemId));
            setContextMenu(null);
          }} />
        </div>
      )}
    </div>
  );
};

const CtxItem = ({ icon: Icon, label, danger, onClick }: {
  icon: React.ElementType; label: string; danger?: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
      danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted/50"
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default DownloadTable;
