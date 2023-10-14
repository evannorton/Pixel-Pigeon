export enum InputEventTriggerType {
  Blur = "blur",
  Keydown = "keydown",
  Keyup = "keyup",
  Mousedown = "mousedown",
}
export interface InputEventTrigger {
  event: Event;
  type: InputEventTriggerType;
}
export interface BlurInputEventTrigger extends InputEventTrigger {
  event: FocusEvent;
  type: InputEventTriggerType.Blur;
}
export interface MousedownInputEventTrigger extends InputEventTrigger {
  event: MouseEvent;
  type: InputEventTriggerType.Mousedown;
}
export interface KeydownInputEventTrigger extends InputEventTrigger {
  event: KeyboardEvent;
  type: InputEventTriggerType.Keydown;
}
export interface KeyupInputEventTrigger extends InputEventTrigger {
  event: KeyboardEvent;
  type: InputEventTriggerType.Keyup;
}
