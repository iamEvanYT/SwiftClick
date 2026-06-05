import { app, shell, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { clicker } from "./autoclicker";
import { settingsManager } from "./settings";
import type { AppSettings } from "../common/settings";

let mainWindow: BrowserWindow | null = null;
let registeredHotkey: string | null = null;

const broadcastStatus = (isActive: boolean): void => {
  if (mainWindow) {
    mainWindow.webContents.send("autoclicker:status-changed", isActive);
  }
};

const broadcastClickCount = (count: number): void => {
  if (mainWindow) {
    mainWindow.webContents.send("autoclicker:click-count", count);
  }
};

const applyClickerSettings = (settings: AppSettings): void => {
  clicker.updateSettings({
    interval: settings.interval,
    clickerMode: settings.clickerMode,
    mouseButton: settings.mouseButton,
    clickType: settings.clickType,
    targetKey: settings.targetKey,
    clickCount: settings.clickCount
  });
};

const toggleClicker = (): void => {
  if (clicker.isActive) {
    const stopped = clicker.stop();
    if (stopped) {
      broadcastStatus(false);
      broadcastClickCount(clicker.getCurrentClickCount());
    }
  } else {
    const started = clicker.start();
    if (started) {
      broadcastStatus(true);
    }
  }
};

clicker.setOnTickCallback((count) => {
  broadcastClickCount(count);
});

clicker.setOnStopCallback(() => {
  broadcastStatus(false);
  broadcastClickCount(clicker.getCurrentClickCount());
});

function registerGlobalShortcut(hotkey: string): boolean {
  const accelerator = hotkey.trim();

  if (!accelerator) {
    if (registeredHotkey) {
      globalShortcut.unregister(registeredHotkey);
      registeredHotkey = null;
    }
    return true;
  }

  try {
    if (registeredHotkey === accelerator && globalShortcut.isRegistered(accelerator)) {
      return true;
    }

    globalShortcut.register(accelerator, toggleClicker);

    if (globalShortcut.isRegistered(accelerator)) {
      if (registeredHotkey && registeredHotkey !== accelerator) {
        if (globalShortcut.isRegistered(registeredHotkey)) {
          globalShortcut.unregister(registeredHotkey);
        }
      }
      registeredHotkey = accelerator;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to register hotkey:", error);
    return false;
  }
}

async function createWindow(): Promise<void> {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    resizable: false,
    width: 400,
    height: 600,
    titleBarStyle: "hiddenInset",
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Load and apply saved settings
  const savedSettings = await settingsManager.getSettings();
  applyClickerSettings(savedSettings);

  // Register the hotkey
  registerGlobalShortcut(savedSettings.hotkey);

  broadcastStatus(clicker.isActive);
  broadcastClickCount(clicker.getCurrentClickCount());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  // Autoclicker IPC handlers
  ipcMain.handle("autoclicker:start", async () => {
    const started = clicker.start();
    if (started) {
      broadcastStatus(true);
    }
    return started;
  });

  ipcMain.handle("autoclicker:stop", async () => {
    const stopped = clicker.stop();
    if (stopped) {
      broadcastStatus(false);
      broadcastClickCount(clicker.getCurrentClickCount());
    }
    return stopped;
  });

  ipcMain.handle("autoclicker:getStatus", () => {
    return clicker.isActive;
  });

  ipcMain.handle("autoclicker:getCurrentClickCount", () => {
    return clicker.getCurrentClickCount();
  });

  ipcMain.handle("autoclicker:getSettings", async () => {
    return settingsManager.getSettings();
  });

  ipcMain.handle("autoclicker:updateSettings", async (_event, settings: Partial<AppSettings>) => {
    // Update settings in both the settings manager and clicker
    const newSettings = await settingsManager.updateSettings(settings);

    applyClickerSettings(newSettings);

    // If hotkey was changed, re-register it
    if (settings.hotkey !== undefined) {
      if (!registerGlobalShortcut(newSettings.hotkey)) {
        console.warn("Failed to register new hotkey:", newSettings.hotkey);
      }
    }

    return newSettings;
  });

  await settingsManager.initialize();
  await createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
  registeredHotkey = null;

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  // Stop the clicker
  clicker.stop();

  // Unregister all shortcuts
  globalShortcut.unregisterAll();
  registeredHotkey = null;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
