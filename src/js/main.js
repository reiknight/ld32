(function () {
    "use strict";

    var PLAYER_VELOCITY = 150,
        JUMP_VELOCITY   = -225;

    var map,
        layerBg,
        layerFg,
        player,
        cursors;

    function preload() {
        game.load.image('player', '/assets/images/star.png');
        game.load.tilemap('test_map', '/assets/levels/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', '/assets/images/basic_tileset.png');
    }

    function create() {
        //Adding physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //The 'test_map' key here is the Loader key given in game.load.tilemap
        map = game.add.tilemap('test_map');

        //The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('basic_tileset', 'tiles');

        //Creates a layer from the World1 layer in the map data.
        //A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        layerBg = map.createLayer('Background');
        layerFg = map.createLayer('Foreground');

        //This resizes the game world to match the layer dimensions
        layerBg.resizeWorld();
        layerFg.resizeWorld();

        //Adding our hero
        player = game.add.sprite(400, 300, 'player');
        player.anchor.setTo(0.5, 0.5);

        //Physics and hero must interact
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = false;

        map.setCollisionBetween(1, 2, true, layerFg.index, true);

        //Initializing input
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        //Checking collisions
        game.physics.arcade.collide(player, layerFg);

        //Checking input
        player.body.velocity.x = 0;

        if(cursors.left.isDown) {
            player.body.velocity.x -= PLAYER_VELOCITY;
        }
        if(cursors.right.isDown) {
            player.body.velocity.x += PLAYER_VELOCITY;
        }

        if(cursors.up.isDown && player.body.blocked.down) {
            player.body.velocity.y = JUMP_VELOCITY;
        }

        if (player.y > game.world.height) {
            player.y = 0;
        }

        if (player.y < 0) {
            player.y = game.world.height;
        }

        if (player.x > game.world.width) {
            player.x = 0;
        }

        if (player.x < 0) {
            player.x = game.world.width;
        }
    }

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

}());
