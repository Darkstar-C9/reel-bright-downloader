import { Terminal, Trash2, Save, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  time: string;
  level: "DEBUG" | "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SYSTEM";
  message: string;
}

const staticLogs: LogEntry[] = [
  { time: "14:30:00", level: "SYSTEM", message: "FB Downloader Pro v3.1.0 started" },
  { time: "14:30:01", level: "DEBUG", message: "License validated: YEARLY — 247 days remaining" },
  { time: "14:30:01", level: "SYSTEM", message: "Auto-patch engine loaded successfully" },
  { time: "14:30:02", level: "INFO", message: "yt-dlp version: 2026.03.01 (up to date)" },
  { time: "14:30:02", level: "INFO", message: "Download folder: C:\\Users\\User\\Downloads\\FB Videos" },
  { time: "14:30:03", level: "INFO", message: "Ready — paste URLs and click Download" },
];

const downloadLogs: LogEntry[] = [
  { time: "14:32:01", level: "INFO", message: "Starting 5 download(s)..." },
  { time: "14:32:01", level: "DEBUG", message: "Using cookies from Firefox profile" },
  { time: "14:32:02", level: "INFO", message: "⬇️ Downloading: Amazing cooking recipe video..." },
  { time: "14:32:03", level: "DEBUG", message: "CMD: python -m yt_dlp --no-warnings --retries 10..." },
  { time: "14:32:05", level: "SUCCESS", message: "✅ Downloaded: 01 [120784517].mp4 (2.4 MB)" },
  { time: "14:32:05", level: "INFO", message: "Extracting captions and hashtags..." },
  { time: "14:32:06", level: "SUCCESS", message: "✅ Captions saved: Captions/01 [120784517].txt" },
  { time: "14:32:07", level: "INFO", message: "⬇️ Downloading: Street food compilation #viral..." },
  { time: "14:32:09", level: "DEBUG", message: "Resolving video URL via yt-dlp..." },
  { time: "14:32:11", level: "DEBUG", message: "45.2% 2.4MB/s ETA 00:03" },
  { time: "14:32:14", level: "SUCCESS", message: "✅ Downloaded: 02 [983621045].mp4 (5.1 MB)" },
  { time: "14:32:15", level: "INFO", message: "⬇️ Downloading: Funny cat moments 2026..." },
  { time: "14:32:18", level: "SUCCESS", message: "✅ Downloaded: 03 [765432198].mp4 (1.8 MB)" },
  { time: "14:32:19", level: "INFO", message: "⬇️ Downloading: Travel vlog Pakistan mountains..." },
  { time: "14:32:20", level: "WARNING", message: "⚠️ Rate limit detected, waiting 2s..." },
  { time: "14:32:22", level: "WARNING", message: "Retry 1/3: facebook.com/reel/543216789" },
  { time: "14:32:25", level: "WARNING", message: "Retry 2/3: facebook.com/reel/543216789" },
  { time: "14:32:28", level: "ERROR", message: "❌ Failed after 3 attempt(s): 🔒 No formats found - login/cookies required" },
  { time: "14:32:29", level: "INFO", message: "⬇️ Downloading: DIY home decoration ideas..." },
  { time: "14:32:33", level: "SUCCESS", message: "✅ Downloaded: 05 [876543210].mp4 (4.2 MB)" },
  { time: "14:32:34", level: "SYSTEM", message: "Queue complete: 4 success, 1 failed" },
  { time: "14:32:34", level: "INFO", message: "Crash recovery state cleared" },
];

const levelColors: Record<string, string> = {
  DEBUG: "text-muted-foreground/70",
  INFO: "text-primary",
  SUCCESS: "text-success",
  WARNING: "text-warning",
  ERROR: "text-destructive",
  SYSTEM: "text-system",
};

const LogPanel = ({ isDownloading }: { isDownloading: boolean }) => {
  const [logs, setLogs] = useState<LogEntry[]>(staticLogs);
  const [logIndex, setLogIndex] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDownloading) {
      setLogs(staticLogs);
      setLogIndex(0);
      return;
    }
    setLogs([...staticLogs]);
    setLogIndex(0);
  }, [isDownloading]);

  useEffect(() => {
    if (!isDownloading || logIndex >= downloadLogs.length) return;
    const delay = 300 + Math.random() * 500;
    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, downloadLogs[logIndex]]);
      setLogIndex((i) => i + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [isDownloading, logIndex]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const filteredLogs = filter === "ALL" ? logs : logs.filter((l) => l.level === filter);

  return (
    <div className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Live Log</h3>
          {isDownloading && (
            <span className="flex items-center gap-1.5 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
              <span className="text-[10px] text-success font-semibold">Recording</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background/60 border border-border/50 rounded px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">All</option>
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Clear log"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Save log"
          >
            <Save className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        className="h-[180px] overflow-y-auto p-3 font-mono text-[10.5px] leading-[1.7] scrollbar-thin bg-background/40"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-muted-foreground/40 text-center py-8">No log entries</div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className="flex gap-2 hover:bg-muted/20 px-1 rounded transition-colors">
              <span className="text-muted-foreground/40 shrink-0 select-none">{log.time}</span>
              <span className={`font-bold shrink-0 w-[72px] text-right ${levelColors[log.level]}`}>
                [{log.level}]
              </span>
              <span className="text-foreground/75">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;
