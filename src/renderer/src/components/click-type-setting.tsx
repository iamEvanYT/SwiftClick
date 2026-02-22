import { SegmentedControl } from "./segmented-control";

interface ClickTypeSettingProps {
  value: "single" | "double";
  disabled: boolean;
  onChange: (value: "single" | "double") => void;
}

export const ClickTypeSetting = ({ value, disabled, onChange }: ClickTypeSettingProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
      <SegmentedControl
        options={[
          { label: "Single", value: "single" },
          { label: "Double", value: "double" }
        ]}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
};
