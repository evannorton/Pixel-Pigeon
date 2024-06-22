const { writeFileSync } = require('fs');
const { join, resolve } = require("path");

writeFileSync(join(__dirname, "..", "game-tsconfig.json"), JSON.stringify({
  compilerOptions: {
    incremental: false,
    target: "ES2015",
    module: "commonjs",
    outDir: "lib",
    strict: true,
    noUncheckedIndexedAccess: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    moduleResolution: "node",
    esModuleInterop: true,
    useUnknownInCatchVariables: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true
  },
  include: [
    join(resolve())
  ]
}))

