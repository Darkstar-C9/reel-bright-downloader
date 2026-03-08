import { Key, MessageCircle, Send, Shield, Check, Loader2, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { activate } from "@/lib/bridge";

const plans = [
  { name: "Monthly", code: "M", price: "₹299", days: "30 days", icon: "🗓", popular: false },
  { name: "Quarterly", code: "Q", price: "₹699", days: "90 days", icon: "📅", popular: false },
  { name: "Half-Yearly", code: "H", price: "₹1199", days: "180 days", icon: "📆", popular: true },
  { name: "Yearly", code: "Y", price: "₹1999", days: "365 days", icon: "🗓", popular: false },
  { name: "Lifetime", code: "L", price: "₹3999", days: "Forever", icon: "♾️", popular: false },
];

const WHATSAPP_NUMBER = "923001234567";
const TELEGRAM_USERNAME = "SorithyaDigital";
const CONTACT_MESSAGE = "Hello! I want to buy FB Downloader Pro license. Please send me the key.";

const ActivationScreen = ({ onActivate }: { onActivate: () => void }) => {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<{ msg: string; type: "idle" | "loading" | "success" | "error" }>(
    { msg: "", type: "idle" }
  );

  const handleActivate = async () => {
    if (!key.trim()) {
      setStatus({ msg: "⚠️ Please enter your license key", type: "error" });
      return;
    }
    setStatus({ msg: "Checking license, please wait...", type: "loading" });
    try {
      const result = await activate(key);
      if (result.valid) {
        setStatus({ msg: result.message || "✅ License activated!", type: "success" });
        setTimeout(onActivate, 800);
      } else {
        setStatus({ msg: result.message || "❌ Invalid license key", type: "error" });
      }
    } catch {
      setStatus({ msg: "❌ Activation failed — bridge error", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at 25% 25%, hsl(195 100% 50%) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(195 80% 40%) 0%, transparent 50%)" }}
      />

      <div className="w-full max-w-[440px] space-y-5 animate-slide-up relative z-10">
        {/* Logo + Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <img src={logo} alt="Logo" className="w-20 h-20 mx-auto mb-3" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">FB Downloader Pro</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            v3.1.0 • Professional Facebook Downloader
          </p>
        </div>

        {/* Key Input Card */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div>
            <label className="text-[12px] font-bold text-foreground mb-1.5 block">Enter License Key</label>
            <p className="text-[11px] text-muted-foreground mb-3">Paste your key below and click Activate</p>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={key}
                onChange={(e) => { setKey(e.target.value.toUpperCase()); setStatus({ msg: "", type: "idle" }); }}
                onKeyDown={(e) => e.key === "Enter" && handleActivate()}
                placeholder="FBPRO-MF176202-A1-A2CBD9B7"
                className="w-full bg-background/60 border border-border/60 rounded-lg pl-10 pr-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground/40 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleActivate}
            disabled={status.type === "loading"}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-[13px] hover:brightness-110 transition-all glow-primary flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
          >
            {status.type === "loading" ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Validating...</>
            ) : (
              <><Shield className="w-4 h-4" /> Activate License</>
            )}
          </button>

          {/* Status Message */}
          {status.msg && (
            <p className={`text-[12px] text-center font-medium animate-fade-in ${
              status.type === "success" ? "text-success" :
              status.type === "error" ? "text-destructive" :
              "text-muted-foreground"
            }`}>
              {status.msg}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-[11px] text-muted-foreground font-semibold">Don't have a key?</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(CONTACT_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[hsl(142,70%,35%)]/15 text-[hsl(142,70%,50%)] border border-[hsl(142,70%,35%)]/25 text-[12px] font-bold hover:bg-[hsl(142,70%,35%)]/25 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/25 text-[12px] font-bold hover:bg-primary/20 transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Telegram
          </a>
        </div>

        {/* Plans */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Available Plans</h3>
          </div>
          <div className="space-y-1.5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                  plan.popular
                    ? "border-primary/30 bg-primary/[0.06] shadow-sm shadow-primary/5"
                    : "border-border/30 bg-muted/10 hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px]">{plan.icon}</span>
                  <span className="text-[12px] font-semibold text-foreground">{plan.name}</span>
                  {plan.popular && (
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-extrabold tracking-wider">
                      BEST VALUE
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-bold text-foreground">{plan.price}</span>
                  <span className="text-[10px] text-muted-foreground ml-1.5">/ {plan.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-muted-foreground/40 text-center">
          © 2025 MMO Tool Collection • FB Downloader Pro v3.1.0
        </p>
      </div>
    </div>
  );
};

export default ActivationScreen;
