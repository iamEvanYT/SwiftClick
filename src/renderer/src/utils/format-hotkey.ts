const SYMBOL_MAP: Record<string, string> = {
  CommandOrControl: "⌘/Ctrl",
  Command: "⌘",
  Control: "Ctrl",
  Shift: "⇧",
  Alt: "⌥",
  Option: "⌥"
};

export const formatHotkey = (hotkey: string): string => {
  if (!hotkey) return "None";

  return hotkey
    .split("+")
    .map((segment) => {
      const trimmed = segment.trim();
      if (trimmed.length === 1) return trimmed.toUpperCase();
      return SYMBOL_MAP[trimmed] ?? trimmed;
    })
    .join(" + ");
};
