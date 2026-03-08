import { Clock, Shield, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const AppHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <img src={logo} alt="FB Downloader Pro" className="w-9 h-9" />
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">
            FB Downloader Pro
          </h1>
          <span className="text-[10px] text-muted-foreground font-medium">v3.1.0</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">YEARLY</span>
          <span className="text-[10px] text-muted-foreground">• 247 days left</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="w-3.5 h-3.5 text-success" />
          <span>Online</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{time.toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
