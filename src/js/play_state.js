(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var level;

    LAGMAN.playState = {
        init: function () {

        },
        preload: function (game) {
            game.load.spritesheet('player', '/assets/images/hero.png', 20, 40);
            game.load.spritesheet('enemy', '/assets/images/enemy.png', 20, 40);
            game.load.tilemap('level11', '/assets/levels/level11.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', '/assets/images/basic_tileset.png');
            game.load.spritesheet('bullet', '/assets/images/bullet.png', 8, 4);
            game.load.audio('main_music', '/assets/music/maintheme.ogg');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.audio('enemydie', '/assets/sound/enemydie.wav');
            game.load.audio('jump', '/assets/sound/jump.wav');
        },
        create: function (game) {
            //Adding physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //Load first level
            level = new LAGMAN.Level(game, 'level11');
            //
            // pingTxt = game.add.bitmapText(5, 5, 'carrier_command', 'Ping: ' + lagTime + ' ms',11);
            // levelTxt = game.add.bitmapText(530, 5, 'carrier_command','Level: 1-1',11);
            // timeTxt = game.add.bitmapText(680, 5, 'carrier_command','Time: 99',11);
            //
            // game.time.events.loop(5000, function () {
            //     lagTime = getCurrentLag(game);
            //     pingTxt.text = "Ping: " + lagTime + " ms";
            // });
        },
        update: function (game) {
            // Update current level
            level.update(game);
        }

    };

    exports.LAGMAN = LAGMAN;
}(window));
