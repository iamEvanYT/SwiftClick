import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

interface EditableSliderProps {
  icon?: ReactNode;
  label: string;
  value: number;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
  parseInput?: (value: string) => number | null;
}

const defaultFormat = (value: number): string => value.toString();

const defaultParse = (value: string): number | null => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const EditableSlider = ({
  icon,
  label,
  value,
  disabled,
  min,
  max,
  step,
  onChange,
  formatDisplay = defaultFormat,
  parseInput = defaultParse
}: EditableSliderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(formatDisplay(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(formatDisplay(value));
    }
  }, [formatDisplay, isEditing, value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const clamp = (nextValue: number): number => {
    return Math.min(Math.max(nextValue, min), max);
  };

  const handleSave = () => {
    const parsed = parseInput(editValue);
    if (parsed === null) {
      setEditValue(formatDisplay(value));
      setIsEditing(false);
      return;
    }

    const clamped = clamp(parsed);
    onChange(clamped);
    setEditValue(formatDisplay(clamped));
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      setEditValue(formatDisplay(value));
      setIsEditing(false);
    }
  };

  const handleValueClick = () => {
    if (disabled) return;
    setEditValue(formatDisplay(value));
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          {icon}
          {label}
        </label>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="text-xs text-blue-400 font-semibold bg-slate-700 px-1 py-0.5 rounded border border-blue-500 outline-none w-16 text-right"
          />
        ) : (
          <span
            onClick={handleValueClick}
            className={`text-xs text-blue-400 font-semibold ${!disabled ? "cursor-pointer hover:text-blue-300" : "cursor-not-allowed opacity-50"}`}
          >
            {formatDisplay(value)}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value)}
        onChange={(event) => onChange(clamp(parseInt(event.target.value, 10)))}
        disabled={disabled}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-500"
      />
    </div>
  );
};
