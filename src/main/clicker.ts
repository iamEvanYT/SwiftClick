import { NSEvent, NSScreen } from "objcjs-types/AppKit";
import {
  CGEventCreateMouseEvent,
  CGEventPost,
  CGEventSetType,
  CGEventSetIntegerValueField,
  CGEventField,
  CGEventTapLocation,
  CGEventType,
  CGMouseButton
} from "objcjs-extra/CoreGraphics";
import { CFRelease } from "objcjs-extra/CoreFoundation";
import { systemPreferences } from "electron";
import { MouseButton } from "../common/settings";

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

export function click(mouseButton: MouseButton, isDoubleClick: boolean) {
  if (!canClick()) {
    console.log("Can not click");
    return;
  }

  // Make the events
  let downEvent: CGEventType = CGEventType.LeftMouseDown;
  let upEvent: CGEventType = CGEventType.LeftMouseUp;
  let button: CGMouseButton = CGMouseButton.Left;

  if (mouseButton === "right") {
    downEvent = CGEventType.RightMouseDown;
    upEvent = CGEventType.RightMouseUp;
    button = CGMouseButton.Right;
  } else if (mouseButton === "middle") {
    downEvent = CGEventType.OtherMouseDown;
    upEvent = CGEventType.OtherMouseUp;
    button = CGMouseButton.Center;
  }

  // Get current position
  const currentPos = getMousePosition();

  // Create a proper mouse event and reuse for both down/up
  const clickEvent = CGEventCreateMouseEvent(null, downEvent, currentPos, button);
  CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);

  // Change to mouse up and repost
  CGEventSetType(clickEvent, upEvent);
  CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);

  if (isDoubleClick) {
    // Second click with click state 2 to register as a double-click
    CGEventSetType(clickEvent, downEvent);
    CGEventSetIntegerValueField(clickEvent, CGEventField.MouseEventClickState, 2);
    CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);

    CGEventSetType(clickEvent, upEvent);
    CGEventPost(CGEventTapLocation.SessionEventTap, clickEvent);
  }

  CFRelease(clickEvent);
}

// setInterval(() => {
//   const start = performance.now();
//   click();
//   const end = performance.now();
//   console.log(`Time taken: ${end - start} milliseconds`);
// }, 1000);
