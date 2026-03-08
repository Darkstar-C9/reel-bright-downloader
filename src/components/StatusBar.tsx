import { Link2, CheckCircle2, XCircle } from "lucide-react";

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 py-2 border-t border-border bg-card text-[11px]">
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Link2 className="w-3 h-3" />
        <span>Links: <strong className="text-foreground">5</strong></span>
      </div>
      <div className="flex items-center gap-1.5 text-success">
        <CheckCircle2 className="w-3 h-3" />
        <span>Success: <strong>2</strong></span>
      </div>
      <div className="flex items-center gap-1.5 text-destructive">
        <XCircle className="w-3 h-3" />
        <span>Errors: <strong>1</strong></span>
      </div>
    </div>
    <span className="text-muted-foreground">yt-dlp 2026.03.01 • ffmpeg 7.0</span>
  </div>
);

export default StatusBar;
