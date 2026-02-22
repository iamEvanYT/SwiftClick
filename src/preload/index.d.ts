import { ElectronAPI } from "@electron-toolkit/preload";
import type { AppSettings } from "../common/settings";

interface AutoclickerAPI {
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  getStatus: () => Promise<boolean>;
  getCurrentClickCount: () => Promise<number>;
  getSettings: () => Promise<AppSettings>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  onStatusChanged: (callback: (isActive: boolean) => void) => () => void;
  onClickCountChanged: (callback: (count: number) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      autoclicker: AutoclickerAPI;
    };
  }
}
