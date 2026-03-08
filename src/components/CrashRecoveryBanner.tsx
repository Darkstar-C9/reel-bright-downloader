import { useState, useEffect } from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { registerCallbacks, resumeCrashRecovery, dismissCrashBanner, type CrashBannerData } from "@/lib/bridge";

interface CrashRecoveryProps {
  pendingUrls: number;
  crashTime: string;
  onResume: () => void;
  onDismiss: () => void;
}

const CrashRecoveryBanner = ({ pendingUrls: propPending, crashTime: propCrashTime, onResume, onDismiss }: CrashRecoveryProps) => {
  const [visible, setVisible] = useState(true);
  const [pendingUrls, setPendingUrls] = useState(propPending);
  const [crashTime, setCrashTime] = useState(propCrashTime);

  // Register bridge callback for crash banner data from Python
  useEffect(() => {
    registerCallbacks({
      onCrashBanner: (data: CrashBannerData) => {
        if (data.show) {
          setVisible(true);
          setPendingUrls(data.pendingUrls);
          setCrashTime(data.crashTime);
        } else {
          setVisible(false);
        }
      },
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visible) onDismiss();
    }, 15000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const handleResume = async () => {
    await resumeCrashRecovery();
    onResume();
    setVisible(false);
  };

  const handleDismiss = async () => {
    await dismissCrashBanner();
    onDismiss();
    setVisible(false);
  };

  return (
    <div className="mx-5 mt-3 glass-card rounded-lg p-3.5 border-warning/30 bg-warning/[0.06] animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-warning/15">
          <AlertTriangle className="w-4 h-4 text-warning" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-foreground">Resume Previous Downloads?</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Last session ended unexpectedly ({crashTime}). {pendingUrls} URL(s) were pending.
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-warning/15 text-warning text-[11px] font-bold border border-warning/25 hover:bg-warning/25 transition-all active:scale-[0.97]"
            >
              <RotateCcw className="w-3 h-3" />
              Resume Downloads
            </button>
            <button
              onClick={handleDismiss}
              className="text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors px-2 py-1.5"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CrashRecoveryBanner;
