import Config from "./interfaces/Config";

if (typeof document.body.dataset.config === "undefined") {
  throw new Error("No config found in template.");
}
const config: Config = JSON.parse(document.body.dataset.config) as Config;

export default config;
