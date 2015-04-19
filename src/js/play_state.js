(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var PLAYER_VELOCITY = 150,
        ENEMY_VELOCITY  = 30,
        JUMP_VELOCITY   = -225;

    var player,
        lagTime,
        lagTimer,
        lagFactor,
        laggedPosition,
        map,
        enemies,
        cursors,
        music,
        pingTxt,
        levelTxt,
        timeTxt,
        layerFg,
        layerBg,
        i,
        l;

    function computeLagPosition() {
        if (!laggedPosition) {
            laggedPosition = { x: player.x, y: player.y };
        }
    }

    function setLagPosition() {
        player.x = laggedPosition.x;
        player.y = laggedPosition.y;
        laggedPosition = null;
    }

    function killEnemy(player, enemy) {
        player.score += lagTime;
        enemy.kill();
    }

    function checkEnemyMovement(enemy, tile) {
        if(tile.faceLeft && tile.faceRight) {
            enemy.body.velocity.x = 0;
        } else if(tile.faceLeft && tile.left + tile.width/10 > enemy.left) {
            enemy.body.velocity.x = ENEMY_VELOCITY;
        } else if(tile.faceRight && tile.right - tile.width/10 < enemy.right) {
            enemy.body.velocity.x = -ENEMY_VELOCITY;
        }
    }

    LAGMAN.playState = {
        init: function () {

        },
        preload: function (game) {
            game.load.spritesheet('player', '/assets/images/hero.png', 20, 40);
            game.load.spritesheet('enemy', '/assets/images/enemy.png', 20, 40);
            game.load.tilemap('level11', '/assets/levels/level11.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', '/assets/images/basic_tileset.png');
            game.load.audio('main_music', '/assets/music/maintheme.ogg');
            game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
        },
        create: function (game) {
            lagTime = game.rnd.integerInRange(300, 3000);
            lagFactor = 2;
            lagTimer = 0;

            //Adding physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //The 'test_map' key here is the Loader key given in game.load.tilemap
            map = game.add.tilemap('level11');

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

            map.setCollisionBetween(1, 2, true, layerFg.index, true);

            //Initializing input
            cursors = game.input.keyboard.createCursorKeys();

            //Playing music
            music = game.add.audio("main_music", 1, true);
            //music.play();

            pingTxt = game.add.bitmapText(5, 5, 'carrier_command', 'Ping: ' + lagTime + ' ms',11);
            levelTxt = game.add.bitmapText(530, 5, 'carrier_command','Level: 1-1',11);
            timeTxt = game.add.bitmapText(680, 5, 'carrier_command','Time: 99',11);

            game.time.events.loop(5000, function () {
                lagTime = game.rnd.integerInRange(300, 3000);
                pingTxt.text = "Ping: " + lagTime + " ms";
            });

            // Create enemies group
            enemies = game.add.group();

            for (i = 0, l = map.objects["Logic"].length; i < l; i += 1) {
                if (map.objects["Logic"][i].name === 'player') {
                    //Adding our hero
                    player = game.add.sprite(map.objects["Logic"][i].x, map.objects["Logic"][i].y - map.tileHeight, 'player');
                    player.anchor.setTo(0.5, 0.5);
                    //Physics and hero must interact
                    game.physics.arcade.enable(player);
                    player.body.gravity.y = 300;
                    player.body.collideWorldBounds = false;
                    player.score = 0;
                    player.frame = 3;
                } else if (map.objects["Logic"][i].type === 'enemy') {
                    //Adding our enemy
                    var enemy = enemies.create(map.objects["Logic"][i].x, map.objects["Logic"][i].y - map.tileHeight, 'enemy');
                    enemy.anchor.setTo(0.5, 0.5);
                    //Physics and hero must interact
                    game.physics.arcade.enable(enemy);
                    enemy.body.gravity.y = 300;
                    enemy.body.velocity.x = ENEMY_VELOCITY;
                    enemy.body.collideWorldBounds = false;
                }
            }
        },
        update: function (game) {
            //Checking collisions
            game.physics.arcade.collide(player, layerFg);
            game.physics.arcade.collide(enemies, layerFg, checkEnemyMovement);
            game.physics.arcade.collide(player, enemies, killEnemy);

            //Checking input
            player.body.velocity.x = 0;

            if(cursors.left.isDown) {
                player.body.velocity.x -= PLAYER_VELOCITY;
                player.frame = 0;
            }

            if(cursors.right.isDown) {
                player.body.velocity.x += PLAYER_VELOCITY;
                player.frame = 3;
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

            lagTimer += game.time.elapsed;

            if (lagTimer > lagTime / lagFactor) {
                computeLagPosition();
            }

            if (lagTimer > lagTime) {
                setLagPosition();
                lagTimer = 0;
            }
        }
    };

    exports.LAGMAN = LAGMAN;
}(window));
