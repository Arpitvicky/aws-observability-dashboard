"use client";
import { COLORS } from "@/constants";
import { Instance, InstanceSeries } from "@/types/types";
import { make1h, make7d } from "@/utils/instanceHelper";
import { formatTick, formatTooltipLabel } from "@/utils/timeFormatHelpers";
import { useMemo, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const InstanceAnalyzer = ({
  instance,
  series,
  onClose,
}: {
  instance: Instance | null;
  series: InstanceSeries;
  onClose: () => void;
}) => {
  const [range, setRange] = useState<"1h" | "24h" | "7d">("24h");

  const base24 = useMemo(
    () => (instance ? series[instance.id] || [] : []),
    [instance, series]
  );
  const data = useMemo(() => {
    const hasGpu = !!instance?.gpuAvg;
    if (range === "24h") return base24;
    if (range === "1h") {
      const seed = base24.at(-1) ?? {
        ts: new Date().toISOString(),
        cpu: 10,
        ram: 15,
        gpu: hasGpu ? 10 : undefined,
      };
      return make1h(seed);
    }
    return make7d(base24);
  }, [range, base24, instance?.gpuAvg]);

  const idleBandMax = 10; // <=10% = idle

  // nice timestamp
  const dataTimed = useMemo(
    () => data.map((p) => ({ ...p, t: new Date(p.ts).getTime() })),
    [data]
  );

  // spike markers
  const spikes = dataTimed
    .filter((d) => d.cpu > 80 || d.ram > 80 || (d.gpu ?? 0) > 80)
    .slice(0, 5);

  if (!instance) return null;
  return (
    <div className="fixed z-10 inset-y-0 right-0 w-[520px] bg-white border-l border-gray-300 p-4 overflow-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="mt-0 text-lg font-semibold">
            Instance name/ID: {instance.name}/{instance.id}
          </h3>
          <div className="text-gray-600 mb-2">
            <p>
              <strong>Instance region and type: </strong>
              {instance.region}
            </p>
            <p>
              <strong>Instance type: </strong>
              {instance.instanceType}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Range buttons */}
      <div className="mb-2 flex gap-2">
        {(["1h", "24h", "7d"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            disabled={range === r}
            className={[
              "rounded px-2 py-1 text-sm border",
              range === r
                ? "bg-gray-200 border-gray-300 cursor-default"
                : "border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="relative h-64 border border-gray-200 rounded-lg">
        <div className="absolute left-2 top-2 text-xs text-gray-700">
          Utilization ({range})
        </div>

        <div className="absolute inset-x-2 bottom-2 top-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataTimed}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(t) => formatTick(t as number, range)}
                minTickGap={50}
                allowDecimals={false}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                labelFormatter={(t) => formatTooltipLabel(t as number)}
                formatter={(v: number, name) => [
                  `${Math.round(v as number)}%`,
                  name,
                ]}
              />
              <Legend />

              <ReferenceArea y1={0} y2={idleBandMax} fill={COLORS.idleBand} />

              <Line
                dataKey="cpu"
                name="CPU%"
                dot={false}
                stroke={COLORS.cpu}
                strokeWidth={2}
              />
              <Line
                dataKey="ram"
                name="RAM%"
                dot={false}
                stroke={COLORS.ram}
                strokeWidth={2}
              />
              {dataTimed.some((d) => d.gpu !== undefined) && (
                <Line
                  dataKey="gpu"
                  name="GPU%"
                  dot={false}
                  stroke={COLORS.gpu}
                  strokeWidth={2}
                />
              )}

              {spikes.map((s, idx) => (
                <ReferenceDot
                  key={idx}
                  x={s.t}
                  y={Math.max(s.cpu, s.ram, s.gpu ?? 0)}
                  r={4}
                  fill={COLORS.spikeFill}
                  stroke={COLORS.spikeStroke}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        <strong>Suggested actions</strong>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>
            Mostly idle (≤10%) Off-hours scheduling for idle boxes (e.g., stop
            12h/night)
            <div>Savings = hourlyCost x 12 x days</div>
          </li>
          <li>
            Right-size - low-util instances can be changed to a smaller type
            (one size down often saves 30–50%).
          </li>
          <li>Missing owner/job tags - add tags for better attribution.</li>
        </ul>
      </div>
    </div>
  );
};
