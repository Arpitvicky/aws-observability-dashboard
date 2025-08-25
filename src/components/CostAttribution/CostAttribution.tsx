"use client";
import { DIMENSION_OPTIONS } from "@/constants";
import { CostEntry } from "@/types/types";
import { Badge } from "@/UI/Badge/Badge";
import { ToggleButton } from "@/UI/ToggleButton/ToggleButton";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Dimension = "region" | "instanceType" | "owner" | "jobId";

export default function CostAttribution({ costs }: { costs: CostEntry[] }) {
  const [dim, setDim] = useState<Dimension>("region");
  const [barView, setBarView] = useState(false);

  // assume unaccounted as without owner and jobId
  const { total, attributed, unaccounted } = useMemo(() => {
    const total = costs.reduce((s, c) => s + c.amount, 0);
    const attributed = costs
      .filter((c) => c.owner && c.jobId)
      .reduce((s, c) => s + c.amount, 0);
    const unaccounted = total - attributed;
    return { total, attributed, unaccounted };
  }, [costs]);

  // Group by selected dimension
  const rows = useMemo(() => {
    const groups: Record<string, number> = {};
    // group by region initially
    for (const c of costs) {
      const key = (c as any)[dim] ?? "unknown";
      groups[key] = (groups[key] || 0) + c.amount;
    }
    console.log(groups);
    return Object.entries(groups)
      .map(([key, cost]) => ({ key, cost: +cost.toFixed(2) }))
      .sort((a, b) => b.cost - a.cost);
  }, [costs, dim]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 m-0">
          Cost Attribution
        </h3>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span>Group by:</span>
            <select
              aria-label="Group by"
              value={dim}
              onChange={(e) => setDim(e.target.value as Dimension)}
              className="cursor-pointer border rounded px-2 py-1 bg-white text-sm"
            >
              {DIMENSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          {/* Single toggle: Bar view (Table is default) */}
          <ToggleButton
            checked={barView}
            onChange={setBarView}
            label="Bar view"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
        <Badge label={`Total $${total.toFixed(2)}`} />
        <Badge label={`Attributed $${attributed.toFixed(2)}`} />
        <Badge label={`Unaccounted $${unaccounted.toFixed(2)}`} />
      </div>

      {/* Table default view */}
      {!barView && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-2 py-2">Group</th>
                <th className="px-2 py-2">$ Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="odd:bg-white even:bg-gray-50">
                  <td className="px-2 py-2">{r.key}</td>
                  <td className="px-2 py-2">${r.cost.toFixed(2)}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td
                    className="px-2 py-3 text-center text-gray-600"
                    colSpan={2}
                  >
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Graph view*/}
      {barView && (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <XAxis dataKey="key" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="m-2 text-xs text-gray-600">
        <strong>Notes: Tradeoff</strong>
        <p>Assume unaccounted as without jobid and owner</p>{" "}
      </div>
    </div>
  );
}
