import { Clock, Shield, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

interface AppHeaderProps {
  licenseInfo?: {
    plan: string;
    daysLeft: number;
    isLifetime: boolean;
  };
  onLicenseClick: () => void;
}

const AppHeader = ({ licenseInfo, onLicenseClick }: AppHeaderProps) => {
  const [time, setTime] = useState(new Date());
  const [online] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card/80 backdrop-blur-md">
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={logo} alt="FB Downloader Pro" className="w-10 h-10" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-foreground tracking-tight leading-tight">
            FB Downloader Pro
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-medium">v3.1.0</span>
            <span className="text-[10px] text-muted-foreground">•</span>
            <span className="text-[10px] text-muted-foreground">Professional Edition</span>
          </div>
        </div>
      </div>

      {/* Right: License + Status + Clock */}
      <div className="flex items-center gap-3">
        {/* License Badge */}
        <button
          onClick={onLicenseClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/25 hover:bg-primary/15 transition-all group"
        >
          <Shield className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
          {licenseInfo ? (
            <>
              <span className="text-[11px] font-bold text-primary">{licenseInfo.plan.toUpperCase()}</span>
              <span className="text-[10px] text-primary/60">
                {licenseInfo.isLifetime ? "∞ Forever" : `• ${licenseInfo.daysLeft}d left`}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-semibold text-warning">Click to Activate</span>
          )}
        </button>

        {/* Online Status */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
          {online ? (
            <>
              <Wifi className="w-3 h-3 text-success" />
              <span className="text-[10px] text-success font-medium">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-destructive" />
              <span className="text-[10px] text-destructive font-medium">Offline</span>
            </>
          )}
        </div>

        {/* Clock */}
        <div className="flex flex-col items-end">
          <span className="text-[11px] text-foreground font-mono font-medium leading-tight">
            {time.toLocaleTimeString("en-US", { hour12: true })}
          </span>
          <span className="text-[9px] text-muted-foreground leading-tight">{dateStr}</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
