import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Siren,
  BellRing,
  ClipboardList,
  ClipboardPen,
  ClipboardCheck,
  ClipboardX,
  RadioTower,
  MapPin,
  Clock,
  Users,
  CarFront,
  MessageCircle,
  SendHorizontal,
  ChevronDown,
  ChevronRight,
  Plus,
  TriangleAlert,
  CircleCheck,
  CircleX,
  Timer,
  Target,
  Crosshair,
  Navigation,
  Locate,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import type { AlertLevel } from "../constants";

interface Incident {
  id: string;
  type: "intrusion" | "fire" | "medical" | "breach" | "suspicious" | "drill";
  title: string;
  location: string;
  time: string;
  status: "active" | "responding" | "resolved" | "false_alarm";
  priority: "critical" | "high" | "medium" | "low";
  assignedUnit: string;
  description: string;
  reporter: string;
}

interface DispatchUnit {
  id: string;
  name: string;
  type: "QRF" | "MP" | "Medic" | "K9" | "EOD" | "Admin";
  status: "standby" | "enroute" | "onscene" | "returning" | "unavailable";
  eta: string;
  personnel: string;
  location: string;
}

interface RadioMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  time: string;
  urgent: boolean;
}

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    type: "intrusion",
    title: "Perimeter Breach Sector 4",
    location: "East Fence Line, Grid 4B",
    time: "08:23:11",
    status: "active",
    priority: "critical",
    assignedUnit: "QRF-1",
    description: "Motion sensors triggered along east perimeter fence. IR cameras confirm unidentified personnel approaching restricted zone.",
    reporter: "Cpl. Musa (Watchtower 3)",
  },
  {
    id: "INC-002",
    type: "suspicious",
    title: "Suspicious Vehicle Near Main Gate",
    location: "Main Gate Approach",
    time: "07:55:40",
    status: "responding",
    priority: "high",
    assignedUnit: "MP-2",
    description: "Unmarked white Toyota Hiace lingering at approach road. Third pass in 20 minutes. Plate partially obscured.",
    reporter: "Sgt. Yakubu (Gate Control)",
  },
  {
    id: "INC-003",
    type: "medical",
    title: "Medical Emergency - Barracks B",
    location: "Barracks B, Room 12",
    time: "06:30:00",
    status: "resolved",
    priority: "medium",
    assignedUnit: "Medic-1",
    description: "Soldier reported acute abdominal pain. Transported to Gombe Military Hospital at 06:45.",
    reporter: "L/Cpl. Danladi",
  },
  {
    id: "INC-004",
    type: "drill",
    title: "Scheduled Fire Drill - Admin Block",
    location: "Admin Block, 2nd Floor",
    time: "10:00:00",
    status: "responding",
    priority: "low",
    assignedUnit: "QRF-2",
    description: "Quarterly fire evacuation drill. All personnel must evacuate within 3 minutes. Alarm test scheduled.",
    reporter: "WO2 Eze (Orderly Room)",
  },
  {
    id: "INC-005",
    type: "breach",
    title: "Ammo Bunker Door Ajar Alert",
    location: "Ammunition Bunker 3",
    time: "07:12:55",
    status: "resolved",
    priority: "critical",
    assignedUnit: "MP-1",
    description: "Magnetic sensor reported rear door unsealed. EOD team confirmed no breach. Door was improperly latched.",
    reporter: "Automated System",
  },
];

const INITIAL_UNITS: DispatchUnit[] = [
  { id: "QRF-1", name: "Quick Reaction Force", type: "QRF", status: "enroute", eta: "01:30", personnel: "8 (1x NCO, 7x OR)", location: "Perimeter East" },
  { id: "QRF-2", name: "QRF-Alpha", type: "QRF", status: "standby", eta: "03:00", personnel: "6 (1x Off, 5x OR)", location: "Barracks" },
  { id: "MP-1", name: "Military Police", type: "MP", status: "onscene", eta: "00:00", personnel: "4 (1x SGT, 3x CPL)", location: "Ammo Bunker" },
  { id: "MP-2", name: "MP Patrol", type: "MP", status: "enroute", eta: "02:15", personnel: "2 (1x CPL, 1x PTE)", location: "Main Gate" },
  { id: "Medic-1", name: "Medical Response", type: "Medic", status: "returning", eta: "05:00", personnel: "2 (1x Medic, 1x Driver)", location: "Gombe Military Hospital" },
  { id: "K9-1", name: "K9 Unit", type: "K9", status: "standby", eta: "04:00", personnel: "2 (1x Handler, 1x Dog)", location: "Kennels" },
  { id: "EOD-1", name: "EOD Team", type: "EOD", status: "standby", eta: "08:00", personnel: "3 (1x Off, 2x Tech)", location: "EOD Bay" },
];

