import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Camera,
  Map,
  MapPin,
  Navigation,
  Plane,
  Activity,
  Monitor,
  Eye,
  EyeOff,
  Locate,
  Maximize,
  ChevronLeft,
  ChevronRight,
  RadioTower,
  Cctv,
  VideoOff,
  ScanLine,
  Target,
} from "lucide-react";
import type { AlertLevel } from "../constants";

interface CameraFeed {
  id: string;
  name: string;
  zone: string;
  status: "online" | "offline" | "degraded";
  fps: number;
  angle: string;
}

const CAMERAS: CameraFeed[] = [
  { id: "CAM-01", name: "Main Gate E", zone: "Perimeter", status: "online", fps: 30, angle: "PTZ-180" },
  { id: "CAM-02", name: "Main Gate W", zone: "Perimeter", status: "online", fps: 30, angle: "PTZ-180" },
  { id: "CAM-03", name: "Armoury", zone: "Internal", status: "online", fps: 25, angle: "Fixed" },
  { id: "CAM-04", name: "CO's Office", zone: "Admin", status: "online", fps: 25, angle: "Fixed" },
  { id: "CAM-05", name: "Barracks East", zone: "Quarters", status: "degraded", fps: 12, angle: "Fixed" },
  { id: "CAM-06", name: "Motor Pool", zone: "Logistics", status: "online", fps: 30, angle: "PTZ-360" },
  { id: "CAM-07", name: "Fuel Dump", zone: "Logistics", status: "offline", fps: 0, angle: "Fixed" },
  { id: "CAM-08", name: "Ammo Bunker", zone: "Internal", status: "online", fps: 30, angle: "PTZ-360" },
  { id: "CAM-09", name: "Parade Ground", zone: "Open", status: "online", fps: 25, angle: "Fixed" },
  { id: "CAM-10", name: "Quarter Guard", zone: "Perimeter", status: "online", fps: 30, angle: "PTZ-180" },
];

interface DroneFeed {
  id: string;
  name: string;
  alt: number;
  heading: number;
  battery: number;
  status: "patrol" | "returning" | "docked" | "alert";
}

const DRONES: DroneFeed[] = [
  { id: "UAV-01", name: "Sentinel-1", alt: 150, heading: 45, battery: 78, status: "patrol" },
  { id: "UAV-02", name: "Watcher-2", alt: 200, heading: 270, battery: 34, status: "returning" },
  { id: "UAV-03", name: "Guardian-3", alt: 0, heading: 0, battery: 100, status: "docked" },
];

interface AlertMarker {
  id: string;
  type: "intrusion" | "fire" | "medical" | "breach";
  zone: string;
  lat: string;
  lng: string;
  time: string;
  severity: "low" | "medium" | "critical";
}

const ALERTS: AlertMarker[] = [
  { id: "A001", type: "intrusion", zone: "Perimeter East", lat: "10.2897°N", lng: "11.1689°E", time: "08:23:11", severity: "critical" },
  { id: "A002", type: "breach", zone: "Ammo Bunker", lat: "10.2901°N", lng: "11.1692°E", time: "07:55:40", severity: "medium" },
  { id: "A003", type: "medical", zone: "Barracks East", lat: "10.2885°N", lng: "11.1678°E", time: "06:30:00", severity: "low" },
];

interface SurveillanceHubProps {
  alertLevel: AlertLevel;
}

