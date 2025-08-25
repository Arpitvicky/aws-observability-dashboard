type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export const ToggleButton = ({
  checked,
  onChange,
  label = "Toggle",
}: ToggleProps) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      {/* Track */}
      <div className="w-[60px] h-[24px] bg-gray-300 rounded-full transition-colors peer-checked:bg-black" />
      {/* Knob */}
      <span className="pointer-events-none absolute h-6 w-6 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-[26px]" />
      {/* Optional text */}
      <span className="ml-3 text-sm text-gray-700">{label}</span>
    </label>
  );
};
