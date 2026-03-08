import { useState } from "react";
import { Settings, Info, LogIn } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import UrlInputPanel from "@/components/UrlInputPanel";
import DownloadTable from "@/components/DownloadTable";
import LogPanel from "@/components/LogPanel";
import StatusBar from "@/components/StatusBar";
import ActivationScreen from "@/components/ActivationScreen";
import SettingsPanel from "@/components/SettingsPanel";
import AboutScreen from "@/components/AboutScreen";

const Index = () => {
  const [activated, setActivated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  if (!activated) {
    return <ActivationScreen onActivate={() => setActivated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-1 px-5 py-1.5 border-b border-border bg-card/50">
        <ToolbarBtn icon={Settings} label="Settings" onClick={() => setShowSettings(true)} />
        <ToolbarBtn icon={Info} label="About" onClick={() => setShowAbout(true)} />
        <ToolbarBtn icon={LogIn} label="License" onClick={() => setActivated(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        <UrlInputPanel />
        <DownloadTable />
        <LogPanel />
      </div>

      <StatusBar />

      {/* Modals */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showAbout && <AboutScreen onClose={() => setShowAbout(false)} />}
    </div>
  );
};

const ToolbarBtn = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
  >
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

export default Index;
