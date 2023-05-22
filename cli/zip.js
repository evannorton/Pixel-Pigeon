var archiver = require('archiver-promise');

var archive = archiver('game.zip',{
  store: true
});

archive.directory('node_modules/pigeon-mode-game-library/out');

archive.finalize();