import { Terminal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LogEntry {
  time: string;
  level: "DEBUG" | "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  message: string;
}

const logSequence: LogEntry[] = [
  { time: "14:32:01", level: "INFO", message: "Starting bulk download — 5 URLs queued" },
  { time: "14:32:01", level: "DEBUG", message: "Using cookies from Firefox profile" },
  { time: "14:32:02", level: "INFO", message: "Downloading: Amazing cooking recipe video..." },
  { time: "14:32:04", level: "SUCCESS", message: "✓ Downloaded: 01 [120784517].mp4 (2.4 MB)" },
  { time: "14:32:05", level: "INFO", message: "Extracting captions and hashtags..." },
  { time: "14:32:05", level: "SUCCESS", message: "✓ Captions saved: 01 [120784517].txt" },
  { time: "14:32:06", level: "INFO", message: "Downloading: Street food compilation #viral..." },
  { time: "14:32:08", level: "DEBUG", message: "Resolving video URL via yt-dlp..." },
  { time: "14:32:12", level: "SUCCESS", message: "✓ Downloaded: 02 [983621045].mp4 (5.1 MB)" },
  { time: "14:32:13", level: "INFO", message: "Downloading: Funny cat moments 2026..." },
  { time: "14:32:16", level: "SUCCESS", message: "✓ Downloaded: 03 [765432198].mp4 (1.8 MB)" },
  { time: "14:32:17", level: "INFO", message: "Downloading: Travel vlog Pakistan mountains..." },
  { time: "14:32:18", level: "WARNING", message: "⚠ Rate limit detected, waiting 2s..." },
  { time: "14:32:20", level: "DEBUG", message: "Retry attempt 1/3 for video 543216789" },
  { time: "14:32:22", level: "ERROR", message: "✗ Failed: facebook.com/reel/543216789 — Video unavailable" },
  { time: "14:32:23", level: "INFO", message: "Downloading: DIY home decoration ideas..." },
  { time: "14:32:26", level: "SUCCESS", message: "✓ Downloaded: 05 [876543210].mp4 (4.2 MB)" },
  { time: "14:32:27", level: "INFO", message: "Queue complete: 4 success, 1 failed" },
];

const staticLogs: LogEntry[] = [
  { time: "14:30:00", level: "INFO", message: "FB Downloader Pro v3.1.0 started" },
  { time: "14:30:01", level: "DEBUG", message: "License validated: YEARLY — 247 days remaining" },
  { time: "14:30:02", level: "INFO", message: "yt-dlp version: 2026.03.01 (up to date)" },
  { time: "14:30:02", level: "INFO", message: "Ready. Paste URLs and click Download." },
];

const levelColors: Record<string, string> = {
  DEBUG: "text-muted-foreground",
  INFO: "text-primary",
  SUCCESS: "text-success",
  WARNING: "text-warning",
  ERROR: "text-destructive",
};

const LogPanel = ({ isDownloading }: { isDownloading: boolean }) => {
  const [logs, setLogs] = useState<LogEntry[]>(staticLogs);
  const [logIndex, setLogIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset and animate logs when downloading starts
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
    if (!isDownloading || logIndex >= logSequence.length) return;

    const delay = 400 + Math.random() * 600;
    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, logSequence[logIndex]]);
      setLogIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isDownloading, logIndex]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Log</h3>
        {isDownloading && (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-medium">Recording</span>
          </span>
        )}
      </div>
      <div
        ref={scrollRef}
        className="h-44 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed scrollbar-thin bg-background/50"
      >
        {logs.map((log, i) => (
          <div
            key={i}
            className="flex gap-2 animate-slide-in"
            style={{ animationDelay: `${Math.max(0, (i - staticLogs.length)) * 30}ms` }}
          >
            <span className="text-muted-foreground/60 shrink-0">{log.time}</span>
            <span className={`font-bold shrink-0 w-20 ${levelColors[log.level]}`}>[{log.level}]</span>
            <span className="text-foreground/80">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogPanel;
