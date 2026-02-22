import { Keyboard } from "lucide-react";
import { formatHotkey } from "../utils/format-hotkey";

interface HotkeySettingProps {
  hotkey: string;
  isEditing: boolean;
  pendingHotkey: string[];
  canSave: boolean;
  onEdit: () => void;
  onClear: () => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const HotkeySetting = ({
  hotkey,
  isEditing,
  pendingHotkey,
  canSave,
  onEdit,
  onClear,
  onKeyDown,
  onSave,
  onCancel
}: HotkeySettingProps) => {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
        <Keyboard className="w-3.5 h-3.5" />
        Hotkey
      </label>
      {!isEditing ? (
        <div className="flex gap-1.5">
          <button
            onClick={onEdit}
            className="flex-1 py-1.5 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-xs text-slate-200 transition-colors"
          >
            {hotkey ? formatHotkey(hotkey) : "None"}
          </button>
          {hotkey && (
            <button
              onClick={onClear}
              className="py-1.5 px-3 bg-slate-700 hover:bg-red-600 rounded-lg text-slate-300 hover:text-white text-xs font-medium transition-colors"
              title="Clear hotkey"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <input
            type="text"
            readOnly
            value={pendingHotkey.length > 0 ? pendingHotkey.join(" + ") : "Press keys..."}
            onKeyDown={onKeyDown}
            autoFocus
            className="w-full py-1.5 px-3 bg-slate-700 rounded-lg text-slate-200 text-center text-xs font-mono"
          />
          <div className="flex gap-1.5">
            <button
              onClick={onSave}
              disabled={!canSave}
              className="flex-1 py-1.5 px-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg text-white text-xs font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-1.5 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
