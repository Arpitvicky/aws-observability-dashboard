"use client";
import { CostEntry } from "@/types/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Kpi = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
};
export function KpiHeader({ costs }: { costs: CostEntry[] }) {
  // cost per day total
  const totalsByDate: Record<string, number> = {};
  for (const c of costs)
    totalsByDate[c.ts] = (totalsByDate[c.ts] || 0) + c.amount;

  const sortedDates = Object.keys(totalsByDate).sort();
  const dailyTotals = sortedDates.map((ts) => ({
    ts,
    v: Number(totalsByDate[ts].toFixed(2)),
  }));

  const totalCostAllTime = dailyTotals.reduce((sum, d) => sum + d.v, 0);

  // Use the last 7 days for a stable baseline
  const lastSevenDays = dailyTotals.slice(-7);
  const latestDayTotal = lastSevenDays.at(-1)?.v ?? 0;
  const previousDays =
    lastSevenDays.length > 1 ? lastSevenDays.slice(0, -1) : lastSevenDays; // exclude latest day for calculating baselinedaily burn

  const baselineDailyBurn = previousDays.length
    ? previousDays.reduce((s, d) => s + d.v, 0) / previousDays.length
    : latestDayTotal;

  const projectedMonthlyFromBaseline = baselineDailyBurn * 30;

  // assume spike happened on last day and is greater than threshold 1.5 * baselinedailyburn
  const isSpike =
    previousDays.length > 0 && latestDayTotal > 1.5 * baselineDailyBurn;
  const latestDate = lastSevenDays.at(-1)?.ts;

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Live Cloud Cost Overview</h2>

      <div className="grid grid-cols-5 gap-4">
        <Kpi label="Total cost" value={`$${totalCostAllTime.toFixed(2)}`} />
        <Kpi
          label="Daily burn (baseline)"
          value={`$${baselineDailyBurn.toFixed(2)}`}
        />
        <Kpi
          label="Projected (30d)"
          value={`$${projectedMonthlyFromBaseline.toFixed(2)}`}
        />

        <div className="relative col-span-2 h-24 border border-gray-200 rounded-lg overflow-hidden">
          <div className="absolute right-2 top-1 flex items-center gap-2 z-10">
            <span className="text-[10px] text-gray-500">
              Latest ({latestDate ?? "—"}): ${latestDayTotal.toFixed(2)}
            </span>
            {isSpike && (
              <span className="bg-amber-200 px-2 py-[2px] rounded-full text-xs">
                Spike
              </span>
            )}
          </div>

          <div className="absolute left-2 top-2 text-xs text-gray-700 z-10">
            7-day cost trend
          </div>

          <div className="absolute inset-x-2 bottom-2 top-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lastSevenDays.length ? lastSevenDays : dailyTotals}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis dataKey="ts" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="v" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
