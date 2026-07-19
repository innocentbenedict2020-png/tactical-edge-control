export const BRAND_NAME = "SENTINEL-301";
export const UNIT_NAME = "301 Artillery Regiment";
export const LOCATION = "General Support Barrack, Gombe State";
export const BASE_CURRENCY = "₦";
export const STORAGE_KEY = "sentinel-301-data";
export const ALERT_LEVELS = ["GREEN", "AMBER", "RED"] as const;
export type AlertLevel = (typeof ALERT_LEVELS)[number];
export const ALERT_COLORS: Record<AlertLevel, string> = {
  GREEN: "oklch(0.65 0.2 145)",
  AMBER: "oklch(0.7 0.18 75)",
  RED: "oklch(0.6 0.24 25)",
};
export const ROLES = [
  "Commanding Officer (CO)",
  "Provost Marshall",
  "Garrison Commander",
  "Medical Officer",
] as const;
export type Role = (typeof ROLES)[number];