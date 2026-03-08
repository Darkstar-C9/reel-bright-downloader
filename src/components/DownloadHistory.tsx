import { History, FolderOpen, Trash2, Download, Search, X, Calendar, HardDrive } from "lucide-react";
import { useState } from "react";

export interface HistoryItem {
  id: number;
  title: string;
  url: string;
  fileSize: string;
  duration: string;
  date: string;
  status: "success" | "failed" | "partial";
  filePath: string;
}

const mockHistory: HistoryItem[] = [
  { id: 1, title: "Amazing cooking recipe video", url: "facebook.com/reel/120784517", fileSize: "2.4 MB", duration: "0:45", date: "Mar 08, 2026 14:32", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\01 [120784517].mp4" },
  { id: 2, title: "Street food compilation #viral", url: "facebook.com/reel/983621045", fileSize: "5.1 MB", duration: "1:23", date: "Mar 08, 2026 14:32", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\02 [983621045].mp4" },
  { id: 3, title: "Funny cat moments 2026", url: "facebook.com/reel/765432198", fileSize: "1.8 MB", duration: "0:32", date: "Mar 08, 2026 14:32", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\03 [765432198].mp4" },
  { id: 4, title: "Travel vlog Pakistan mountains", url: "facebook.com/reel/543216789", fileSize: "—", duration: "2:10", date: "Mar 08, 2026 14:32", status: "failed", filePath: "" },
  { id: 5, title: "DIY home decoration ideas", url: "facebook.com/reel/876543210", fileSize: "4.2 MB", duration: "1:55", date: "Mar 08, 2026 14:32", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\05 [876543210].mp4" },
  { id: 6, title: "Best moments from cricket match", url: "facebook.com/reel/112233445", fileSize: "8.7 MB", duration: "3:12", date: "Mar 07, 2026 22:15", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\06 [112233445].mp4" },
  { id: 7, title: "Motivational speech by Imran Khan", url: "facebook.com/reel/998877665", fileSize: "3.3 MB", duration: "1:05", date: "Mar 07, 2026 20:45", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\07 [998877665].mp4" },
  { id: 8, title: "Sunset timelapse Hunza Valley", url: "facebook.com/reel/554433221", fileSize: "6.1 MB", duration: "0:58", date: "Mar 06, 2026 18:30", status: "success", filePath: "C:\\Users\\User\\Downloads\\FB Videos\\08 [554433221].mp4" },
];

const DownloadHistory = ({ onClose }: { onClose: () => void }) => {
  const [items, setItems] = useState<HistoryItem[]>(mockHistory);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "success" | "failed">("all");

  const filtered = items.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.url.includes(search);
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalSize = items
    .filter((i) => i.status === "success")
    .reduce((acc, i) => {
      const num = parseFloat(i.fileSize);
      return isNaN(num) ? acc : acc + num;
    }, 0);

  const clearHistory = () => setItems([]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md animate-fade-in">
      <div className="bg-card w-full max-w-3xl rounded-xl border border-border/60 shadow-2xl animate-scale-in overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <History className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-foreground">Download History</h2>
              <p className="text-[10px] text-muted-foreground">{items.length} downloads • {totalSize.toFixed(1)} MB total</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2 flex-1 bg-background/60 border border-border/50 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none flex-1"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-background/60 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
              <History className="w-10 h-10 mb-3" />
              <span className="text-[13px] font-medium">No downloads found</span>
            </div>
          ) : (
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border/40 bg-muted/40 backdrop-blur-sm">
                  {["#", "Title", "Size", "Duration", "Date", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-2 font-bold text-muted-foreground/80 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors group">
                    <td className="px-4 py-2.5 text-muted-foreground font-mono font-semibold">{String(item.id).padStart(2, "0")}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium max-w-[220px] truncate">{item.title}</td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {item.fileSize}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono">{item.duration}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-[10px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === "success"
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}>
                        {item.status === "success" ? "✓ Success" : "✗ Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === "success" && (
                          <button title="Open folder" className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                            <FolderOpen className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.status === "failed" && (
                          <button title="Retry" className="p-1 rounded hover:bg-primary/10 text-primary transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button title="Remove" onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border/50 bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground shrink-0">
          <span>{filtered.length} of {items.length} shown</span>
          <span className="font-mono">Storage: {totalSize.toFixed(1)} MB used</span>
        </div>
      </div>
    </div>
  );
};

export default DownloadHistory;
