import type { ClickerSettings } from "../common/settings";
import { DEFAULT_CLICKER_SETTINGS, clampClickCount, clampInterval } from "../common/settings";
import { click, holdKey, pressKey, releaseKey } from "./clicker";

class Clicker {
  private interval: NodeJS.Timeout | null = null;
  private isKeyHeld = false;
  private settings: ClickerSettings = { ...DEFAULT_CLICKER_SETTINGS };
  private currentClickCount: number = 0;
  private onStopCallback?: () => void;
  private onTickCallback?: (count: number) => void;

  public get isActive(): boolean {
    return this.interval !== null || this.isKeyHeld;
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
      clickerMode: newSettings.clickerMode ?? this.settings.clickerMode,
      mouseButton: newSettings.mouseButton ?? this.settings.mouseButton,
      clickType: newSettings.clickType ?? this.settings.clickType,
      targetKey: newSettings.targetKey ?? this.settings.targetKey,
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

    if (this.settings.clickerMode === "key" && this.settings.clickType === "hold") {
      holdKey(this.settings.targetKey);
      this.isKeyHeld = true;
      return true;
    }

    this.interval = setInterval(() => {
      if (this.settings.clickerMode === "key") {
        pressKey(this.settings.targetKey);
      } else {
        click(this.settings.mouseButton, this.settings.clickType === "double");
      }

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

    if (this.isKeyHeld) {
      releaseKey(this.settings.targetKey);
      this.isKeyHeld = false;
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
