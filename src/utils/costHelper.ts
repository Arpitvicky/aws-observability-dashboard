import { CostEntry } from "@/types/types";

// Cost helpers
export function totalCost(entries: CostEntry[]) {
  return entries.reduce((s, e) => s + e.amount, 0);
}

// take the last day usage as the daily burn
export function dailyBurn(entries: CostEntry[]) {
  const byDay: Record<string, number> = {};
  for (const e of entries) byDay[e.ts] = (byDay[e.ts] || 0) + e.amount;
  const days = Object.keys(byDay).sort();
  const last = days.at(-1);
  return last ? byDay[last] : 0;
}

export function projectedMonthly(burnPerDay: number) {
  return burnPerDay * 30;
}
