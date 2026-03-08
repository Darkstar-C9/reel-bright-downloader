import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

interface DownloadItem {
  id: number;
  title: string;
  url: string;
  duration: string;
  date: string;
  status: "completed" | "downloading" | "queued" | "error";
  progress?: number;
}

const mockData: DownloadItem[] = [
  { id: 1, title: "Amazing cooking recipe video", url: "facebook.com/reel/120784517", duration: "0:45", date: "2026-03-08", status: "completed" },
  { id: 2, title: "Street food compilation #viral", url: "facebook.com/reel/983621045", duration: "1:23", date: "2026-03-08", status: "downloading", progress: 67 },
  { id: 3, title: "Funny cat moments 2026", url: "facebook.com/reel/765432198", duration: "0:32", date: "2026-03-08", status: "queued" },
  { id: 4, title: "Travel vlog Pakistan mountains", url: "facebook.com/reel/543216789", duration: "2:10", date: "2026-03-07", status: "error" },
  { id: 5, title: "DIY home decoration ideas", url: "facebook.com/reel/876543210", duration: "1:55", date: "2026-03-07", status: "completed" },
];

const StatusBadge = ({ status, progress }: { status: DownloadItem["status"]; progress?: number }) => {
  const config = {
    completed: { icon: CheckCircle2, text: "Done", cls: "text-success" },
    downloading: { icon: Loader2, text: `${progress}%`, cls: "text-primary" },
    queued: { icon: Clock, text: "Queued", cls: "text-warning" },
    error: { icon: AlertCircle, text: "Failed", cls: "text-destructive" },
  };
  const c = config[status];
  return (
    <div className={`flex items-center gap-1.5 ${c.cls}`}>
      <c.icon className={`w-3.5 h-3.5 ${status === "downloading" ? "animate-spin" : ""}`} />
      <span className="text-xs font-medium">{c.text}</span>
      {status === "downloading" && progress !== undefined && (
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-1">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

const DownloadTable = () => (
  <div className="bg-card rounded-lg border border-border overflow-hidden">
    <div className="px-4 py-2.5 border-b border-border">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Download Queue</h3>
    </div>
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">#</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Title</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">URL</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Duration</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Date</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((item) => (
            <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-2.5 text-muted-foreground font-mono">{String(item.id).padStart(2, "0")}</td>
              <td className="px-4 py-2.5 text-foreground font-medium max-w-[200px] truncate">{item.title}</td>
              <td className="px-4 py-2.5 text-muted-foreground font-mono max-w-[160px] truncate">{item.url}</td>
              <td className="px-4 py-2.5 text-muted-foreground font-mono">{item.duration}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{item.date}</td>
              <td className="px-4 py-2.5"><StatusBadge status={item.status} progress={item.progress} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DownloadTable;
