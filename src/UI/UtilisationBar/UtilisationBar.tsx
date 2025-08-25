export const UtilisationBar = ({ value }: { value: number }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color = clamped < 20 ? "#f87171" : clamped < 40 ? "#fbbf24" : "#34d399";

  return (
    <div
      className="w-16 h-2 bg-gray-200 rounded"
      role="progressbar"
      title={`${clamped}%`}
    >
      <div
        className="h-full rounded"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
};
