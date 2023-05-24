const { z } = require('zod');

module.exports.configSchema = z.object({
	width: z.number(),
  height: z.number(),
});