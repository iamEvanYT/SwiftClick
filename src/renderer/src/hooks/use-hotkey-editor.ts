import { useState } from "react";
import type { AppSettings } from "../types";

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

    const modifiers = new Set<string>();
    const nonModifiers: string[] = [];

    if (e.ctrlKey || e.metaKey) modifiers.add(e.metaKey ? "Command" : "Control");
    if (e.altKey) modifiers.add("Alt");
    if (e.shiftKey) modifiers.add("Shift");

    // Add the main key if it's not a modifier
    if (!["Control", "Meta", "Alt", "Shift"].includes(e.key)) {
      // Map browser key events to Electron accelerator format
      // Based on: https://raw.githubusercontent.com/electron/electron/refs/heads/main/docs/tutorial/keyboard-shortcuts.md
      const keyMap: { [key: string]: string } = {
        " ": "Space",
        ArrowUp: "Up",
        ArrowDown: "Down",
        ArrowLeft: "Left",
        ArrowRight: "Right",
        Enter: "Return",
        Escape: "Esc",
        CapsLock: "Capslock",
        NumLock: "Numlock",
        ScrollLock: "Scrolllock"
      };

      let keyValue: string;
      if (keyMap[e.key]) {
        keyValue = keyMap[e.key];
      } else if (e.key.length === 1) {
        // For single character keys (letters, numbers, symbols)
        // Letters should be uppercase, symbols stay as-is for Electron
        keyValue = e.key.match(/[a-z]/) ? e.key.toUpperCase() : e.key;
      } else {
        // Use the key as-is for other special keys (F1-F24, etc)
        keyValue = e.key;
      }

      nonModifiers.push(keyValue);
    }

    const nextHotkey = [...modifiers, ...nonModifiers];
    setPendingHotkey(nextHotkey);
    setCanSaveHotkey(nonModifiers.length >= 1);
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
