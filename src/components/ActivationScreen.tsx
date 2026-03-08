import { Key, MessageCircle, Send, Shield, Check } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const plans = [
  { name: "Monthly", price: "₹299", days: "30 days", popular: false },
  { name: "Quarterly", price: "₹699", days: "90 days", popular: false },
  { name: "Half-Yearly", price: "₹1199", days: "180 days", popular: true },
  { name: "Yearly", price: "₹1999", days: "365 days", popular: false },
  { name: "Lifetime", price: "₹3999", days: "Forever", popular: false },
];

const ActivationScreen = ({ onActivate }: { onActivate: () => void }) => {
  const [key, setKey] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 animate-slide-in">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">FB Downloader Pro</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your license key to activate</p>
        </div>

        {/* Key Input */}
        <div className="bg-card rounded-lg border border-border p-5 space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="FBPRO-XXXX-XX-XXXXXXXX"
              className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={onActivate}
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-md text-sm hover:brightness-110 transition-all glow-primary flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Activate License
          </button>
        </div>

        {/* Plans */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Available Plans</h3>
          <div className="space-y-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex items-center justify-between px-3 py-2 rounded-md border transition-colors ${
                  plan.popular
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Check className={`w-3 h-3 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium text-foreground">{plan.name}</span>
                  {plan.popular && (
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">POPULAR</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground">{plan.price}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">/ {plan.days}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-success/15 text-success border border-success/30 text-xs font-semibold hover:bg-success/25 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary/15 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/25 transition-colors">
            <Send className="w-3.5 h-3.5" />
            Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationScreen;
