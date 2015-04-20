(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var ENEMY_VELOCITY  = 30;

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


    function checkEnemyMovement(enemy, tile) {
        if(tile.faceLeft && tile.faceRight) {
            enemy.body.velocity.x = 0;
        } else if(tile.faceLeft && tile.left + tile.width/10 > enemy.left) {
            enemy.body.velocity.x = ENEMY_VELOCITY + enemy.body.velocity.xIncrement;
            enemy.movingRight = true;
            enemy.frame = 2;
        } else if(tile.faceRight && tile.right - tile.width/10 < enemy.right) {
            enemy.body.velocity.x = -ENEMY_VELOCITY - enemy.body.velocity.xIncrement;
            enemy.movingRight = false;
            enemy.frame = 1;
        }
    }

    var level,
        player,
        enemies,
        bullets,
        layerFg;

    LAGMAN.howToPlayState = {
        init: function () {

        },
        preload: function (game) {
            // game.load.image('background', '/assets/images/start_screen.png');
            // game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            // game.load.spritesheet('button', '/assets/images/button.png', 270, 80);
            game.load.spritesheet('player', '/assets/images/hero.png', 20, 40);
            game.load.spritesheet('enemy', '/assets/images/enemy.png', 20, 40);
            game.load.tilemap('howto', '/assets/levels/howto.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', '/assets/images/basic_tileset.png');
            game.load.spritesheet('bullet', '/assets/images/bullet.png', 8, 4);
            game.load.audio('main_music', '/assets/music/maintheme.ogg');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
        },
        create: function (game) {
            // game.add.image(0, 0, 'background');
            //
            // createButton(game, 400, 250, function () {
            //     game.state.start('start');
            // });
            // game.add.bitmapText(430, 280, 'carrier_command', 'Go to title', 18);
            level = LAGMAN.level.load(game, 'howto');
            player = level.player;
            enemies = level.enemies;
            bullets = level.bullets;
            layerFg = level.layerFg;
        },
        update: function (game) {
            game.physics.arcade.collide(enemies, layerFg, checkEnemyMovement);
        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
