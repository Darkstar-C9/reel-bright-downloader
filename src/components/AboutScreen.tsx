import { X, Globe, Shield, Cpu, HardDrive } from "lucide-react";
import logo from "@/assets/logo.png";

const AboutScreen = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md animate-fade-in">
    <div className="bg-card w-full max-w-sm rounded-xl border border-border/60 shadow-2xl animate-scale-in text-center overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2 border-b border-border/50">
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto" />
          <h2 className="text-lg font-extrabold text-foreground mt-3">FB Downloader Pro</h2>
          <p className="text-[11px] text-muted-foreground mt-1">Version 3.1.0 — Stability Update</p>
        </div>

        <div className="bg-muted/20 rounded-lg p-3 text-[11px] text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Professional Facebook Video & Reels Downloader</p>
          <p>Powered by yt-dlp + ffmpeg</p>
          <p>Offline + Online License Validation</p>
        </div>

        <div className="space-y-2 text-left">
          <InfoRow icon={Shield} label="License" value="Yearly — Active" highlight />
          <InfoRow icon={Globe} label="yt-dlp" value="2026.03.01" />
          <InfoRow icon={Cpu} label="ffmpeg" value="7.0" />
          <InfoRow icon={HardDrive} label="Python" value="3.12" />
        </div>

        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground/50">
            © 2025 MMO Tool Collection • All rights reserved
          </p>
        </div>
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, highlight }: {
  icon: React.ElementType; label: string; value: string; highlight?: boolean;
}) => (
  <div className="flex items-center justify-between text-[12px] px-2 py-1 rounded-md hover:bg-muted/20 transition-colors">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
    <span className={highlight ? "text-primary font-bold" : "text-foreground font-medium"}>{value}</span>
  </div>
);

export default AboutScreen;
