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

    LAGMAN.startState = {
        init: function () {

        },
        preload: function (game) {
            game.load.image('background', '/assets/images/start_screen.png');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.spritesheet('button', '/assets/images/button.png', 270, 80);
        },
        create: function (game) {
            var titleL, titleGman;

            game.add.image(0, 0, 'background');

            titleL = game.add.bitmapText(30, 40, 'carrier_command', 'L', 100);
            titleL.tint = 0x223344;

            titleGman = game.add.bitmapText(300, 40, 'carrier_command', 'GMAN', 100);
            titleGman.tint = 0x223344;

            createButton(game, 400, 250, function () {
                LAGMAN.Level.currentLevelIdx = 0;
                game.state.start('play', true, false, LAGMAN.Level.LEVELS[0].id);
            });
            game.add.bitmapText(430, 280, 'carrier_command', 'Start game', 18);

            createButton(game, 400, 350, function () {
                game.state.start('how_to_play');
            });
            game.add.bitmapText(424, 380, 'carrier_command', 'How to play', 18);

            createButton(game, 400, 450, function (){
                game.state.start('credits');
            });
            game.add.bitmapText(460, 480, 'carrier_command', 'Credits', 18);
        },
        update: function () {

        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
