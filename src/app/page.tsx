"use client";
import CostAttribution from "@/components/CostAttribution/CostAttribution";
import { FiltersBar } from "@/components/Filters/Filters";
import { Filters } from "@/components/Filters/type";
import { applyFilters } from "@/components/Filters/util";
import { InstanceAnalyzer } from "@/components/InstanceAnalyzer/InstanceAnalyzer";
import { InstanceTable } from "@/components/InstanceTable/InstanceTable";
import { KpiHeader } from "@/components/KPIHeader/KPIHeader";
import { COST_LEDGER } from "@/data/costConsumptionData";
import { INSTANCES, SERIES } from "@/data/mockInstanceData";
import { usePersistentFilters } from "@/hooks/persistentFiltersHook";
import { Instance } from "@/types/types";
import { isUnderutilised } from "@/utils/wasteIdentifier";
import { useMemo, useState } from "react";

const Page = () => {
  // localStorage support for storing filters and initially show all
  const { filters, setFilters, reset } = usePersistentFilters("ec2-filters", {
    waste: "all",
  });
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(
    null
  );

  // apply filters to instances
  const filteredInstances = useMemo(
    () => applyFilters(INSTANCES, filters as Filters, isUnderutilised),
    [filters]
  );

  // filter costs to only those instances currently visible
  const visibleIds = new Set(filteredInstances.map((i) => i.id));
  const filteredCosts = COST_LEDGER.filter((c) => visibleIds.has(c.instanceId));

  return (
    <div className="max-w-[1200px] mx-auto my-6 px-4 flex flex-col gap-4">
      <h2 className="m-0 text-xl font-semibold">
        EC2 Observability (with Simulated data)
      </h2>

      <KpiHeader costs={filteredCosts} />

      <FiltersBar
        instances={INSTANCES}
        value={filters}
        onChange={setFilters}
        onReset={reset}
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:flex-[2] md:min-w-0">
          <InstanceTable
            data={filteredInstances}
            onSelect={setSelectedInstance}
          />
        </div>
        <div className="w-full md:flex-1 md:min-w-0">
          <CostAttribution costs={filteredCosts} />
        </div>
      </div>
      {selectedInstance && (
        <InstanceAnalyzer
          instance={selectedInstance}
          series={SERIES}
          onClose={() => setSelectedInstance(null)}
        />
      )}
    </div>
  );
};
export default Page;
