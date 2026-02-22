interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  disabled?: boolean;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  disabled = false,
  onChange
}: SegmentedControlProps<T>) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            value === option.value ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
