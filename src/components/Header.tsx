import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  Clock,
  WifiHigh,
  BatteryFull,
  BatteryMedium,
  BatteryWarning,
  Sun,
  ChevronsUpDown,
  CircleCheck,
  CircleAlert,
  OctagonAlert,
} from "lucide-react";
import { ALERT_LEVELS, ALERT_COLORS, ROLES } from "../constants";
import type { AlertLevel, Role } from "../constants";

interface HeaderProps {
  alertLevel: AlertLevel;
  setAlertLevel: (l: AlertLevel) => void;
  role: Role;
  setRole: (r: Role) => void;
}

export default function Header({
  alertLevel,
  setAlertLevel,
  role,
  setRole,
}: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(87);
  const [signal, setSignal] = useState(92);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const b = setInterval(
      () => setBattery((p) => Math.max(12, p - (Math.random() > 0.7 ? 1 : 0))),
      3000
    );
    const s = setInterval(
      () =>
        setSignal((p) =>
          Math.min(100, Math.max(40, p + (Math.random() > 0.5 ? 2 : -2)))
        ),
      5000
    );
    return () => {
      clearInterval(t);
      clearInterval(b);
      clearInterval(s);
    };
  }, []);

  const zuluTime = time.toISOString().slice(11, 19);
  const nigeriaTime = time.toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const alertIcon = {
    GREEN: CircleCheck,
    AMBER: CircleAlert,
    RED: OctagonAlert,
  }[alertLevel];

  const AlertIcon = alertIcon;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b px-4 py-2 flex items-center justify-between gap-4 text-xs relative z-50"
      style={{ borderColor: `${ALERT_COLORS[alertLevel]} / 0.4` }}
    >
      {/* Left: Brand + Units */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" style={{ color: ALERT_COLORS[alertLevel] }} />
          <span className="font-bold text-sm tracking-wider text-primary">
            SENTINEL-301
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-muted-foreground border-l pl-3 border-border">
          <span>301 Arty Regt</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>Gombe Bks</span>
        </div>
      </div>

      {/* Center: Telemetry */}
      <div className="flex items-center gap-4 font-mono">
        <div className="flex items-center gap-1.5" title="Zulu Time">
          <Clock className="w-3 h-3 text-info" />
          <span className="text-info">{zuluTime}</span>
          <span className="text-muted-foreground text-[10px]">Z</span>
        </div>
        <div className="flex items-center gap-1.5" title="Nigeria Time">
          <Clock className="w-3 h-3 text-primary" />
          <span className="text-primary">{nigeriaTime}</span>
          <span className="text-muted-foreground text-[10px]">WAT</span>
        </div>
        <div className="flex items-center gap-1" title="Signal Strength">
          <WifiHigh className="w-3 h-3 text-info" />
          <span className="text-muted-foreground text-[10px]">{signal}%</span>
        </div>
        <div className="flex items-center gap-1" title="Solar Battery">
          <Sun className="w-3 h-3 text-warning" />
          {battery > 60 ? (
            <BatteryFull className="w-3 h-3 text-success" />
          ) : battery > 30 ? (
            <BatteryMedium className="w-3 h-3 text-warning" />
          ) : (
            <BatteryWarning className="w-3 h-3 text-destructive" />
          )}
          <span className="text-muted-foreground text-[10px]">{battery}%</span>
        </div>
      </div>

      {/* Right: Role + Alert */}
      <div className="flex items-center gap-3">
        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2 py-1 border border-border hover:border-primary/50 transition-colors"
          >
            <ShieldAlert className="w-3 h-3 text-primary" />
            <span className="text-foreground text-[10px] truncate max-w-[100px]">
              {role}
            </span>
            <ChevronsUpDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showRoleDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border shadow-xl z-50">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] hover:bg-primary/10 transition-colors ${
                    r === role ? "text-primary bg-primary/5" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alert Level Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="flex items-center gap-1.5 px-2 py-1 border animate-border-pulse"
            style={{ borderColor: `${ALERT_COLORS[alertLevel]} / 0.6` }}
          >
            <AlertIcon className="w-3 h-3" style={{ color: ALERT_COLORS[alertLevel] }} />
            <span className="font-bold text-[10px]" style={{ color: ALERT_COLORS[alertLevel] }}>
              {alertLevel}
            </span>
            <ChevronsUpDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showAlertDropdown && (
            <div className="absolute top-full right-0 mt-1 w-28 bg-card border border-border shadow-xl z-50">
              {ALERT_LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setAlertLevel(l);
                    setShowAlertDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors ${
                    l === alertLevel ? "bg-primary/10" : "hover:bg-primary/5"
                  }`}
                  style={{ color: ALERT_COLORS[l] }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}