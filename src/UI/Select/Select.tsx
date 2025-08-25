export type Option = { value: string; label: string };

interface Props {
  label: string;
  value?: string;
  options: Option[];
  onChange: (v?: string) => void;
  showAllOption?: boolean;
  allLabel?: string;
}
export const Select = ({
  label,
  value,
  options,
  onChange,
  showAllOption = true,
  allLabel,
}: Props) => {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="cursor-pointer border rounded px-2 py-1 bg-white text-sm"
    >
      {showAllOption && (
        <option value="">{allLabel ?? `All ${label.toLowerCase()}s`}</option>
      )}

      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};
