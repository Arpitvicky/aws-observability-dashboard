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
    <div className="mx-auto max-w-screen-xl px-3 sm:px-4 lg:px-6 py-6 space-y-4">
      <h2 className="m-0 text-xl font-semibold">
        EC2 Observability (with Simulated data)
      </h2>

      <KpiHeader costs={filteredCosts} />
      <div className="w-full">
        <FiltersBar
          instances={INSTANCES}
          value={filters}
          onChange={setFilters}
          onReset={reset}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [&>*]:min-w-0">
        <div className="lg:col-span-2">
          <InstanceTable
            data={filteredInstances}
            onSelect={setSelectedInstance}
          />
        </div>
        <div className="lg:col-span-1">
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