export default function SurveillanceHub({ alertLevel }: SurveillanceHubProps) {
  const [activeTab, setActiveTab] = useState<"cameras" | "drones" | "map">("cameras");
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState(CAMERAS);
  const [drones, setDrones] = useState(DRONES);
  const [radarPulse, setRadarPulse] = useState(0);

  // Simulate radar sweep
  useEffect(() => {
    const r = setInterval(() => setRadarPulse((p) => (p + 1) % 360), 50);
    return () => clearInterval(r);
  }, []);

  // Simulate scan
  useEffect(() => {
    const s = setInterval(() => setScanning((p) => !p), 3000);
    return () => clearInterval(s);
  }, []);

  // Simulate camera status changes
  useEffect(() => {
    const t = setInterval(() => {
      setCameras((prev) =>
        prev.map((c) =>
          Math.random() > 0.92
            ? { ...c, status: Math.random() > 0.5 ? "online" : "degraded" as const }
            : c
        )
      );
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // Simulate drone patrol
  useEffect(() => {
    const t = setInterval(() => {
      setDrones((prev) =>
        prev.map((d) => {
          if (d.status === "docked") return d;
          const newBattery = Math.max(5, d.battery - Math.floor(Math.random() * 3));
          const newHeading = (d.heading + Math.floor(Math.random() * 20 - 10) + 360) % 360;
          const newAlt = Math.max(50, d.alt + Math.floor(Math.random() * 20 - 10));
          const newStatus = newBattery < 20 ? "returning" : d.status;
          return { ...d, battery: newBattery, heading: newHeading, alt: newAlt, status: newStatus as DroneFeed["status"] };
        })
      );
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "cameras" as const, label: "CCTV Grid", icon: Cctv },
    { id: "drones" as const, label: "UAV Feed", icon: Plane },
    { id: "map" as const, label: "Tactical Map", icon: Map },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case "online": return "text-success";
      case "offline": return "text-destructive";
      case "degraded": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const severityColor = (s: string) => {
    switch (s) {
      case "critical": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-info";
      default: return "text-muted-foreground";
    }
  };

  const alertTypeIcon = (t: string) => {
    switch (t) {
      case "intrusion": return Target;
      case "fire": return TriangleAlert;
      case "medical": return Activity;
      case "breach": return ShieldAlert;
      default: return CircleAlert;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold tracking-wider text-primary">
            SURVEILLANCE HUB
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {cameras.filter((c) => c.status === "online").length}/{cameras.length} Online
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <Activity className={`w-3 h-3 ${scanning ? "text-success" : "text-muted-foreground"}`} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 border-b border-border pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] transition-colors ${
                activeTab === t.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Cameras Tab */}
      {activeTab === "cameras" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {cameras.map((cam) => (
            <motion.button
              key={cam.id}
              layout
              onClick={() => setSelectedCam(selectedCam === cam.id ? null : cam.id)}
              className={`border p-2 text-left transition-all ${
                selectedCam === cam.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              } ${cam.status === "offline" ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-1 mb-1">
                {cam.status === "online" ? (
                  <Camera className="w-3 h-3 text-success" />
                ) : cam.status === "degraded" ? (
                  <Camera className="w-3 h-3 text-warning" />
                ) : (
                  <VideoOff className="w-3 h-3 text-destructive" />
                )}
                <span className="text-[9px] font-bold text-primary">{cam.id}</span>
              </div>
              <div className="text-[9px] text-muted-foreground">{cam.name}</div>
              <div className="text-[8px] text-muted-foreground">{cam.zone} · {cam.angle}</div>
              <div className={`text-[9px] font-bold mt-1 ${statusColor(cam.status)}`}>
                {cam.status.toUpperCase()} {cam.status === "online" && `· ${cam.fps}fps`}
              </div>
              {/* Simulated feed preview */}
              {cam.status !== "offline" && (
                <div className="mt-1 h-6 bg-muted/50 border border-border relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-primary/10" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[6px] text-muted-foreground">LIVE</div>
                  </div>
                  <motion.div
                    className="absolute top-0 left-0 w-4 h-full bg-primary/5"
                    animate={{ x: ["0%", "400%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
              {cam.status === "offline" && (
                <div className="mt-1 h-6 bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                  <span className="text-[6px] text-destructive">NO SIGNAL</span>
                </div>
              )}
              {selectedCam === cam.id && (
                <div className="mt-1 text-[8px] text-info flex items-center gap-1">
                  <Eye className="w-2 h-2" /> PTZ Controls Active
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Drones Tab */}
      {activeTab === "drones" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              UAV Telemetry · {drones.filter((d) => d.status === "patrol").length} active
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <RadioTower className="w-3 h-3 text-info" />
              Link: SAT-COM
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            {drones.map((d) => (
              <div
                key={d.id}
                className={`border p-2 ${
                  d.status === "alert"
                    ? "border-destructive bg-destructive/5"
                    : d.status === "returning"
                    ? "border-warning bg-warning/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary">{d.id}</span>
                  <span className={`text-[8px] px-1 ${
                    d.status === "patrol" ? "text-success bg-success/10" :
                    d.status === "returning" ? "text-warning bg-warning/10" :
                    d.status === "alert" ? "text-destructive bg-destructive/10" :
                    "text-muted-foreground bg-muted"
                  }`}>
                    {d.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[9px] text-muted-foreground">{d.name}</div>
                <div className="grid grid-cols-3 gap-1 mt-1 text-[9px] font-mono">
                  <div>
                    <span className="text-muted-foreground">ALT </span>
                    <span className="text-info">{d.alt}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">HDG </span>
                    <span className="text-primary">{d.heading}°</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">BAT </span>
                    <span className={d.battery < 20 ? "text-destructive" : "text-success"}>
                      {d.battery}%
                    </span>
                  </div>
                </div>
                <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      d.battery > 60 ? "bg-success" : d.battery > 20 ? "bg-warning" : "bg-destructive"
                    }`}
                    initial={{ width: `${d.battery}%` }}
                    animate={{ width: `${d.battery}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Radar Sweep Visualization */}
          <div className="border border-border p-3 bg-muted/10 relative overflow-hidden h-32">
            <div className="flex items-center gap-1 mb-2">
              <Locate className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">RADAR SWEEP</span>
              <span className="text-[8px] text-muted-foreground ml-auto">RNG: 5km</span>
            </div>
            {/* Radar circle */}
            <div className="relative w-20 h-20 mx-auto border border-primary/20 rounded-full">
              <div className="absolute inset-0 rounded-full border border-primary/10" />
              <div className="absolute inset-[25%] rounded-full border border-primary/10" />
              <div className="absolute inset-[50%] rounded-full border border-primary/10" />
              {/* Sweep arm */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1/2 h-[1px] bg-primary origin-left"
                style={{ rotate: `${radarPulse}deg` }}
              />
              {/* Blips */}
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-destructive"
                style={{ top: "30%", left: "60%" }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-1 h-1 rounded-full bg-warning"
                style={{ top: "65%", left: "40%" }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              <motion.div
                className="absolute w-1 h-1 rounded-full bg-info"
                style={{ top: "45%", left: "75%" }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            <div className="absolute top-2 right-2 text-[8px] text-muted-foreground font-mono">
              3 contacts
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === "map" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Tactical Overlay · {ALERTS.length} active markers
            </span>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-primary text-primary"
            >
              {showMap ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showMap ? "Hide Grid" : "Show Grid"}
            </button>
          </div>
          {/* Simulated map grid */}
          <div className="border border-border p-2 bg-muted/10 relative h-48 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-primary/5" />
              ))}
            </div>
            {/* Map markers */}
            {ALERTS.map((a) => {
              const AlertIcon = alertTypeIcon(a.type);
              return (
                <motion.div
                  key={a.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <AlertIcon
                    className={`w-4 h-4 ${severityColor(a.severity)}`}
                  />
                  <span className={`text-[7px] font-bold ${severityColor(a.severity)}`}>
                    {a.zone}
                  </span>
                  <span className="text-[6px] text-muted-foreground">
                    {a.lat} {a.lng}
                  </span>
                </motion.div>
              );
            })}
            {/* Barrack compound overlay */}
            <div className="absolute bottom-2 left-2 text-[8px] text-muted-foreground font-mono">
              10.2894°N 11.1690°E
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[8px] text-muted-foreground">
              <Navigation className="w-2 h-2" /> N
            </div>
            {showMap && (
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                <span className="text-[10px] text-primary/50 font-mono">GRID OVERLAY ACTIVE</span>
              </div>
            )}
          </div>
          {/* Alert markers legend */}
          <div className="flex gap-3 mt-2 text-[8px] text-muted-foreground">
            {(["intrusion", "breach", "medical"] as const).map((t) => {
              const Icon = alertTypeIcon(t);
              const sev = ALERTS.find((a) => a.type === t)?.severity || "low";
              return (
                <span key={t} className="flex items-center gap-1">
                  <Icon className={`w-2.5 h-2.5 ${severityColor(sev)}`} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Used in the alert type icon function above
import { TriangleAlert, ShieldAlert, CircleAlert } from "lucide-react";