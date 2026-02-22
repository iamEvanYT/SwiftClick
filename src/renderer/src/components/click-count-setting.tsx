import { Hash } from "lucide-react";
import { EditableSlider } from "./editable-slider";

interface ClickCountSettingProps {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export const ClickCountSetting = ({ value, disabled, onChange }: ClickCountSettingProps) => {
  return (
    <EditableSlider
      icon={<Hash className="w-3.5 h-3.5" />}
      label="Count"
      value={value}
      disabled={disabled}
      min={0}
      max={1000}
      step={10}
      onChange={onChange}
      formatDisplay={(current) => (current === 0 ? "∞" : current.toString())}
      parseInput={(input) => {
        const trimmed = input.trim();
        if (!trimmed) return null;
        if (trimmed === "∞" || trimmed.toLowerCase() === "infinity") {
          return 0;
        }
        const parsed = parseInt(trimmed, 10);
        return Number.isNaN(parsed) ? null : parsed;
      }}
    />
  );
};
