(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var level;

    LAGMAN.playState = {
        init: function (levelId) {
            this.levelId = levelId;
        },
        preload: function (game) {
            game.load.spritesheet('player', '/assets/images/hero.png', 20, 40);
            game.load.spritesheet('enemy', '/assets/images/enemy.png', 20, 40);
            game.load.tilemap('level11', '/assets/levels/level11.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('level12', '/assets/levels/level12.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('level13', '/assets/levels/level13.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('level14', '/assets/levels/level14.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', '/assets/images/basic_tileset.png');
            game.load.spritesheet('bullet', '/assets/images/bullet.png', 8, 4);
            game.load.audio('main_music', '/assets/music/maintheme.ogg');
            game.load.audio('sec_music', '/assets/music/lagman2.ogg');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.audio('enemydie', '/assets/sound/enemydie.wav');
            game.load.audio('jump', '/assets/sound/jump.wav');
            game.load.audio('playerdie', '/assets/sound/playerdie.wav');
        },
        create: function (game) {
            var pingTxt, levelTxt, timeTxt;

            //Adding physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //Load first level
            level = new LAGMAN.Level(game, this.levelId);

            pingTxt = game.add.bitmapText(5, 5, 'carrier_command', 'Ping: ' + level.lagTime + ' ms',11);
            levelTxt = game.add.bitmapText(530, 5, 'carrier_command', LAGMAN.Level.LEVELS[LAGMAN.Level.currentLevelIdx].name,11);
            timeTxt = game.add.bitmapText(680, 5, 'carrier_command','Time: 99',11);

            game.time.events.loop(5000, function () {
                var lagTime = level.getCurrentLag(game);
                pingTxt.text = "Ping: " + lagTime + " ms";
            });
        },
        update: function (game) {
            // Update current level
            level.update(game);
        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
