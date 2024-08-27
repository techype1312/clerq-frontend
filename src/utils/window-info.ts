import { BrowserInfo } from "./browser-info/browser.info";

const breakPoints = [
  { width: 600, size: "xs" },
  { width: 960, size: "sm" },
  { width: 1280, size: "md" },
  { width: 1920, size: "lg" },
];

const browserInfo = new BrowserInfo();
const sizeHandlers: ((data?: any) => void)[] = [];
const virtualKeyboardHandlers: ((data?: any) => void)[] = [];
const onCloseHandlers: ((data?: any) => void)[] = [];

const windowInfo = {
  ...browserInfo.giveMeAllYouGot(),
  currentSize: getSize(),
  isVirtualKeyBoardActive: false,
  isTouchDevice: "ontouchstart" in window || (window.navigator as any).msMaxTouchPoints,
  focused: true,
};

window.onblur = () => {
  windowInfo.focused = false;
};

window.onfocus = () => {
  windowInfo.focused = true;
};

window.addEventListener("resize", runHandlers);
window.addEventListener("orientationchange", runHandlers);

window.onbeforeunload = () => {
  onCloseHandlers.forEach((handler) => handler());
};

function runHandlers() {
  const newKeyBoardDetection = isVirtualKeyBoardActive();
  if (newKeyBoardDetection !== windowInfo.isVirtualKeyBoardActive) {
    windowInfo.isVirtualKeyBoardActive = newKeyBoardDetection;
    virtualKeyboardHandlers.forEach((handler) => handler && handler(windowInfo));
  }

  const size = getSize();
  if (size !== windowInfo.currentSize) {
    windowInfo.currentSize = size;
    sizeHandlers.forEach((handler) => handler && handler(windowInfo));
  }
}

function isVirtualKeyBoardActive() {
  return (
    windowInfo.isMobile &&
    window.screen.orientation.angle === 0 &&
    window.screen.availHeight * 0.7 > window.innerHeight
  );
}

function getSize() {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const width = iOS ? window.screen.width : window.innerWidth;
  const winSize = breakPoints.find((breakpoint) => width < breakpoint.width) || { size: "xl" };
  return winSize.size;
}

export function registerSizeChangeHandler(handler: (data?: any) => void) {
  if (!handler) return;
  handler(windowInfo);
  sizeHandlers.push(handler);
}

export function registerVirtualKeyboardHandler(handler: (data?: any) => void) {
  if (!handler) return;
  handler(windowInfo);
  virtualKeyboardHandlers.push(handler);
}

export function deRegisterVirtualKeyboardHandler(handler: (data?: any) => void) {
  const index = virtualKeyboardHandlers.indexOf(handler);
  if (index !== -1) virtualKeyboardHandlers.splice(index, 1);
}

export function deRegisterSizeChangeHandler(handler: (data?: any) => void) {
  const index = sizeHandlers.indexOf(handler);
  if (index !== -1) sizeHandlers.splice(index, 1);
}

export function onWindowClose(fn: (data?: any) => void) {
  onCloseHandlers.push(fn);
}

export default windowInfo;
