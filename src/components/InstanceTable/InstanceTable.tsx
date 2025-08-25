"use client";
import { Instance } from "@/types/types";
import { Select } from "@/UI/Select/Select";
import { UtilisationBar } from "@/UI/UtilisationBar/UtilisationBar";
import { avgUtil, wasteBadge } from "@/utils/wasteIdentifier";
import { useMemo, useState } from "react";

type SortKey = "cost" | "cpu" | "util" | "region" | "type";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "cost", label: "$/h (desc)" },
  { value: "cpu", label: "CPU% (desc)" },
  { value: "util", label: "Util avg (desc)" },
  { value: "region", label: "Region (A→Z)" },
  { value: "type", label: "Type (A→Z)" },
];

export function InstanceTable({
  data,
  onSelect,
}: {
  data: Instance[];
  onSelect: (i: Instance) => void;
}) {
  const [sortBy, setSortBy] = useState<SortKey>("cost");
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      if (sortBy === "cost") return b.hourlyCost - a.hourlyCost;
      if (sortBy === "cpu") return b.cpuAvg - a.cpuAvg;
      if (sortBy === "util") return avgUtil(b) - avgUtil(a);
      if (sortBy === "region") return a.region.localeCompare(b.region);
      if (sortBy === "type")
        return a.instanceType.localeCompare(b.instanceType);
      return 0;
    });
    return arr;
  }, [data, sortBy]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b border-gray-200">
        <strong className="text-sm">
          EC2 Instances table - select instance to see detailed view
        </strong>
        <Select
          label="Sort"
          value={sortBy} // "cost" | "cpu" | "util" | ...
          options={SORT_OPTIONS} // proper labels
          onChange={(v) => setSortBy((v as SortKey) ?? "cost")}
          showAllOption={false}
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-2">Name/ID</th>
            <th className="px-2 py-2">Region</th>
            <th className="px-2 py-2">Type</th>
            <th className="px-2 py-2">Uptime (h)</th>
            <th className="px-2 py-2">CPU%</th>
            <th className="px-2 py-2">RAM%</th>
            <th className="px-2 py-2">GPU%</th>
            <th className="px-2 py-2">$ / h</th>
            <th className="px-2 py-2">Util avg</th>
            <th className="px-2 py-2">Waste</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((i) => {
            const badge = wasteBadge(i);
            return (
              <tr
                key={i.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelect(i)}
              >
                <td className="px-2 py-2">{i.id}</td>
                <td className="px-2 py-2">{i.region}</td>
                <td className="px-2 py-2">{i.instanceType}</td>
                <td className="px-2 py-2">{i.uptimeHours}</td>
                <td className="px-2 py-2">
                  <UtilisationBar value={i.cpuAvg} />
                </td>
                <td className="px-2 py-2">
                  <UtilisationBar value={i.ramAvg} />
                </td>
                <td className="px-2 py-2">
                  {i.gpuAvg !== undefined ? (
                    <UtilisationBar value={i.gpuAvg} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-2 py-2">${i.hourlyCost.toFixed(3)}</td>
                <td className="px-2 py-2">{avgUtil(i)}%</td>
                <td className="px-2 py-2">
                  <span
                    className="text-gray-900 px-2 py-0.5 rounded-2xl text-xs font-medium"
                    style={{ background: badge.color }}
                  >
                    {badge.label}
                  </span>
                </td>
              </tr>
            );
          })}
          {!sorted.length && (
            <tr>
              <td colSpan={10} className="px-3 py-3 text-center text-gray-600">
                No instances match filters
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="m-2 text-xs text-gray-600">
        <strong>Notes: Tradeoff</strong>
        <p>
          Used only color bars to show utilisation for CPU/RAM/GPU not
          highlighting entire row
        </p>{" "}
        Assumption— "waste" = avg utilisation (CPU/RAM/GPU)
        <p>Waste identifier: </p>
        <p>"Underutilised" -- &lt;20% for &gt;24h uptime</p>
        <p>
          "over-provisioned" -- low util + high $/h (assume threshold hourly to
          be .40$
        </p>
      </div>
    </div>
  );
}
