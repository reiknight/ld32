(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    function createButton (game, x, y, downCallback) {
        var button;

        button = game.add.sprite(x, y, 'button');
        button.inputEnabled = true;
        if (downCallback) {
            button.events.onInputDown.add(downCallback);
        }
        button.events.onInputOver.add(function () {
            button.frame = 1;
        });
        button.events.onInputOut.add(function () {
            button.frame = 0;
        });
    }

    var level;

    LAGMAN.howToPlayState = {
        init: function () {

        },
        preload: function (game) {
            game.load.image('background', '/assets/images/how_to_screen.png');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.spritesheet('button', '/assets/images/button.png', 270, 80);
            game.load.spritesheet('player', '/assets/images/hero.png', 20, 40);
            game.load.spritesheet('enemy', '/assets/images/enemy.png', 20, 40);
            game.load.tilemap('howto', '/assets/levels/howto.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', '/assets/images/basic_tileset.png');
            game.load.spritesheet('bullet', '/assets/images/bullet.png', 8, 4);
            game.load.audio('main_music', '/assets/music/maintheme.ogg');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.audio('enemydie', '/assets/sound/enemydie.wav');
            game.load.audio('playerdie', '/assets/sound/playerdie.wav');
            game.load.audio('jump', '/assets/sound/jump.wav');
        },
        create: function (game) {
            var instr;

            game.add.image(0, 0, 'background');

            createButton(game, 480, 500, function () {
                game.state.start('start');
            });
            game.add.bitmapText(500, 530, 'carrier_command', 'Go to title', 18);

            instr = game.add.bitmapText(15, 50, 'carrier_command', 'Control Lagman using the arrow keys!', 14);
            instr.tint = 0x223344;
            instr = game.add.bitmapText(15, 260, 'carrier_command', 'Collide with your enemies to explode them', 14);
            instr.tint = 0x223344;
            instr = game.add.bitmapText(15, 290, 'carrier_command', 'from the inside! Avoid the bullets!', 14);
            instr.tint = 0x223344;
            instr = game.add.bitmapText(15, 500, 'carrier_command', 'Easy? Try it now with', 14);
            instr.tint = 0x223344;
            instr = game.add.bitmapText(15, 530, 'carrier_command', 'high ping...', 14);
            instr.tint = 0x223344;

            level = new LAGMAN.Level(game, 'howto');

            game.time.events.add(10000, function () {
                game.state.start('how_to_play', true, false);
            });
        },
        update: function (game) {
            level.update(game);
        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
