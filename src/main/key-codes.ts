import { CGEventFlags } from "objcjs-extra/CoreGraphics";

const KEY_CODES: Record<string, number> = {
  A: 0,
  S: 1,
  D: 2,
  F: 3,
  H: 4,
  G: 5,
  Z: 6,
  X: 7,
  C: 8,
  V: 9,
  B: 11,
  Q: 12,
  W: 13,
  E: 14,
  R: 15,
  Y: 16,
  T: 17,
  "1": 18,
  "2": 19,
  "3": 20,
  "4": 21,
  "6": 22,
  "5": 23,
  "=": 24,
  "9": 25,
  "7": 26,
  "-": 27,
  "8": 28,
  "0": 29,
  "]": 30,
  O: 31,
  U: 32,
  "[": 33,
  I: 34,
  P: 35,
  Return: 36,
  L: 37,
  J: 38,
  "'": 39,
  K: 40,
  ";": 41,
  "\\": 42,
  ",": 43,
  "/": 44,
  N: 45,
  M: 46,
  ".": 47,
  Tab: 48,
  Space: 49,
  "`": 50,
  Backspace: 51,
  Delete: 51,
  Escape: 53,
  Esc: 53,
  Capslock: 57,
  F1: 122,
  F2: 120,
  F3: 99,
  F4: 118,
  F5: 96,
  F6: 97,
  F7: 98,
  F8: 100,
  F9: 101,
  F10: 109,
  F11: 103,
  F12: 111,
  Up: 126,
  Down: 125,
  Left: 123,
  Right: 124
};

const MODIFIER_FLAGS: Record<string, number> = {
  Shift: CGEventFlags.Shift,
  Alt: CGEventFlags.Alternate,
  Option: CGEventFlags.Alternate,
  Control: CGEventFlags.Control,
  Command: CGEventFlags.Command,
  CommandOrControl: CGEventFlags.Command
};

export interface ParsedKeyInput {
  keyCode: number;
  flags: number;
}

export function parseKeyAccelerator(accelerator: string): ParsedKeyInput | null {
  const segments = accelerator
    .split("+")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  let flags = 0;
  let keyCode: number | null = null;

  for (const segment of segments) {
    const modifierFlag = MODIFIER_FLAGS[segment];
    if (modifierFlag !== undefined) {
      flags |= modifierFlag;
      continue;
    }

    const code = KEY_CODES[segment];
    if (code === undefined) {
      return null;
    }

    keyCode = code;
  }

  if (keyCode === null) {
    return null;
  }

  return { keyCode, flags };
}
