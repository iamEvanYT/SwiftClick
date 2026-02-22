import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { AppSettings } from "../common/settings";

// Custom APIs for renderer
const api = {
  autoclicker: {
    start: () => ipcRenderer.invoke("autoclicker:start"),
    stop: () => ipcRenderer.invoke("autoclicker:stop"),
    getStatus: () => ipcRenderer.invoke("autoclicker:getStatus"),
    getCurrentClickCount: () => ipcRenderer.invoke("autoclicker:getCurrentClickCount"),
    getSettings: () => ipcRenderer.invoke("autoclicker:getSettings"),
    updateSettings: (settings: Partial<AppSettings>) => ipcRenderer.invoke("autoclicker:updateSettings", settings),
    onStatusChanged: (callback: (isActive: boolean) => void) => {
      const subscription = (_event: Electron.IpcRendererEvent, isActive: boolean) => callback(isActive);
      ipcRenderer.on("autoclicker:status-changed", subscription);
      return () => ipcRenderer.removeListener("autoclicker:status-changed", subscription);
    },
    onClickCountChanged: (callback: (count: number) => void) => {
      const subscription = (_event: Electron.IpcRendererEvent, count: number) => callback(count);
      ipcRenderer.on("autoclicker:click-count", subscription);
      return () => ipcRenderer.removeListener("autoclicker:click-count", subscription);
    }
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
