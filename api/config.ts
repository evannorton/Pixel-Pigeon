import Config from "./interfaces/Config";

if (!document.body.dataset.config) {
  throw new Error("No config found in template.");
}

const config: Config = JSON.parse(document.body.dataset.config) as Config;

export default config;
