import { useState } from "react";
import type { AppSettings } from "../types";
import { captureKeyAccelerator } from "../utils/capture-key-accelerator";

export const useHotkeyEditor = (onSave: (key: keyof AppSettings, value: string) => Promise<void>) => {
  const [isEditingHotkey, setIsEditingHotkey] = useState(false);
  const [pendingHotkey, setPendingHotkey] = useState<string[]>([]);
  const [canSaveHotkey, setCanSaveHotkey] = useState(false);

  const handleHotkeyEdit = (): void => {
    setIsEditingHotkey(true);
    setPendingHotkey([]);
    setCanSaveHotkey(false);
  };

  const handleHotkeyKeyDown = (e: React.KeyboardEvent): void => {
    e.preventDefault();

    const { segments, hasMainKey } = captureKeyAccelerator(e);
    setPendingHotkey(segments);
    setCanSaveHotkey(hasMainKey);
  };

  const handleHotkeySave = async (): Promise<void> => {
    if (!canSaveHotkey || pendingHotkey.length < 1) {
      return;
    }

    // Convert to Electron accelerator format
    const accelerator = pendingHotkey
      .map((key) => {
        if (key === "Command") return "CommandOrControl";
        return key;
      })
      .join("+");

    await onSave("hotkey", accelerator);
    setIsEditingHotkey(false);
    setPendingHotkey([]);
    setCanSaveHotkey(false);
  };

  const handleHotkeyCancel = (): void => {
    setIsEditingHotkey(false);
    setPendingHotkey([]);
    setCanSaveHotkey(false);
  };

  const handleHotkeyClear = async (): Promise<void> => {
    await onSave("hotkey", "");
    setIsEditingHotkey(false);
    setPendingHotkey([]);
    setCanSaveHotkey(false);
  };

  return {
    isEditingHotkey,
    pendingHotkey,
    canSaveHotkey,
    handleHotkeyEdit,
    handleHotkeyKeyDown,
    handleHotkeySave,
    handleHotkeyCancel,
    handleHotkeyClear
  };
};
