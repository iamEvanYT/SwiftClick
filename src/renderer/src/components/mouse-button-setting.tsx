import { MousePointer2 } from "lucide-react";
import { SegmentedControl } from "./segmented-control";

interface MouseButtonSettingProps {
  value: "left" | "right" | "middle";
  disabled: boolean;
  onChange: (value: "left" | "right" | "middle") => void;
}

export const MouseButtonSetting = ({ value, disabled, onChange }: MouseButtonSettingProps) => {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
        <MousePointer2 className="w-3.5 h-3.5" />
        Button
      </label>
      <SegmentedControl
        options={[
          { label: "Left", value: "left" },
          { label: "Middle", value: "middle" },
          { label: "Right", value: "right" }
        ]}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
};
