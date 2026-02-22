import { Timer } from "lucide-react";
import { EditableSlider } from "./editable-slider";

interface IntervalSettingProps {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export const IntervalSetting = ({ value, disabled, onChange }: IntervalSettingProps) => {
  return (
    <EditableSlider
      icon={<Timer className="w-3.5 h-3.5" />}
      label="Interval"
      value={value}
      disabled={disabled}
      min={10}
      max={5000}
      step={10}
      onChange={onChange}
      formatDisplay={(current) => `${current}ms`}
      parseInput={(input) => {
        const trimmed = input.trim().toLowerCase().replace(/ms$/, "");
        if (!trimmed) return null;
        const parsed = parseInt(trimmed, 10);
        return Number.isNaN(parsed) ? null : parsed;
      }}
    />
  );
};
