type Point = { ts: string; cpu: number; ram: number; gpu?: number };

const clamp = (x: number) => Math.max(0, Math.min(100, x));
const jitter = (v: number, spread = 8) =>
  clamp(v + (Math.random() - 0.5) * spread);
const isoMinutesAgo = (mins: number) =>
  new Date(Date.now() - mins * 60_000).toISOString();
const isoHoursAgo = (hrs: number) =>
  new Date(Date.now() - hrs * 3_600_000).toISOString();

// build 12 points for 1 hour (every 5 minutes) from a seed point
export const make1h = (seed: Point): Point[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const minsAgo = (11 - i) * 5; // 55, 50, ..., 0
    return {
      ts: isoMinutesAgo(minsAgo),
      cpu: jitter(seed.cpu, 8),
      ram: jitter(seed.ram, 6),
      gpu: seed.gpu !== undefined ? jitter(seed.gpu, 8) : undefined,
    };
  });
};

// build 7 days (168 hourly points) by repeating the 24h shape with small noise
export const make7d = (base24: Point[]): Point[] => {
  const out: Point[] = [];
  const safeRef = base24[0] ?? {
    ts: new Date().toISOString(),
    cpu: 10,
    ram: 15,
  };
  for (let h = 7 * 24 - 1; h >= 0; h--) {
    const ref = base24[h % 24] ?? safeRef;
    out.push({
      ts: isoHoursAgo(h),
      cpu: jitter(ref.cpu, 8),
      ram: jitter(ref.ram, 8),
      gpu: ref.gpu !== undefined ? jitter(ref.gpu, 8) : undefined,
    });
  }
  return out;
};
