export const Badge = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {label}
    </span>
  );
};
