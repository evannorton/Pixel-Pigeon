const { ESLint } = require("eslint");
const { resolve, join } = require("path");

const eslint = new ESLint({
  cwd: resolve(join()),
  resolvePluginsRelativeTo: join(__dirname, ".."),
  fix: true
});

eslint.lintFiles("./src").then((results) => {
  ESLint.outputFixes(results).then(() => {
    for (const result of results) {
      for (const message of result.messages) {
        console.error(`${result.filePath}:${message.line}:${message.column} ${message.message} (${message.ruleId})`);
      }
    }
  });
});