import { SegmentedControl } from "./segmented-control";

interface ClickerModeSettingProps {
  value: "mouse" | "key";
  disabled: boolean;
  onChange: (value: "mouse" | "key") => void;
}

export const ClickerModeSetting = ({ value, disabled, onChange }: ClickerModeSettingProps) => {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">Mode</label>
      <SegmentedControl
        options={[
          { label: "Mouse", value: "mouse" },
          { label: "Key", value: "key" }
        ]}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
};
