import { Link2, CheckCircle2, XCircle, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { registerCallbacks, type StatusUpdate } from "@/lib/bridge";

const StatusBar = () => {
  const [status, setStatus] = useState<StatusUpdate>({
    totalLinks: 5,
    successCount: 4,
    errorCount: 1,
    ytdlpVersion: "2026.03.01",
    ffmpegVersion: "7.0",
  });

  // Register bridge callback for real-time status updates from Python
  useEffect(() => {
    registerCallbacks({
      onStatusUpdate: (update) => setStatus(update),
    });
  }, []);

  return (
    <div className="flex items-center justify-between px-5 py-2 border-t border-border/50 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-5">
        <StatItem icon={Link2} label="Links" value={String(status.totalLinks)} />
        <StatItem icon={CheckCircle2} label="Success" value={String(status.successCount)} color="text-success" />
        <StatItem icon={XCircle} label="Errors" value={String(status.errorCount)} color="text-destructive" />
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          yt-dlp {status.ytdlpVersion}
        </span>
        <span>•</span>
        <span>ffmpeg {status.ffmpegVersion}</span>
        <span>•</span>
        <span>© 2025 MMO Tool Collection</span>
      </div>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color?: string;
}) => (
  <div className={`flex items-center gap-1.5 text-[11px] ${color || "text-muted-foreground"}`}>
    <Icon className="w-3 h-3" />
    <span className="font-medium">{label}:</span>
    <span className="font-bold text-foreground">{value}</span>
  </div>
);

export default StatusBar;
