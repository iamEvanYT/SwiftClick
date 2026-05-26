export const captureKeyAccelerator = (
  e: React.KeyboardEvent
): { segments: string[]; hasMainKey: boolean } => {
  const modifiers = new Set<string>();
  const nonModifiers: string[] = [];

  if (e.ctrlKey || e.metaKey) modifiers.add(e.metaKey ? "Command" : "Control");
  if (e.altKey) modifiers.add("Alt");
  if (e.shiftKey) modifiers.add("Shift");

  if (!["Control", "Meta", "Alt", "Shift"].includes(e.key)) {
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
      keyValue = e.key.match(/[a-z]/) ? e.key.toUpperCase() : e.key;
    } else {
      keyValue = e.key;
    }

    nonModifiers.push(keyValue);
  }

  return {
    segments: [...modifiers, ...nonModifiers],
    hasMainKey: nonModifiers.length >= 1
  };
};
