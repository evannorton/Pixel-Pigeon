var archiver = require("archiver-promise");

var archive = archiver('game.zip',{
  store: true
});

archive.directory('out', false);

archive.finalize();