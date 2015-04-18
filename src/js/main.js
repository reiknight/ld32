(function () {
    "use strict";

    var PLAYER_VELOCITY = 150;
    
    var player,
        cursors;
    
    function preload() {
        game.load.image('player', '/assets/images/star.png');
    }
    
    function create() {
        //Adding physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Adding our hero
        player = game.add.sprite(400, 300, 'player');
        player.anchor.setTo(0.5, 0.5);
        
        //Physics and hero must interact
        game.physics.arcade.enable(player);
        
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        
        //Initializing input
        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() {
        //Checking input
        player.body.velocity.x = 0;
        
        if(cursors.left.isDown) {
            player.body.velocity.x -= PLAYER_VELOCITY;
        }
        if(cursors.right.isDown) {
            player.body.velocity.x += PLAYER_VELOCITY;
        }
        if(cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -PLAYER_VELOCITY;
        }
        
        //Checking collisions
    }
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});
    
}());
