import { Newgrounds } from "./types/Newgrounds";

export const newgrounds: Newgrounds | null = (
  window as unknown as {
    newgrounds: Newgrounds | null;
  }
).newgrounds;
delete (
  window as {
    newgrounds?: Newgrounds | null;
  }
).newgrounds;
