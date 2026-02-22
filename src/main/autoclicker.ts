import type { ClickerSettings } from "../common/settings";
import { DEFAULT_CLICKER_SETTINGS, clampClickCount, clampInterval } from "../common/settings";
import { click } from "./clicker";

class Clicker {
  private interval: NodeJS.Timeout | null = null;
  private settings: ClickerSettings = { ...DEFAULT_CLICKER_SETTINGS };
  private currentClickCount: number = 0;
  private onStopCallback?: () => void;
  private onTickCallback?: (count: number) => void;

  public get isActive(): boolean {
    return this.interval !== null;
  }

  public getCurrentClickCount(): number {
    return this.currentClickCount;
  }

  public getSettings(): ClickerSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<ClickerSettings>): void {
    this.settings = {
      interval: clampInterval(newSettings.interval ?? this.settings.interval),
      mouseButton: newSettings.mouseButton ?? this.settings.mouseButton,
      clickType: newSettings.clickType ?? this.settings.clickType,
      clickCount: clampClickCount(newSettings.clickCount ?? this.settings.clickCount)
    };
  }

  public setOnStopCallback(callback: () => void): void {
    this.onStopCallback = callback;
  }

  public setOnTickCallback(callback: (count: number) => void): void {
    this.onTickCallback = callback;
  }

  public start(): boolean {
    if (this.isActive) {
      return false;
    }

    this.currentClickCount = 0;
    this.onTickCallback?.(this.currentClickCount);

    this.interval = setInterval(() => {
      click();
      // robotjs.mouseClick(this.settings.mouseButton, this.settings.clickType === "double");
      this.currentClickCount++;
      this.onTickCallback?.(this.currentClickCount);

      // Check if we've reached the click limit (if set)
      if (this.settings.clickCount > 0 && this.currentClickCount >= this.settings.clickCount) {
        this.stop();
        if (this.onStopCallback) {
          this.onStopCallback();
        }
      }
    }, this.settings.interval);

    return true;
  }

  public stop(): boolean {
    if (!this.isActive) {
      return false;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.onTickCallback?.(this.currentClickCount);

    return true;
  }
}

export const clicker = new Clicker();
