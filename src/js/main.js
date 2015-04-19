(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('start', LAGMAN.startState);
    game.state.add('how_to_play', LAGMAN.howToPlayState);
    game.state.add('credits', LAGMAN.creditsState);
    game.state.add('play', LAGMAN.playState);

    game.state.start('start');
}(window));
