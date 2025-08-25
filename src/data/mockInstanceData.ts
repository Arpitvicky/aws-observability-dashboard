import { Instance, InstanceSeries } from "@/types/types";

// Instances list - Explained in document and architecture diagram about where to get data in production setup.
export const INSTANCES: Instance[] = [
  {
    id: "i-0a1",
    name: "aligner-gpu-1",
    region: "eu-central-1",
    instanceType: "g4dn.xlarge",
    owner: "team-bio",
    jobId: "JOB-123",
    hourlyCost: 0.526,
    uptimeHours: 72,
    cpuAvg: 12,
    ramAvg: 18,
    gpuAvg: 9,
  },
  {
    id: "i-0b2",
    name: "etl-cpu-2",
    region: "eu-central-1",
    instanceType: "m5.2xlarge",
    owner: "team-data",
    jobId: "JOB-456",
    hourlyCost: 0.384,
    uptimeHours: 30,
    cpuAvg: 48,
    ramAvg: 52,
  },
  {
    id: "i-0c3",
    name: "notebook-small",
    region: "us-east-1",
    instanceType: "t3.medium",
    owner: "team-bio",
    jobId: "JOB-789",
    hourlyCost: 0.0416,
    uptimeHours: 90,
    cpuAvg: 5,
    ramAvg: 8,
  },
  {
    id: "i-0d4",
    name: "gpu-idle",
    region: "eu-central-1",
    instanceType: "g4dn.xlarge",
    owner: "team-core",
    jobId: "JOB-999",
    hourlyCost: 0.768,
    uptimeHours: 72,
    cpuAvg: 26,
    ramAvg: 24,
  },
  {
    id: "i-0e5",
    name: "gpu-idle",
    region: "us-east-1",
    instanceType: "t3.medium",
    hourlyCost: 0.668,
    uptimeHours: 60,
    cpuAvg: 16,
    ramAvg: 14,
  },
];

function series24h(seed: { cpu: number; ram: number; gpu?: number }) {
  const result = [];
  for (let i = 0; i < 24; i++) {
    const ts = new Date(Date.now() - (23 - i) * 3600_000).toISOString();
    result.push({
      ts,
      cpu: seed.cpu + (Math.random() * 10 - 5), // ±5 variation
      ram: seed.ram + (Math.random() * 10 - 5),
      gpu: seed.gpu != null ? seed.gpu + (Math.random() * 10 - 5) : undefined,
    });
  }
  return result;
}

// 24hr consumption data for each instance
export const SERIES: InstanceSeries = {
  "i-0a1": series24h({ cpu: 10, ram: 15, gpu: 8 }),
  "i-0b2": series24h({ cpu: 45, ram: 50 }),
  "i-0c3": series24h({ cpu: 6, ram: 7 }),
  "i-0d4": series24h({ cpu: 80, ram: 9 }),
  "i-0e5": series24h({ cpu: 30, ram: 19 }),
};
