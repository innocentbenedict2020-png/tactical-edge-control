import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BookOpen,
  BookOpenText,
  ChartBar,
  ChartColumnIncreasing,
  FileText,
  Users,
  Shield,
  Target,
  Flag,
  Star,
  Activity,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MapPin,
  Calendar,
  Crosshair,
  Gauge,
  Trophy,
  Medal,
  Award,
  CircleCheck,
  CircleAlert,
  Clock,
  ChevronRight,
  Zap,
  Minus,
} from "lucide-react";
import type { AlertLevel } from "../constants";

interface IntelBrief {
  id: string;
  title: string;
  category: "threat" | "intel" | "patrol" | "admin";
  summary: string;
  date: string;
  classification: "unclassified" | "restricted" | "confidential" | "secret";
  priority: "routine" | "important" | "urgent";
  author: string;
}

interface ReadinessMetric {
  label: string;
  value: number;
  target: number;
  trend: "up" | "down" | "stable";
  icon: typeof Shield;
}

interface PatrolReport {
  id: string;
  sector: string;
  unit: string;
  status: "patrolling" | "returned" | "delayed" | "completed";
  startTime: string;
  eta: string;
  findings: string;
}

const INITIAL_BRIEFS: IntelBrief[] = [
  {
    id: "BRIEF-001",
    title: "Weekly Threat Assessment",
    category: "threat",
    summary: "Increased insurgent activity reported along Gombe-Biu road. 3 IED incidents in past 72 hours. Recommend heightened vigilance at Checkpoint 4 and 7.",
    date: "2025-01-15",
    classification: "confidential",
    priority: "urgent",
    author: "G2 Intelligence",
  },
  {
    id: "BRIEF-002",
    title: "Patrol Report - Sector Alpha",
    category: "patrol",
    summary: "0600hrs patrol completed. Sector Alpha secure. Identified fresh tire tracks near perimeter fence - under investigation. No civilian incursions.",
    date: "2025-01-15",
    classification: "restricted",
    priority: "important",
    author: "2Lt. Okonkwo",
  },
  {
    id: "BRIEF-003",
    title: "Civilian Intelligence Report",
    category: "intel",
    summary: "Local informant reports unknown armed group sighted near Dadin Kowa. Estimated 15-20 personnel. Possible reconnaissance. Coordinates relayed to ops.",
    date: "2025-01-14",
    classification: "secret",
    priority: "urgent",
    author: "Cpl. Ibrahim (Intel)",
  },
  {
    id: "BRIEF-004",
    title: "Quarterly Training Report",
    category: "admin",
    summary: "Q4 training complete. 92% personnel certified in small arms. 78% in CQB. Additional marksmanship training scheduled for January.",
    date: "2025-01-13",
    classification: "unclassified",
    priority: "routine",
    author: "Training Wing",
  },
  {
    id: "BRIEF-005",
    title: "Equipment Status Report",
    category: "admin",
    summary: "3 × LAV-25s serviceable. 2 × in workshop (transmission repairs). 1 × radio relay vehicle awaiting parts. Ammo inventory: 87% of required levels.",
    date: "2025-01-12",
    classification: "confidential",
    priority: "important",
    author: "Sgt. Maj. Bello",
  },
];

const INITIAL_METRICS: ReadinessMetric[] = [
  { label: "Troop Readiness", value: 92, target: 95, trend: "up", icon: Users },
  { label: "Equipment Availability", value: 78, target: 85, trend: "down", icon: Gauge },
  { label: "Training Completion", value: 88, target: 90, trend: "up", icon: GraduationCap },
  { label: "Medical Readiness", value: 95, target: 95, trend: "stable", icon: Activity },
  { label: "Perimeter Security", value: 85, target: 90, trend: "up", icon: Shield },
  { label: "Intel Coverage", value: 72, target: 80, trend: "down", icon: Crosshair },
];

