import { Howl } from "howler";
import { defaultVolume } from "../constants/defaultVolume";

export const volumeTestHowl: Howl = new Howl({
  autoplay: false,
  loop: false,
  preload: true,
  src: ["mp3/volume-test.mp3"],
  volume: defaultVolume,
});
