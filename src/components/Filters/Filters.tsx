"use client";
import { Instance } from "@/types/types";
import { Button } from "@/UI/Button/Button";
import { Select } from "@/UI/Select/Select";
import { Filters } from "./type";

export const FiltersBar = ({
  instances,
  value,
  onChange,
  onReset,
}: {
  instances: Instance[];
  value: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) => {
  console.log(Array.from(new Set(instances.map((i) => i.instanceType))));
  // Extract the unique regions and instance types to form the dropdown
  const regions = Array.from(new Set(instances.map((i) => i.region))).map(
    (r) => ({ value: r, label: r })
  );

  const types = Array.from(new Set(instances.map((i) => i.instanceType))).map(
    (t) => ({ value: t, label: t })
  );

  return (
    <div className="flex gap-2 my-3">
      <h2>
        <strong>Filters: </strong>
      </h2>
      <Select
        label="Region"
        value={value.region}
        options={regions}
        onChange={(v) => onChange({ ...value, region: v })}
        showAllOption
        allLabel="All regions"
      />
      <Select
        label="Type"
        value={value.instanceType}
        options={types}
        onChange={(v) => onChange({ ...value, instanceType: v })}
        showAllOption
        allLabel="All types"
      />
      <Select
        label="Waste"
        value={value.waste || "all"}
        options={[
          { value: "under", label: "Underutilized" },
          { value: "low", label: "Low Util" },
        ]}
        onChange={(v) =>
          onChange({ ...value, waste: (v ?? "all") as Filters["waste"] })
        }
        showAllOption
        allLabel="All wastes"
      />
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};
