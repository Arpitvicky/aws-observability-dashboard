export const KPIbox = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="border border-gray-200 rounded-lg h-32 md:h-36 px-3 flex flex-col items-center justify-center text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
};
