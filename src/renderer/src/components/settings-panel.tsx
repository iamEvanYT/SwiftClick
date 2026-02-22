import type { AppSettings } from "../types";
import { HotkeySetting } from "./hotkey-setting";
import { ClickCountSetting } from "./click-count-setting";
import { IntervalSetting } from "./interval-setting";
import { MouseButtonSetting } from "./mouse-button-setting";
import { ClickTypeSetting } from "./click-type-setting";

interface SettingsPanelProps {
  settings: AppSettings;
  isActive: boolean;
  isEditingHotkey: boolean;
  pendingHotkey: string[];
  canSaveHotkey: boolean;
  onSettingChange: (key: keyof AppSettings, value: string | number) => Promise<void>;
  onHotkeyEdit: () => void;
  onHotkeyClear: () => Promise<void>;
  onHotkeyKeyDown: (e: React.KeyboardEvent) => void;
  onHotkeySave: () => Promise<void>;
  onHotkeyCancel: () => void;
}

export const SettingsPanel = ({
  settings,
  isActive,
  isEditingHotkey,
  pendingHotkey,
  canSaveHotkey,
  onSettingChange,
  onHotkeyEdit,
  onHotkeyClear,
  onHotkeyKeyDown,
  onHotkeySave,
  onHotkeyCancel
}: SettingsPanelProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-2xl">
      <div className="space-y-3">
        <HotkeySetting
          hotkey={settings.hotkey}
          isEditing={isEditingHotkey}
          pendingHotkey={pendingHotkey}
          canSave={canSaveHotkey}
          onEdit={onHotkeyEdit}
          onClear={onHotkeyClear}
          onKeyDown={onHotkeyKeyDown}
          onSave={onHotkeySave}
          onCancel={onHotkeyCancel}
        />

        <ClickCountSetting
          value={settings.clickCount}
          disabled={isActive}
          onChange={(value) => onSettingChange("clickCount", value)}
        />

        <IntervalSetting
          value={settings.interval}
          disabled={isActive}
          onChange={(value) => onSettingChange("interval", value)}
        />

        <MouseButtonSetting
          value={settings.mouseButton}
          disabled={isActive}
          onChange={(value) => onSettingChange("mouseButton", value)}
        />

        <ClickTypeSetting
          value={settings.clickType}
          disabled={isActive}
          onChange={(value) => onSettingChange("clickType", value)}
        />
      </div>
    </div>
  );
};
