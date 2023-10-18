var archiver = require("archiver-promise");

var archive = archiver('game.zip',{
  store: true
});

archive.directory('node_modules/pixel-pigeon/out', false);

archive.finalize();