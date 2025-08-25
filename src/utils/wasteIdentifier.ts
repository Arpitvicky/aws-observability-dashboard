import { Instance } from "@/types/types";

// consider cpu, ram and gpu usage for calculating avg utilisation
export function avgUtil(i: Instance) {
  let sum = i.cpuAvg + i.ramAvg;
  let count = 2;

  if (i.gpuAvg !== undefined) {
    sum += i.gpuAvg;
    count++;
  }

  return Math.round((sum / count) * 10) / 10; // round to 1 decimal
}

// E.g

// CPU=12, RAM=18, GPU=9 → (12+18+9)/3 = 13.0 → returns 13.0.

// - Underutilized: avg util < 20% AND uptime > 24h
// - Over-provisioned: avg util < 30% AND hourly cost >= 0.40 $/h
export function isUnderutilised(i: Instance) {
  return avgUtil(i) < 20 && i.uptimeHours > 24;
}
export function isOverProvisioned(i: Instance, threshold = 0.4) {
  return avgUtil(i) < 30 && i.hourlyCost >= threshold;
}

export function wasteBadge(i: Instance) {
  if (isUnderutilised(i)) return { label: "Underutilised", color: "#f87171" };
  if (isOverProvisioned(i))
    return { label: "Over-provisioned", color: "#fbbf24" };
  return { label: "OK", color: "#34d399" };
}
