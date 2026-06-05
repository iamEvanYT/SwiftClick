import type { ClickType, ClickerMode } from "../../../common/settings";
import { SegmentedControl } from "./segmented-control";

interface ClickTypeSettingProps {
  clickerMode: ClickerMode;
  value: ClickType;
  disabled: boolean;
  onChange: (value: ClickType) => void;
}

export const ClickTypeSetting = ({ clickerMode, value, disabled, onChange }: ClickTypeSettingProps) => {
  const options =
    clickerMode === "key"
      ? [
          { label: "Press", value: "single" as const },
          { label: "Hold", value: "hold" as const }
        ]
      : [
          { label: "Single", value: "single" as const },
          { label: "Double", value: "double" as const }
        ];

  const displayValue =
    clickerMode === "key" ? (value === "hold" ? "hold" : "single") : value === "double" ? "double" : "single";

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
      <SegmentedControl
        options={options}
        value={displayValue}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
};
