const { writeFileSync } = require('fs');
const { join } = require('path');
const { z } = require('zod');
const { zodToTs, printNode } = require('zod-to-ts')

const configSchema = z.object({
	width: z.number(),
  height: z.number(),
});

const { node } = zodToTs(configSchema, 'Config')

writeFileSync(join(__dirname, "..", "api", "interfaces", "Config.ts"), `export default interface Config ${printNode(node)}`);