export type MouseButton = "left" | "right" | "middle";
export type ClickType = "single" | "double";

export interface AppSettings {
  interval: number;
  mouseButton: MouseButton;
  clickType: ClickType;
  hotkey: string;
  clickCount: number;
}

export type ClickerSettings = Pick<AppSettings, "interval" | "mouseButton" | "clickType" | "clickCount">;

export const INTERVAL_MIN = 10;
export const INTERVAL_MAX = 5000;
export const CLICK_COUNT_MIN = 0;
export const CLICK_COUNT_MAX = 1000;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  interval: 1000,
  mouseButton: "left",
  clickType: "single",
  hotkey: "",
  clickCount: 0
};

export const DEFAULT_CLICKER_SETTINGS: ClickerSettings = {
  interval: DEFAULT_APP_SETTINGS.interval,
  mouseButton: DEFAULT_APP_SETTINGS.mouseButton,
  clickType: DEFAULT_APP_SETTINGS.clickType,
  clickCount: DEFAULT_APP_SETTINGS.clickCount
};

export function clampInterval(value: number): number {
  return clampNumber(value, INTERVAL_MIN, INTERVAL_MAX);
}

export function clampClickCount(value: number): number {
  return clampNumber(value, CLICK_COUNT_MIN, CLICK_COUNT_MAX);
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function normalizeAppSettings(settings: Partial<AppSettings>): AppSettings {
  const merged: AppSettings = {
    ...DEFAULT_APP_SETTINGS,
    ...settings
  };

  return {
    interval: clampInterval(merged.interval),
    mouseButton: merged.mouseButton,
    clickType: merged.clickType,
    hotkey: typeof merged.hotkey === "string" ? merged.hotkey : DEFAULT_APP_SETTINGS.hotkey,
    clickCount: clampClickCount(merged.clickCount)
  };
}

export function mergeAndSanitizeSettings(current: AppSettings, updates: Partial<AppSettings>): AppSettings {
  return normalizeAppSettings({
    ...current,
    ...updates
  });
}
