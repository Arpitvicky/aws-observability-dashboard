export type Instance = {
  id: string;
  name?: string;
  region: string;
  instanceType: string;
  owner?: string;
  jobId?: string;
  hourlyCost: number;
  uptimeHours: number;
  cpuAvg: number;
  ramAvg: number;
  gpuAvg?: number;
};

export type TimeseriesPoint = {
  ts: string;
  cpu: number;
  ram: number;
  gpu?: number;
};
export type InstanceSeries = Record<string, TimeseriesPoint[]>;

export type CostEntry = {
  ts: string;
  instanceId: string;
  amount: number;
  region: string;
  instanceType: string;
  owner?: string;
  jobId?: string;
};
