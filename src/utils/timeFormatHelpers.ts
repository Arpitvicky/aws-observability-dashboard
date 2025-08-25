export const fmtTimeShort = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});
export const fmtDayShort = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
});
export const fmtFull = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
export const formatTick = (t: number, range: "1h" | "24h" | "7d") => {
  const d = new Date(t);
  return range === "7d" ? fmtDayShort.format(d) : fmtTimeShort.format(d);
};
export const formatTooltipLabel = (t: number) => {
  return fmtFull.format(new Date(t));
};
