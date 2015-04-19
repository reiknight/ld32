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

    LAGMAN.creditsState = {
        init: function () {

        },
        preload: function (game) {
            game.load.image('background', '/assets/images/start_screen.png');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.spritesheet('button', '/assets/images/button.png', 270, 80);
        },
        create: function (game) {
            game.add.image(0, 0, 'background');

            createButton(game, 400, 250, function () {
                game.state.start('start');
            });
            game.add.bitmapText(430, 280, 'carrier_command', 'Go to title', 18);
        },
        update: function () {

        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
