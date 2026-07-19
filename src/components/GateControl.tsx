import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CarFront,
  Users,
  Camera,
  ScanLine,
  BadgeCheck,
  CircleX,
  ChevronDown,
  Shield,
  Plus,
  X,
  Clock,
  RadioTower,
  Locate,
} from "lucide-react";
import type { AlertLevel } from "../constants";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  driver: string;
  time: string;
  status: "in" | "out";
}

interface Personnel {
  id: string;
  name: string;
  rank: string;
  time: string;
  method: "RFID" | "Biometric";
  direction: "in" | "out";
}

interface Visitor {
  id: string;
  name: string;
  host: string;
  purpose: string;
  phone: string;
  idType: string;
  status: "pending" | "approved" | "denied";
  qrCode: string;
}

const VEHICLES: Vehicle[] = [
  { id: "V001", plate: "ABJ-301-MIL", type: "Toyota Hilux", driver: "Cpl. Musa", time: "06:42:17", status: "in" },
  { id: "V002", plate: "GMB-112-ARMY", type: "MAN Trucks", driver: "L/Cpl. Okafor", time: "07:03:44", status: "in" },
  { id: "V003", plate: "ABJ-089-NAF", type: "Mercedes G-Wagon", driver: "Maj. Danjuma", time: "07:31:02", status: "in" },
  { id: "V004", plate: "GMB-045-MIL", type: "Iveco Bus", driver: "Sgt. Adamu", time: "08:15:33", status: "out" },
  { id: "V005", plate: "KD-227-ARMY", type: "Land Rover", driver: "Capt. Bello", time: "08:47:19", status: "in" },
];

const PERSONNEL: Personnel[] = [
  { id: "P001", name: "Lt. Col. Abubakar", rank: "CO", time: "06:00:12", method: "Biometric", direction: "in" },
  { id: "P002", name: "WO2 Eze", rank: "WO2", time: "06:12:44", method: "RFID", direction: "in" },
  { id: "P003", name: "Sgt. Yakubu", rank: "SGT", time: "06:18:31", method: "RFID", direction: "in" },
  { id: "P004", name: "Cpl. Ibrahim", rank: "CPL", time: "06:25:07", method: "Biometric", direction: "in" },
  { id: "P005", name: "L/Cpl. Danladi", rank: "L/CPL", time: "06:30:55", method: "RFID", direction: "in" },
  { id: "P006", name: "Pte. Okonkwo", rank: "PTE", time: "07:42:19", method: "Biometric", direction: "out" },
  { id: "P007", name: "Pte. Bala", rank: "PTE", time: "08:05:33", method: "RFID", direction: "in" },
];

interface GateControlProps {
  alertLevel: AlertLevel;
}

