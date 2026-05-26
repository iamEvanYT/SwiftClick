import { useState, useEffect, useCallback, useMemo } from "react";
import type { AppSettings } from "../types";

export const useAutoclicker = () => {
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    interval: 1000,
    clickerMode: "mouse",
    mouseButton: "left",
    clickType: "single",
    targetKey: "Space",
    hotkey: "",
    clickCount: 0
  });
  const [clickCount, setClickCount] = useState(0);

  const loadInitialState = useCallback(async () => {
    try {
      const [loadedSettings, status, currentCount] = await Promise.all([
        window.api.autoclicker.getSettings(),
        window.api.autoclicker.getStatus(),
        window.api.autoclicker.getCurrentClickCount()
      ]);

      setSettings(loadedSettings);
      setIsActive(status);
      setClickCount(status ? currentCount : 0);
    } catch (error) {
      console.error("Failed to load autoclicker state:", error);
    }
  }, []);

  useEffect(() => {
    void loadInitialState();

    const unsubscribeStatus = window.api.autoclicker.onStatusChanged((active) => {
      setIsActive(active);
      if (!active) {
        setClickCount(0);
      }
    });

    const unsubscribeCount = window.api.autoclicker.onClickCountChanged((count) => {
      setClickCount(count);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeCount();
    };
  }, [loadInitialState]);

  const handleStart = useCallback(async (): Promise<void> => {
    try {
      const success = await window.api.autoclicker.start();
      if (success) {
        setIsActive(true);
      }
    } catch (error) {
      console.error("Failed to start autoclicker:", error);
    }
  }, []);

  const handleStop = useCallback(async (): Promise<void> => {
    try {
      const success = await window.api.autoclicker.stop();
      if (success) {
        setIsActive(false);
        setClickCount(0);
      }
    } catch (error) {
      console.error("Failed to stop autoclicker:", error);
    }
  }, []);

  const handleSettingChange = useCallback(
    async (key: keyof AppSettings, value: string | number): Promise<void> => {
      if (isActive && key !== "hotkey") return; // Don't allow changes while active (except hotkey)

      let previousSettings: AppSettings | null = null;
      setSettings((current) => {
        previousSettings = current;
        return { ...current, [key]: value };
      });

      try {
        const updatedSettings = await window.api.autoclicker.updateSettings({ [key]: value });
        setSettings(updatedSettings);
      } catch (error) {
        console.error("Failed to update settings:", error);
        if (previousSettings) {
          setSettings(previousSettings);
        }
      }
    },
    [isActive]
  );

  const progress = useMemo(() => {
    if (!isActive || settings.clickCount === 0) return 0;
    const ratio = (clickCount / settings.clickCount) * 100;
    return Math.min(100, Math.max(0, ratio));
  }, [clickCount, isActive, settings.clickCount]);

  return {
    isActive,
    settings,
    clickCount,
    handleStart,
    handleStop,
    handleSettingChange,
    progress
  };
};
