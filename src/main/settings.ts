import { app } from "electron";
import { join } from "path";
import { promises as fs } from "fs";
import type { AppSettings } from "../common/settings";
import { DEFAULT_APP_SETTINGS, mergeAndSanitizeSettings, normalizeAppSettings } from "../common/settings";

class SettingsManager {
  private settingsPath: string | null = null;
  private settings: AppSettings = { ...DEFAULT_APP_SETTINGS };
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      const userDataPath = app.getPath("userData");
      await fs.mkdir(userDataPath, { recursive: true });
      this.settingsPath = join(userDataPath, "settings.json");
      this.settings = await this.load();
      this.initialized = true;
    })();

    return this.initializationPromise;
  }

  private async load(): Promise<AppSettings> {
    if (!this.settingsPath) {
      return { ...DEFAULT_APP_SETTINGS };
    }

    try {
      const data = await fs.readFile(this.settingsPath, "utf-8");
      const parsed = JSON.parse(data);
      return normalizeAppSettings(parsed);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") {
        console.error("Failed to load settings:", error);
      }
      return { ...DEFAULT_APP_SETTINGS };
    }
  }

  private async save(): Promise<void> {
    if (!this.settingsPath) {
      return;
    }

    try {
      await fs.writeFile(this.settingsPath, JSON.stringify(this.settings, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  public async getSettings(): Promise<AppSettings> {
    await this.initialize();
    return { ...this.settings };
  }

  public async updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
    await this.initialize();
    this.settings = mergeAndSanitizeSettings(this.settings, newSettings);
    await this.save();
    return { ...this.settings };
  }
}

export const settingsManager = new SettingsManager();
