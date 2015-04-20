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
            game.load.image('background', '/assets/images/credits_screen.png');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
            game.load.spritesheet('button', '/assets/images/button.png', 270, 80);
        },
        create: function (game) {
            var progMusic, reikText, progArt, beagleText;

            game.add.image(0, 0, 'background');

            createButton(game, 30, 30, function () {
                game.state.start('start');
            });
            game.add.bitmapText(50, 60, 'carrier_command', 'Go to title', 18);

            progMusic = game.add.bitmapText(50, 350, 'carrier_command', 'Programming and Music', 18);
            progMusic.tint = 0x223344;
            reikText = game.add.bitmapText(50, 380, 'carrier_command', '@reikval', 18);
            reikText.tint = 0x223344;

            progArt = game.add.bitmapText(50, 450, 'carrier_command', 'Programming and Art', 18);
            progArt.tint = 0x223344;
            beagleText = game.add.bitmapText(50, 480, 'carrier_command', '@beagleknight', 18);
            beagleText.tint = 0x223344;
            beagleText = game.add.bitmapText(50, 510, 'carrier_command', 'as the original Lagman', 10);
            beagleText.tint = 0x223344;

        },
        update: function () {

        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
