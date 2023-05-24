const { writeFileSync } = require('fs');
const { join } = require('path');
const { zodToTs, printNode } = require('zod-to-ts')
const { configSchema } = require('./configSchema');

const { node } = zodToTs(configSchema, 'Config')

writeFileSync(join(__dirname, "..", "api", "interfaces", "Config.ts"), `export default interface Config ${printNode(node)}`);