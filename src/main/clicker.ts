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

function getCocoaMaxY(): number {
  const screens = NSScreen.screens();
  let maxY = 0;
  for (let i = 0; i < screens.count(); i++) {
    const frame = (screens.objectAtIndex$(i) as InstanceType<typeof NSScreen>).frame();
    const screenMaxY = frame.origin.y + frame.size.height;
    if (screenMaxY > maxY) maxY = screenMaxY;
  }
  return maxY;
}

function getMousePosition(): { x: number; y: number } {
  const mouseLocation = NSEvent.mouseLocation();
  return {
    x: mouseLocation.x,
    y: getCocoaMaxY() - mouseLocation.y
  };
}

function canClick(): boolean {
  const isTrusted = systemPreferences.isTrustedAccessibilityClient(true);
  return isTrusted;
}

export function click(mouseButton: MouseButton, isDoubleClick: boolean): void {
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
