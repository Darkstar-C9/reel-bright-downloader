import { Terminal } from "lucide-react";

interface LogEntry {
  time: string;
  level: "DEBUG" | "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
}

const mockLogs: LogEntry[] = [
  { time: "14:32:01", level: "INFO", message: "Starting download: facebook.com/reel/120784517" },
  { time: "14:32:02", level: "DEBUG", message: "Using cookies from Firefox profile" },
  { time: "14:32:05", level: "SUCCESS", message: "Downloaded: 01 [120784517].mp4 (2.4 MB)" },
  { time: "14:32:06", level: "INFO", message: "Extracting captions and hashtags..." },
  { time: "14:32:07", level: "SUCCESS", message: "Captions saved: 01 [120784517].txt" },
  { time: "14:32:08", level: "INFO", message: "Starting download: facebook.com/reel/983621045" },
  { time: "14:32:09", level: "WARNING", message: "Rate limit detected, waiting 2s..." },
  { time: "14:32:12", level: "DEBUG", message: "Retry attempt 1/3 for video 983621045" },
  { time: "14:32:15", level: "ERROR", message: "Failed: facebook.com/reel/543216789 — Video unavailable" },
  { time: "14:32:16", level: "INFO", message: "Queue: 2 remaining, 2 completed, 1 failed" },
];

const levelColors: Record<string, string> = {
  DEBUG: "text-muted-foreground",
  INFO: "text-primary",
  SUCCESS: "text-success",
  WARNING: "text-warning",
  ERROR: "text-destructive",
};

const LogPanel = () => (
  <div className="bg-card rounded-lg border border-border overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Log</h3>
    </div>
    <div className="h-44 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed scrollbar-thin bg-background/50">
      {mockLogs.map((log, i) => (
        <div key={i} className="flex gap-2 animate-slide-in" style={{ animationDelay: `${i * 30}ms` }}>
          <span className="text-muted-foreground/60 shrink-0">{log.time}</span>
          <span className={`font-bold shrink-0 w-16 ${levelColors[log.level]}`}>[{log.level}]</span>
          <span className="text-foreground/80">{log.message}</span>
        </div>
      ))}
    </div>
  </div>
);

export default LogPanel;
