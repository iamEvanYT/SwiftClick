import { Keyboard } from "lucide-react";
import { formatHotkey } from "../utils/format-hotkey";

interface TargetKeySettingProps {
  targetKey: string;
  isEditing: boolean;
  pendingKey: string[];
  canSave: boolean;
  disabled: boolean;
  onEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export const TargetKeySetting = ({
  targetKey,
  isEditing,
  pendingKey,
  canSave,
  disabled,
  onEdit,
  onKeyDown,
  onSave,
  onCancel
}: TargetKeySettingProps) => {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
        <Keyboard className="w-3.5 h-3.5" />
        Key
      </label>
      {!isEditing ? (
        <button
          onClick={onEdit}
          disabled={disabled}
          className="w-full py-1.5 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-left text-xs text-slate-200 transition-colors"
        >
          {targetKey ? formatHotkey(targetKey) : "None"}
        </button>
      ) : (
        <div className="space-y-1.5">
          <input
            type="text"
            readOnly
            value={pendingKey.length > 0 ? pendingKey.join(" + ") : "Press keys..."}
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