const INITIAL_PATROLS: PatrolReport[] = [
  { id: "PAT-01", sector: "Perimeter East", unit: "QRF-1", status: "patrolling", startTime: "07:00", eta: "08:30", findings: "Active patrol - no incidents" },
  { id: "PAT-02", sector: "North Gate", unit: "MP-2", status: "returned", startTime: "06:00", eta: "07:00", findings: "All clear. Vehicle check conducted." },
  { id: "PAT-03", sector: "Ammo Depot", unit: "EOD-1", status: "completed", startTime: "05:30", eta: "06:15", findings: "Bunker integrity verified. All seals intact." },
  { id: "PAT-04", sector: "Barracks West", unit: "K9-1", status: "patrolling", startTime: "07:30", eta: "08:45", findings: "K9 sweep in progress." },
  { id: "PAT-05", sector: "Fuel Farm", unit: "MP-1", status: "delayed", startTime: "06:30", eta: "08:00", findings: "Delayed - investigating suspicious vehicle." },
];

interface StrategicBriefingProps {
  alertLevel: AlertLevel;
}

export default function StrategicBriefing({ alertLevel }: StrategicBriefingProps) {
  const [briefs] = useState<IntelBrief[]>(INITIAL_BRIEFS);
  const [metrics] = useState<ReadinessMetric[]>(INITIAL_METRICS);
  const [patrols] = useState<PatrolReport[]>(INITIAL_PATROLS);
  const [activeTab, setActiveTab] = useState<"briefs" | "readiness" | "patrols">("briefs");
  const [selectedBrief, setSelectedBrief] = useState<string | null>(null);
  const [readinessTimer, setReadinessTimer] = useState(0);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  // Animate metric values on mount
  useEffect(() => {
    const vals: Record<string, number> = {};
    metrics.forEach((m) => {
      vals[m.label] = 0;
    });
    setAnimatedValues(vals);

    metrics.forEach((m) => {
      const steps = 20;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnimatedValues((prev) => ({
          ...prev,
          [m.label]: Math.round((m.value / steps) * step),
        }));
        if (step >= steps) clearInterval(interval);
      }, 30);
    });
  }, []);

  // Simulate readiness values
  useEffect(() => {
    const t = setInterval(() => {
      setReadinessTimer((p) => p + 1);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "briefs" as const, label: "Intel Briefs", icon: BookOpenText },
    { id: "readiness" as const, label: "Unit Readiness", icon: ChartBar },
    { id: "patrols" as const, label: "Patrol Reports", icon: MapPin },
  ];

  const classificationColor = (c: string) => {
    switch (c) {
      case "secret": return "text-destructive";
      case "confidential": return "text-warning";
      case "restricted": return "text-info";
      case "unclassified": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "urgent": return "text-destructive";
      case "important": return "text-warning";
      case "routine": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const patrolStatusColor = (s: string) => {
    switch (s) {
      case "patrolling": return "text-info";
      case "returned": return "text-success";
      case "delayed": return "text-warning";
      case "completed": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const categoryIcon = (c: string) => {
    switch (c) {
      case "threat": return Crosshair;
      case "intel": return FileText;
      case "patrol": return MapPin;
      case "admin": return Shield;
      default: return BookOpen;
    }
  };

  const trendIcon = (t: string) => {
    switch (t) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      case "stable": return Minus;
      default: return Minus;
    }
  };

  const trendColor = (t: string) => {
    switch (t) {
      case "up": return "text-success";
      case "down": return "text-destructive";
      case "stable": return "text-muted-foreground";
      default: return "text-muted-foreground";
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
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold tracking-wider text-primary">
            STRATEGIC BRIEFING
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {briefs.filter((b) => b.priority === "urgent").length} urgent
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            G-2 INTEL
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

      {/* Intel Briefs Tab */}
      {activeTab === "briefs" && (
        <div className="max-h-72 overflow-y-auto space-y-1">
          {briefs.map((brief) => {
            const Icon = categoryIcon(brief.category);
            return (
              <div key={brief.id}>
                <button
                  onClick={() => setSelectedBrief(selectedBrief === brief.id ? null : brief.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-[10px] font-mono border transition-colors ${
                    brief.priority === "urgent"
                      ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
                      : brief.priority === "important"
                      ? "border-warning/20 bg-warning/5 hover:bg-warning/10"
                      : "border-border bg-muted/20 hover:bg-muted/30"
                  }`}
                >
                  <Icon className={`w-3 h-3 shrink-0 ${priorityColor(brief.priority)}`} />
                  <span className="font-bold text-primary w-16">{brief.id}</span>
                  <span className="text-foreground flex-1 text-left truncate">{brief.title}</span>
                  <span className={`text-[9px] font-bold ${classificationColor(brief.classification)}`}>
                    {brief.classification.toUpperCase()}
                  </span>
                  <span className={`text-[9px] ${priorityColor(brief.priority)}`}>
                    {brief.priority.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">{brief.date}</span>
                  <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${selectedBrief === brief.id ? "rotate-90" : ""}`} />
                </button>
                {selectedBrief === brief.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-x border-b border-border px-3 py-2 bg-muted/10 overflow-hidden"
                  >
                    <div className="text-[9px] font-mono text-foreground mb-1">
                      {brief.summary}
                    </div>
                    <div className="flex items-center gap-3 text-[8px] text-muted-foreground">
                      <span>By: {brief.author}</span>
                      <span>{brief.date}</span>
                      <span className={`font-bold ${classificationColor(brief.classification)}`}>
                        {brief.classification.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Readiness Tab */}
      {activeTab === "readiness" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              Overall: {Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length)}%
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated: {new Date().toLocaleTimeString("en-GB", { hour12: false })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m) => {
              const Icon = m.icon;
              const TrendIcon = trendIcon(m.trend);
              const displayValue = animatedValues[m.label] || 0;
              const isBelow = displayValue < m.target;
              return (
                <div
                  key={m.label}
                  className="border border-border p-2 bg-muted/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Icon className="w-3 h-3 text-primary" />
                      <span className="text-[9px] font-bold text-primary">{m.label}</span>
                    </div>
                    <TrendIcon className={`w-3 h-3 ${trendColor(m.trend)}`} />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-lg font-bold font-mono ${isBelow ? "text-warning" : "text-success"}`}>
                      {displayValue}%
                    </span>
                    <span className="text-[8px] text-muted-foreground">
                      / {m.target}% target
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        displayValue >= m.target
                          ? "bg-success"
                          : displayValue >= m.target - 10
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, displayValue)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-1 text-[8px] text-muted-foreground flex items-center gap-1">
                    <span>{isBelow ? `${m.target - displayValue}% below target` : "Target met"}</span>
                    {displayValue >= m.target && <CircleCheck className="w-2 h-2 text-success" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Patrol Reports Tab */}
      {activeTab === "patrols" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground">
              {patrols.filter((p) => p.status === "patrolling").length} active patrols
            </span>
            <span className="text-[10px] text-muted-foreground">
              {patrols.filter((p) => p.status === "completed" || p.status === "returned").length} completed
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {patrols.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-2 py-1.5 border text-[10px] font-mono ${
                  p.status === "delayed"
                    ? "border-warning/30 bg-warning/5"
                    : p.status === "patrolling"
                    ? "border-info/20 bg-info/5"
                    : "border-border bg-muted/20"
                }`}
              >
                <MapPin className={`w-3 h-3 shrink-0 ${patrolStatusColor(p.status)}`} />
                <span className="font-bold text-primary w-12">{p.id}</span>
                <span className="text-foreground w-24 truncate">{p.sector}</span>
                <span className="text-info w-12">{p.unit}</span>
                <span className={`font-bold text-[9px] ${patrolStatusColor(p.status)}`}>
                  {p.status.toUpperCase()}
                </span>
                <span className="text-muted-foreground">
                  {p.startTime} - {p.eta}
                </span>
                <span className="text-muted-foreground flex-1 text-right truncate">{p.findings}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}