export default function GateControl({ alertLevel }: GateControlProps) {
  const [gateOpen, setGateOpen] = useState(true);
  const [gateMode, setGateMode] = useState<"auto" | "manual">("auto");
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES);
  const [personnel, setPersonnel] = useState<Personnel[]>(PERSONNEL);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeTab, setActiveTab] = useState<"anpr" | "rfid" | "visitor">("anpr");
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [showSmsSim, setShowSmsSim] = useState<string | null>(null);
  const [visitorForm, setVisitorForm] = useState({
    name: "",
    host: "",
    purpose: "",
    phone: "",
    idType: "National ID",
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sentinel-anpr");
      if (saved) setVehicles(JSON.parse(saved));
      const savedPers = localStorage.getItem("sentinel-personnel");
      if (savedPers) setPersonnel(JSON.parse(savedPers));
      const savedVis = localStorage.getItem("sentinel-visitors");
      if (savedVis) setVisitors(JSON.parse(savedVis));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("sentinel-anpr", JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem("sentinel-personnel", JSON.stringify(personnel));
  }, [personnel]);

  useEffect(() => {
    localStorage.setItem("sentinel-visitors", JSON.stringify(visitors));
  }, [visitors]);

  const addVehicle = () => {
    const plates = ["LAG-889-MIL", "GMB-301-CMD", "ABJ-556-NAF", "KD-772-ARMY", "GMB-014-QRF"];
    const types = ["Toyota Hilux", "MAN Trucks", "Mercedes G-Wagon", "Iveco Bus", "Land Rover"];
    const drivers = ["Cpl. Nwosu", "Sgt. Tanko", "L/Cpl. Ade", "Maj. Umar", "Pte. Yaro"];
    const v: Vehicle = {
      id: `V${Date.now()}`,
      plate: plates[Math.floor(Math.random() * plates.length)],
      type: types[Math.floor(Math.random() * types.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      status: Math.random() > 0.4 ? "in" : "out",
    };
    setVehicles((p) => [v, ...p].slice(0, 20));
  };

  const addPersonnel = () => {
    const names = ["Maj. Sule", "Capt. Yisa", "WO1 Bako", "Sgt. Dasuki", "Cpl. Haruna"];
    const ranks = ["MAJ", "CAPT", "WO1", "SGT", "CPL"];
    const i = Math.floor(Math.random() * names.length);
    const p: Personnel = {
      id: `P${Date.now()}`,
      name: names[i],
      rank: ranks[i],
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      method: Math.random() > 0.5 ? "RFID" : "Biometric",
      direction: Math.random() > 0.5 ? "in" : "out",
    };
    setPersonnel((prev) => [p, ...prev].slice(0, 20));
  };

  const submitVisitor = () => {
    if (!visitorForm.name || !visitorForm.host) return;
    const qr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const v: Visitor = {
      id: `VST${Date.now()}`,
      ...visitorForm,
      status: "pending",
      qrCode: qr,
    };
    setVisitors((p) => [v, ...p]);
    setVisitorForm({ name: "", host: "", purpose: "", phone: "", idType: "National ID" });
    setShowVisitorForm(false);
    // Simulate SMS approval
    setShowSmsSim(v.id);
    setTimeout(() => {
      setVisitors((prev) =>
        prev.map((vi) =>
          vi.id === v.id
            ? { ...vi, status: Math.random() > 0.2 ? "approved" : "denied" }
            : vi
        )
      );
      setTimeout(() => setShowSmsSim(null), 2000);
    }, 2500);
  };

  const tabs = [
    { id: "anpr" as const, label: "ANPR Stream", icon: CarFront },
    { id: "rfid" as const, label: "RFID & Biometric", icon: ScanLine },
    { id: "visitor" as const, label: "Visitor Terminal", icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold tracking-wider text-primary">
            PERIMETER & GATE CONTROL
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Barrier:</span>
          <button
            onClick={() => setGateOpen(!gateOpen)}
            className={`px-2 py-0.5 text-[10px] font-bold border transition-all ${
              gateOpen
                ? "border-success text-success bg-success/10"
                : "border-destructive text-destructive bg-destructive/10"
            }`}
          >
            {gateOpen ? "OPEN" : "CLOSED"}
          </button>
          <button
            onClick={() => setGateMode(gateMode === "auto" ? "manual" : "auto")}
            className={`px-2 py-0.5 text-[10px] border ${
              gateMode === "auto" ? "border-info text-info" : "border-border text-muted-foreground"
            }`}
          >
            {gateMode.toUpperCase()}
          </button>
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

      {/* ANPR Tab */}
      {activeTab === "anpr" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Live Vehicle Log · {vehicles.length} entries
            </span>
            <button
              onClick={addVehicle}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-primary text-primary hover:bg-primary/10"
            >
              <Plus className="w-3 h-3" /> Simulate Capture
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-2 px-2 py-1 bg-muted/30 border border-border text-[10px] font-mono"
              >
                <CarFront className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-primary font-bold w-28">{v.plate}</span>
                <span className="text-muted-foreground w-24">{v.type}</span>
                <span className="text-muted-foreground flex-1">{v.driver}</span>
                <span className="text-muted-foreground">{v.time}</span>
                <span
                  className={`px-1 font-bold ${
                    v.status === "in" ? "text-success" : "text-warning"
                  }`}
                >
                  {v.status === "in" ? "IN" : "OUT"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RFID Tab */}
      {activeTab === "rfid" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Personnel Check-in/out · {personnel.length} entries
            </span>
            <button
              onClick={addPersonnel}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-primary text-primary hover:bg-primary/10"
            >
              <Plus className="w-3 h-3" /> Simulate Scan
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {personnel.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-2 py-1 bg-muted/30 border border-border text-[10px] font-mono"
              >
                <ScanLine className="w-3 h-3 text-info shrink-0" />
                <span className="text-foreground font-bold w-28">{p.name}</span>
                <span className="text-muted-foreground w-12">{p.rank}</span>
                <span className="text-muted-foreground w-8">{p.time}</span>
                <span
                  className={`px-1 text-[9px] ${
                    p.method === "RFID" ? "text-info" : "text-warning"
                  }`}
                >
                  {p.method}
                </span>
                <span
                  className={`px-1 font-bold ${
                    p.direction === "in" ? "text-success" : "text-warning"
                  }`}
                >
                  {p.direction === "in" ? "IN" : "OUT"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitor Tab */}
      {activeTab === "visitor" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Visitor Registration · {visitors.length} entries
            </span>
            <button
              onClick={() => setShowVisitorForm(!showVisitorForm)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-primary text-primary hover:bg-primary/10"
            >
              {showVisitorForm ? (
                <X className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              {showVisitorForm ? "Close" : "New Visitor"}
            </button>
          </div>

          {/* Visitor Form */}
          {showVisitorForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border border-primary/30 p-3 mb-3 space-y-2 bg-muted/20"
            >
              <div className="grid grid-cols-2 gap-2">
                {(["name", "host", "purpose", "phone"] as const).map((f) => (
                  <input
                    key={f}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={visitorForm[f]}
                    onChange={(e) =>
                      setVisitorForm({ ...visitorForm, [f]: e.target.value })
                    }
                    className="bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                ))}
                <select
                  value={visitorForm.idType}
                  onChange={(e) =>
                    setVisitorForm({ ...visitorForm, idType: e.target.value })
                  }
                  className="bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground outline-none focus:border-primary"
                >
                  <option>National ID</option>
                  <option>Military ID</option>
                  <option>Passport</option>
                  <option>Driver's License</option>
                </select>
                <button
                  onClick={submitVisitor}
                  className="px-2 py-1 text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  Submit & Send SMS
                </button>
              </div>
            </motion.div>
          )}

          {/* SMS Simulation */}
          {showSmsSim && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-warning/50 bg-warning/5 p-2 mb-2 text-[10px] font-mono"
            >
              <RadioTower className="w-3 h-3 text-warning inline mr-1" />
              <span className="text-warning">SMS </span>
              <span className="text-muted-foreground">
                · Sending approval request to host officer...
              </span>
              <div className="w-full h-1 bg-muted mt-1 overflow-hidden">
                <motion.div
                  className="h-full bg-warning"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {/* Visitor list */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {visitors.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-2 px-2 py-1 bg-muted/30 border border-border text-[10px] font-mono"
              >
                <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-foreground font-bold w-20">{v.name}</span>
                <span className="text-muted-foreground w-20">→ {v.host}</span>
                <span className="text-muted-foreground flex-1">{v.purpose}</span>
                <span
                  className={`px-1 font-bold text-[9px] ${
                    v.status === "approved"
                      ? "text-success"
                      : v.status === "denied"
                      ? "text-destructive"
                      : "text-warning"
                  }`}
                >
                  {v.status.toUpperCase()}
                </span>
                {v.status === "approved" && (
                  <span className="text-info text-[9px] flex items-center gap-0.5">
                    <BadgeCheck className="w-3 h-3" /> QR:{v.qrCode}
                  </span>
                )}
              </div>
            ))}
            {visitors.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-[10px]">
                No visitor registrations yet
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}