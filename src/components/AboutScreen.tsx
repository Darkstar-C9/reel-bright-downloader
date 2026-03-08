import { X, Github, Globe, Shield } from "lucide-react";
import logo from "@/assets/logo.png";

const AboutScreen = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="bg-card w-full max-w-sm rounded-lg border border-border shadow-2xl animate-slide-in text-center">
      <div className="flex items-center justify-end px-4 py-2 border-b border-border">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <img src={logo} alt="Logo" className="w-16 h-16 mx-auto" />
        <div>
          <h2 className="text-lg font-bold text-foreground">FB Downloader Pro</h2>
          <p className="text-xs text-muted-foreground mt-1">Version 3.1.0 — Stability Update</p>
        </div>

        <div className="bg-muted/30 rounded-md p-3 space-y-1.5 text-xs text-muted-foreground">
          <p>Professional Facebook Video & Reels Downloader</p>
          <p>Powered by yt-dlp + ffmpeg</p>
        </div>

        <div className="space-y-2">
          <InfoRow icon={Shield} label="License" value="Yearly — Active" highlight />
          <InfoRow icon={Globe} label="yt-dlp" value="2026.03.01" />
          <InfoRow icon={Github} label="ffmpeg" value="7.0" />
        </div>

        <p className="text-[10px] text-muted-foreground/60 pt-2">
          © 2026 FB Downloader Pro. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between text-xs px-2">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
    <span className={highlight ? "text-primary font-semibold" : "text-foreground"}>{value}</span>
  </div>
);

export default AboutScreen;