const INITIAL_MESSAGES: RadioMessage[] = [
  { id: "R001", from: "Watchtower 3", to: "Ops Center", message: "Possible intrusion detected at East fence. Request QRF dispatch.", time: "08:23:11", urgent: true },
  { id: "R002", from: "Ops Center", to: "QRF-1", message: "QRF-1, respond to Perimeter East. Grid 4B. Unauthorized personnel.", time: "08:23:45", urgent: true },
  { id: "R003", from: "QRF-1", to: "Ops Center", message: "QRF-1 enroute. ETA 90 seconds. Approaching from South.", time: "08:24:10", urgent: false },
  { id: "R004", from: "Gate Control", to: "Ops Center", message: "Suspicious vehicle reported. White Hiace, no markings. Third pass.", time: "07:56:30", urgent: false },
  { id: "R005", from: "Ops Center", to: "MP-2", message: "MP-2, investigate vehicle at Main Gate. Proceed with caution.", time: "07:57:00", urgent: false },
];

interface IncidentResponseProps {
  alertLevel: AlertLevel;
}

export default function IncidentResponse({ alertLevel }: IncidentResponseProps) {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [units, setUnits] = useState<DispatchUnit[]>(INITIAL_UNITS);
  const [messages, setMessages] = useState<RadioMessage[]>(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState<"incidents" | "dispatch" | "radio">("incidents");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [radioMessage, setRadioMessage] = useState("");
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [newIncident, setNewIncident] = useState({
    type: "suspicious" as Incident["type"],
    title: "",
    location: "",
    priority: "medium" as Incident["priority"],
    description: "",
  });

  // Simulate incident time progression
  useEffect(() => {
    const t = setInterval(() => {
      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.status === "active" && Math.random() > 0.85) {
            return { ...inc, status: "responding" as const };
          }
          if (inc.status === "responding" && Math.random() > 0.9) {
            return { ...inc, status: "resolved" as const };
          }
          return inc;
        })
      );
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // Simulate unit status changes
  useEffect(() => {
    const t = setInterval(() => {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.status === "enroute" && Math.random() > 0.8) {
            return { ...u, status: "onscene" as const, eta: "00:00" };
          }
          if (u.status === "onscene" && Math.random() > 0.85) {
            return { ...u, status: "returning" as const, eta: "03:00" };
          }
          if (u.status === "returning" && Math.random() > 0.9) {
            return { ...u, status: "standby" as const, eta: "00:00" };
          }
          return u;
        })
      );
    }, 12000);
    return () => clearInterval(t);
  }, []);

  const sendRadioMessage = () => {
    if (!radioMessage.trim()) return;
    const msg: RadioMessage = {
      id: `R${Date.now()}`,
      from: "Ops Center",
      to: "All Units",
      message: radioMessage,
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      urgent: false,
    };
    setMessages((prev) => [msg, ...prev]);
    setRadioMessage("");
  };

  const submitNewIncident = () => {
    if (!newIncident.title) return;
    const inc: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, "0")}`,
      ...newIncident,
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      status: "active",
      assignedUnit: "TBD",
      reporter: "Ops Center",
    };
    setIncidents((prev) => [inc, ...prev]);
    setNewIncident({ type: "suspicious", title: "", location: "", priority: "medium", description: "" });
    setShowNewIncident(false);
  };

  const tabs = [
    { id: "incidents" as const, label: "Incident Log", icon: ClipboardList },
    { id: "dispatch" as const, label: "Dispatch Board", icon: CarFront },
    { id: "radio" as const, label: "Radio Comms", icon: RadioTower },
  ];

  const priorityColor = (p: string) => {
    switch (p) {
      case "critical": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-info";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "active": return "text-destructive";
      case "responding": return "text-warning";
      case "resolved": return "text-success";
      case "false_alarm": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case "intrusion": return Target;
      case "fire": return TriangleAlert;
      case "medical": return Activity;
      case "breach": return Shield;
      case "suspicious": return Search;
      case "drill": return BookOpen;
      default: return CircleX;
    }
  };

  const unitStatusIcon = (s: string) => {
    switch (s) {
      case "standby": return CircleCheck;
      case "enroute": return Navigation;
      case "onscene": return Locate;
      case "returning": return ArrowDownRight;
      case "unavailable": return CircleX;
      default: return CircleCheck;
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
          <Siren className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold tracking-wider text-primary">
            INCIDENT RESPONSE
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {incidents.filter((i) => i.status === "active").length > 0 && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-bold text-destructive"
            >
              {incidents.filter((i) => i.status === "active").length} ACTIVE
            </motion.span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {incidents.filter((i) => i.status === "resolved").length} resolved
          </span>
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

      {/* Incidents Tab */}
      {activeTab === "incidents" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              {incidents.length} incidents · {incidents.filter((i) => i.status !== "resolved").length} open
            </span>
            <button
              onClick={() => setShowNewIncident(!showNewIncident)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-primary text-primary hover:bg-primary/10"
            >
              {showNewIncident ? <CircleX className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showNewIncident ? "Cancel" : "New Incident"}
            </button>
          </div>

          {/* New Incident Form */}
          <AnimatePresence>
            {showNewIncident && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-primary/30 p-3 mb-3 space-y-2 bg-muted/20 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as Incident["type"] })}
                    className="bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground"
                  >
                    <option value="intrusion">Intrusion</option>
                    <option value="fire">Fire</option>
                    <option value="medical">Medical</option>
                    <option value="breach">Breach</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="drill">Drill</option>
                  </select>
                  <select
                    value={newIncident.priority}
                    onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value as Incident["priority"] })}
                    className="bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    placeholder="Incident Title"
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                    className="col-span-2 bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  <input
                    placeholder="Location"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    className="col-span-2 bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  <textarea
                    placeholder="Description"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    rows={2}
                    className="col-span-2 bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                  />
                  <button
                    onClick={submitNewIncident}
                    className="col-span-2 px-2 py-1 text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    Log Incident
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Incident list */}
          <div className="max-h-64 overflow-y-auto space-y-1">
            {incidents.map((inc) => {
              const Icon = typeIcon(inc.type);
              return (
                <div key={inc.id}>
                  <button
                    onClick={() => setSelectedIncident(selectedIncident === inc.id ? null : inc.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 bg-muted/30 border border-border text-[10px] font-mono hover:bg-muted/50 transition-colors"
                  >
                    <Icon className={`w-3 h-3 shrink-0 ${priorityColor(inc.priority)}`} />
                    <span className="font-bold text-primary w-14">{inc.id}</span>
                    <span className="text-foreground flex-1 text-left truncate">{inc.title}</span>
                    <span className={`px-1 font-bold text-[9px] ${statusColor(inc.status)}`}>
                      {inc.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className={`text-[9px] ${priorityColor(inc.priority)}`}>
                      {inc.priority.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">{inc.time}</span>
                    <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${selectedIncident === inc.id ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {selectedIncident === inc.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-x border-b border-border px-3 py-2 bg-muted/10 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                          <div><span className="text-muted-foreground">Location: </span><span className="text-foreground">{inc.location}</span></div>
                          <div><span className="text-muted-foreground">Unit: </span><span className="text-info">{inc.assignedUnit}</span></div>
                          <div><span className="text-muted-foreground">Reporter: </span><span className="text-foreground">{inc.reporter}</span></div>
                          <div><span className="text-muted-foreground">Time: </span><span className="text-foreground">{inc.time}</span></div>
                          <div className="col-span-2 mt-1">
                            <span className="text-muted-foreground">Details: </span>
                            <span className="text-foreground">{inc.description}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dispatch Tab */}
      {activeTab === "dispatch" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              {units.filter((u) => u.status === "standby").length} standby · {units.filter((u) => u.status === "enroute" || u.status === "onscene").length} deployed
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Avg response: 02:45
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {units.map((u) => {
              const StatusIcon = unitStatusIcon(u.status);
              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-2 px-2 py-1.5 border text-[10px] font-mono ${
                    u.status === "enroute" ? "border-warning bg-warning/5" :
                    u.status === "onscene" ? "border-success bg-success/5" :
                    "border-border bg-muted/20"
                  }`}
                >
                  <StatusIcon className={`w-3 h-3 shrink-0 ${
                    u.status === "standby" ? "text-muted-foreground" :
                    u.status === "enroute" ? "text-warning" :
                    u.status === "onscene" ? "text-success" :
                    u.status === "returning" ? "text-info" : "text-destructive"
                  }`} />
                  <span className="font-bold text-primary w-12">{u.id}</span>
                  <span className="text-foreground w-28 truncate">{u.name}</span>
                  <span className="text-muted-foreground w-8">{u.type}</span>
                  <span className={`text-[9px] font-bold ${
                    u.status === "standby" ? "text-muted-foreground" :
                    u.status === "enroute" ? "text-warning" :
                    u.status === "onscene" ? "text-success" :
                    u.status === "returning" ? "text-info" : "text-destructive"
                  }`}>
                    {u.status.toUpperCase()}
                  </span>
                  {u.status !== "standby" && u.status !== "unavailable" && (
                    <span className="text-info">ETA: {u.eta}</span>
                  )}
                  <span className="text-muted-foreground flex-1 text-right truncate">{u.location}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Radio Tab */}
      {activeTab === "radio" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Tactical Net · {messages.filter((m) => m.urgent).length} urgent
            </span>
            <span className="text-[10px] text-info flex items-center gap-1">
              <RadioTower className="w-3 h-3" />
              CH-01 (TAC)
            </span>
          </div>
          {/* Radio messages */}
          <div className="max-h-48 overflow-y-auto space-y-1 mb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-2 py-1 border text-[10px] font-mono ${
                  msg.urgent ? "border-destructive/50 bg-destructive/5" : "border-border bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {msg.urgent && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-[8px] font-bold text-destructive"
                    >
                      URGENT
                    </motion.span>
                  )}
                  <span className="font-bold text-primary">{msg.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-info">{msg.to}</span>
                  <span className="text-muted-foreground ml-auto">{msg.time}</span>
                </div>
                <div className="text-foreground mt-0.5">{msg.message}</div>
              </div>
            ))}
          </div>
          {/* Radio input */}
          <div className="flex gap-1">
            <input
              value={radioMessage}
              onChange={(e) => setRadioMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendRadioMessage()}
              placeholder="Transmit message to all units..."
              className="flex-1 bg-background border border-border px-2 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
            <button
              onClick={sendRadioMessage}
              className="px-2 py-1 bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <SendHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}