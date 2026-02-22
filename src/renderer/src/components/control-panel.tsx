import { Play, Square } from "lucide-react";
import type { AppSettings } from "../types";

interface ControlPanelProps {
  isActive: boolean;
  clickCount: number;
  settings: Pick<AppSettings, "clickCount">;
  progress: number;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
}

export const ControlPanel = ({ isActive, clickCount, settings, progress, onStart, onStop }: ControlPanelProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 shadow-2xl mb-3">
      {/* Status & Counter */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-slate-600"}`} />
          <span className="text-xs text-slate-300 font-medium">{isActive ? "Active" : "Inactive"}</span>
        </div>
        {isActive && (
          <div className="text-right">
            <div className="text-lg font-bold text-white">{clickCount}</div>
            <div className="text-[10px] text-slate-400">
              {settings.clickCount > 0 ? `/ ${settings.clickCount}` : "clicks"}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isActive && settings.clickCount > 0 && (
        <div className="mb-3">
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Start/Stop Button */}
      <button
        onClick={isActive ? onStop : onStart}
        className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 ${
          isActive
            ? "bg-red-500 hover:bg-red-600 active:scale-95"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-lg shadow-blue-500/25"
        }`}
      >
        {isActive ? (
          <>
            <Square className="w-4 h-4" />
            Stop Clicking
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Clicking
          </>
        )}
      </button>
    </div>
  );
};
