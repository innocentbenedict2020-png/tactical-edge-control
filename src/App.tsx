import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  SquareTerminal,
  Radar,
} from "lucide-react";
import { AlertLevel, Role } from "./constants";
import Header from "./components/Header";
import GateControl from "./components/GateControl";
import SurveillanceHub from "./components/SurveillanceHub";
import IncidentResponse from "./components/IncidentResponse";
import StrategicBriefing from "./components/StrategicBriefing";

export default function App() {
  const [alertLevel, setAlertLevel] = useState<AlertLevel>("GREEN");
  const [role, setRole] = useState<Role>("Commanding Officer (CO)");

  const [scanLine, setScanLine] = useState(true);

  // Keyboard shortcut: 1-3 for alert level, R for role toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") setAlertLevel("GREEN");
      if (e.key === "2") setAlertLevel("AMBER");
      if (e.key === "3") setAlertLevel("RED");
      if (e.key === "s") setScanLine((p) => !p);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const alertBorderColor = {
    GREEN: "border-success/20",
    AMBER: "border-warning/20",
    RED: "border-destructive/20",
  }[alertLevel];

  return (
    <div className={`min-h-screen bg-background text-foreground font-mono border-t-2 ${alertBorderColor}`}
      style={{ borderTopColor: `var(--${alertLevel === "GREEN" ? "success" : alertLevel === "AMBER" ? "warning" : "destructive"})` }}
    >
      {/* Scan line overlay */}
      {scanLine && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          <div className="animate-scan-line w-full h-0.5 bg-primary/10" />
        </div>
      )}

      {/* Header */}
      <Header
        alertLevel={alertLevel}
        setAlertLevel={setAlertLevel}
        role={role}
        setRole={setRole}
      />

      {/* Main content */}
      <main className="p-3 max-w-7xl mx-auto">
        {/* Status Bar */}
        <div className="flex items-center gap-3 mb-3 text-[10px] font-mono text-muted-foreground border border-border p-2 bg-muted/20">
          <div className="flex items-center gap-1">
            <Radar className="w-3 h-3 text-primary" />
            <span>SYS.ONLINE</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="flex items-center gap-1">
            <SquareTerminal className="w-3 h-3 text-info" />
            <span>TERMINAL: {role.toUpperCase()}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" style={{ color: `var(--${alertLevel === "GREEN" ? "success" : alertLevel === "AMBER" ? "warning" : "destructive"})` }} />
            <span>ALERT: {alertLevel}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-[8px]">[1:GREEN 2:AMBER 3:RED]</span>
          <span className="ml-auto text-[8px]">v1.0.0 | SENTINEL-301</span>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Column - Gate Control */}
          <div className="lg:col-span-4">
            <GateControl alertLevel={alertLevel} />
          </div>

          {/* Center Column - Surveillance Hub */}
          <div className="lg:col-span-5">
            <SurveillanceHub alertLevel={alertLevel} />
          </div>

          {/* Right Column - Incident Response */}
          <div className="lg:col-span-3">
            <IncidentResponse alertLevel={alertLevel} />
          </div>

          {/* Full Width Bottom - Strategic Briefing */}
          <div className="lg:col-span-12">
            <StrategicBriefing alertLevel={alertLevel} />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[8px] text-muted-foreground"
        >
          <span>
            SENTINEL-301 © {new Date().getFullYear()} — 301 Artillery Regiment, General Support Barrack, Gombe State
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
            ALL SYSTEMS OPERATIONAL
          </span>
        </motion.footer>
      </main>
    </div>
  );
}