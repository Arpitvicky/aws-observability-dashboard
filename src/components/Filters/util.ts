import { Instance } from "@/types/types";
import { Filters } from "./type";

export const applyFilters = (
  instances: Instance[],
  f: Filters,
  isUnderutilized: (i: Instance) => boolean
) => {
  return instances.filter((i) => {
    const matchesRegion = !f.region || i.region === f.region;
    const matchesType = !f.instanceType || i.instanceType === f.instanceType;

    const matchesWaste =
      f.waste === "under"
        ? isUnderutilized(i)
        : f.waste === "low"
        ? !isUnderutilized(i)
        : true; // "all"

    return matchesRegion && matchesType && matchesWaste;
  });
};
