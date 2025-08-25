import { CostEntry } from "@/types/types";

// Return YYYY-MM-DD for n days ago (UTC)
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Config for each instance’s base cost + metadata
// Explained in document and architecture diagram about where to get data in production setup.
const COST_SPECS = [
  {
    instanceId: "i-0a1",
    base: 6.0, // Total amount for one day - assume hourly rate (from instance object) * 12 hrs
    region: "eu-central-1",
    instanceType: "g4dn.xlarge",
    owner: "team-bio",
    jobId: "JOB-123",
  },
  {
    instanceId: "i-0b2",
    base: 3.6,
    region: "eu-central-1",
    instanceType: "m5.2xlarge",
    owner: "team-data",
    jobId: "JOB-456",
  },
  {
    instanceId: "i-0c3",
    base: 0.7,
    region: "us-east-1",
    instanceType: "t3.medium",
    owner: "team-bio",
    jobId: "JOB-789",
  },
  {
    instanceId: "i-0d4",
    base: 8.4,
    region: "eu-central-1",
    instanceType: "g4dn.xlarge",
    owner: "team-core",
    jobId: "JOB-999",
  },
  {
    instanceId: "i-0e5",
    base: 8,
    region: "us-east-1",
    instanceType: "t3.medium",
  },
];

export const COST_LEDGER: CostEntry[] = [];
// Cost consumption data for 7 days for each instance -- 28 items in array in this case
for (const spec of COST_SPECS) {
  for (let n = 0; n < 7; n++) {
    let amount;
    amount = spec.base + Math.random();
    if (n === 0) amount *= 3.2; // <— inject a spike today
    COST_LEDGER.push({
      ts: daysAgo(n),
      instanceId: spec.instanceId,
      amount: Number(amount.toFixed(2)), // Total amount per day per instance with some assumed deltas
      region: spec.region,
      instanceType: spec.instanceType,
      owner: spec.owner,
      jobId: spec.jobId,
    });
  }
}
