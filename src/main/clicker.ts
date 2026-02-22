import { NSEvent, NSScreen } from "objcjs-types/AppKit";
import {
  CGEventCreateMouseEvent,
  CGEventPost,
  CGEventSetType,
  CGEventTapLocation,
  CGEventType,
  CGMouseButton
} from "objcjs-extra/CoreGraphics";
import { CFRelease } from "objcjs-extra/CoreFoundation";
import { systemPreferences } from "electron";

function getMousePosition() {
  // Get the current mouse location using NSEvent (Cocoa coordinates, y=0 at bottom)
  const mouseLocation = NSEvent.mouseLocation();

  // Convert to CoreGraphics coordinates (y=0 at top)
  const mainScreen = NSScreen.mainScreen();
  if (!mainScreen) throw new Error("No main screen found");
  const screenHeight = mainScreen.frame().size.height;
  const currentPos = {
    x: mouseLocation.x,
    y: screenHeight - mouseLocation.y
  };

  return currentPos;
}

function canClick() {
  const isTrusted = systemPreferences.isTrustedAccessibilityClient(true);
  return isTrusted;
}

export function click() {
  if (!canClick()) {
    console.log("Can not click");
    return;
  }

  // Get current position
  const currentPos = getMousePosition();

  // Create a proper mouse event and reuse for both down/up
  const clickEvent = CGEventCreateMouseEvent(null, CGEventType.LeftMouseDown, currentPos, CGMouseButton.Left);
  CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);

  // Change to mouse up and repost
  CGEventSetType(clickEvent, CGEventType.LeftMouseUp);
  CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);

  CFRelease(clickEvent);
}

// setInterval(() => {
//   const start = performance.now();
//   click();
//   const end = performance.now();
//   console.log(`Time taken: ${end - start} milliseconds`);
// }, 1000);
