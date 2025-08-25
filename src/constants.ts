// colors
export const COLORS = {
  cpu: "#2563eb", // blue
  ram: "#16a34a", // green
  gpu: "#9333ea", // purple
  idleBand: "rgba(107,114,128,0.15)", // gray with alpha
  spikeFill: "#ef4444", // red fill
  spikeStroke: "#991b1b", // red dark stroke
};

export const DIMENSION_OPTIONS = [
  { value: "region", label: "Region" },
  { value: "instanceType", label: "Type" },
  { value: "owner", label: "Owner" },
  { value: "jobId", label: "Job" },
] as const;
