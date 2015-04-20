(function (exports) {
    "use strict";

    var LAGMAN = exports.LAGMAN || {};

    var PLAYER_VELOCITY = 150,
        BOT_VELOCITY    = 100,
        ENEMY_VELOCITY  = 30,
        JUMP_VELOCITY   = -225;

    var laggedPosition;

    function createShootEvent (game, enemy, bullets) {
        enemy.shoot = game.time.events.loop(game.rnd.integerInRange(2000, 7000), function() {
            var bullet = bullets.create(enemy.x + (enemy.movingRight?1:-1), enemy.y, 'bullet');
            bullet.anchor.setTo(0.5, 0.5);
            game.physics.arcade.enable(bullet);
            bullet.body.velocity.x = (enemy.movingRight?1:-1)*(ENEMY_VELOCITY + enemy.body.velocity.xIncrement)*3;
            if (enemy.movingRight) {
                enemy.frame = 3;
                bullet.frame = 1;
            } else {
                enemy.frame = 0;
                bullet.frame = 0;
            }
            game.time.events.add(1000, function () {
                if (enemy.movingRight) {
                    enemy.frame = 2;
                } else {
                    enemy.frame = 1;
                }
            });
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

    function killBullet(bullet) {
        bullet.kill();
    }

    function computeLagPosition(player) {
        if (!laggedPosition) {
            laggedPosition = { x: player.x, y: player.y };
        }
    }

    function setLagPosition(player) {
        player.x = laggedPosition.x;
        player.y = laggedPosition.y;
        laggedPosition = null;
    }

    LAGMAN.Level = function (game, levelId) {
        var i,
            l;

        //Initializing input
        this.cursors = game.input.keyboard.createCursorKeys();

        //The 'test_map' key here is the Loader key given in game.load.tilemap
        this.map = game.add.tilemap(levelId);

        //The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //The second parameter maps this name to the Phaser.Cache key 'tiles'
        this.map.addTilesetImage('basic_tileset', 'tiles');

        //Creates a layer from the World1 layer in the map data.
        //A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        this.layerBg = this.map.createLayer('Background');
        this.layerFg = this.map.createLayer('Foreground');

        //This resizes the game world to match the layer dimensions
        this.layerBg.resizeWorld();
        this.layerFg.resizeWorld();

        // Create groups
        this.enemies = game.add.group();
        this.bullets = game.add.group();
        this.bots    = game.add.group();

        this.map.setCollisionBetween(1, 2, true, this.layerFg.index, true);

        this.getCurrentLag(game);
        this.lagFactor = 2;
        this.lagTimer = 0;

        //Playing music and adding sound effects
        if (levelId !== 'howto') {
            this.music = game.add.audio(LAGMAN.Level.MUSIC[game.rnd.integerInRange(0, LAGMAN.Level.MUSIC.length - 1)], 1, true);
            this.music.play();
        }
        this.enemyDieFX = game.add.audio('enemydie', 0.2, false);
        this.jumpFX = game.add.audio('jump', 0.2, false);
        this.playerDieFX = game.add.audio('playerdie', 0.4, false);

        for (i = 0, l =this. map.objects["Logic"].length; i < l; i += 1) {
            if (this.map.objects["Logic"][i].name === 'player') {
                //Adding our hero
                this.player = game.add.sprite(this.map.objects["Logic"][i].x, this.map.objects["Logic"][i].y - this.map.tileHeight, 'player');
                this.player.anchor.setTo(0.5, 0.5);
                //Physics and hero must interact
                game.physics.arcade.enable(this.player);
                this.player.body.gravity.y = 300;
                this.player.body.collideWorldBounds = false;
                this.player.score = 0;
                this.player.frame = 3;
                this.player.animations.add('die', [4,5,6,7,8,9,10,11], 4, false);
            } else if (this.map.objects["Logic"][i].type === 'enemy') {
                //Adding our enemy
                var enemy = this.enemies.create(this.map.objects["Logic"][i].x, this.map.objects["Logic"][i].y - this.map.tileHeight, 'enemy');
                enemy.anchor.setTo(0.5, 0.5);
                //Physics and hero must interact
                game.physics.arcade.enable(enemy);
                enemy.body.gravity.y = 300;
                enemy.body.velocity.xIncrement = game.rnd.integerInRange(0, 15);
                enemy.body.velocity.x = ENEMY_VELOCITY + enemy.body.velocity.xIncrement;
                enemy.body.collideWorldBounds = false;
                enemy.frame = 2;
                enemy.animations.add('die', [4,5,6,7], 4, false);
                enemy.movingRight = true;
                createShootEvent(game, enemy, this.bullets);
            } else if (this.map.objects["Logic"][i].type === 'bot') {
                //Adding our hero
                var bot = this.bots.create(this.map.objects["Logic"][i].x, this.map.objects["Logic"][i].y - this.map.tileHeight, 'player');
                bot.anchor.setTo(0.5, 0.5);
                //Physics and hero must interact
                game.physics.arcade.enable(bot);
                bot.body.gravity.y = 300;
                bot.body.collideWorldBounds = false;
                bot.body.velocity.x = BOT_VELOCITY;
                bot.score = 0;
                bot.frame = 3;
                bot.animations.add('die', [4,5,6,7,8,9,10,11], 4, false);
            }
        }

        if (this.bots._hash.length > 0) {
            game.time.events.add(4000, function () {
                this.bots._hash[1].body.velocity.y = JUMP_VELOCITY;
                this.jumpFX.play();
            }, this);
        }
    };

    LAGMAN.Level.prototype.update = function (game) {
        //Checking collisions
        game.physics.arcade.collide(this.bots, this.layerFg);
        game.physics.arcade.collide(this.enemies, this.layerFg, checkEnemyMovement);
        game.physics.arcade.collide(this.bots, this.enemies, function (player, enemy) {
            if (!player.dying) {
                player.score += this.lagTime;
                game.time.events.remove(enemy.shoot);
                enemy.body = null;
                enemy.animations.play('die', null, false, true);
                this.enemyDieFX.play();
            }
        }, null, this);
        game.physics.arcade.collide(this.bullets, this.layerFg, killBullet);
        game.physics.arcade.collide(this.bots, this.bullets, function(player, bullet) {
            player.score = 0;
            player.dying = true;
            player.body.velocity = { x: 0, y: 0 };
            player.animations.play('die', null, false, true);
            this.playerDieFX.play();
            bullet.kill();
        }, null, this);

        game.physics.arcade.collide(this.player, this.layerFg);

        game.physics.arcade.collide(this.player, this.enemies, function (player, enemy) {
            if (!this.player.dying) {
                player.score += this.lagTime;
                game.time.events.remove(enemy.shoot);
                enemy.body = null;
                enemy.animations.play('die', null, false, true);
                this.enemyDieFX.play();
            }
        }, null, this);

        game.physics.arcade.collide(this.player, this.bullets, function(player, bullet) {
            bullet.kill();
            player.score = 0;
            player.dying = true;
            player.body.velocity = { x: 0, y: 0 };
            player.animations.play('die', null, false, true);
            this.playerDieFX.play();
        }, null, this);

        if (this.player && !this.player.dying) {
            //Checking input
            this.player.body.velocity.x = 0;

            if(this.cursors.left.isDown) {
                this.player.body.velocity.x -= PLAYER_VELOCITY;
                this.player.frame = 0;
            }

            if(this.cursors.right.isDown) {
                this.player.body.velocity.x += PLAYER_VELOCITY;
                this.player.frame = 3;
            }

            if(this.cursors.up.isDown && this.player.body.blocked.down) {
                this.player.body.velocity.y = JUMP_VELOCITY;
                this.jumpFX.play();
            }

            if (this.player.y > game.world.height) {
                this.player.y = 0;
            }

            if (this.player.y < 0) {
                this.player.y = game.world.height;
            }

            if (this.player.x > game.world.width) {
                this.player.x = 0;
            }

            if (this.player.x < 0) {
                this.player.x = game.world.width;
            }

            this.lagTimer += game.time.elapsed;

            if (this.lagTimer > this.lagTime / this.lagFactor) {
                computeLagPosition(this.player);
            }

            if (this.lagTimer > this.lagTime) {
                setLagPosition(this.player);
                this.lagTimer = 0;
            }
        }

        if (this.player) {
            //Checking victory-lose conditions
            if (this.enemies.countLiving() === 0) {
                LAGMAN.Level.currentLevelIdx += 1;
                this.music.stop();
                if (LAGMAN.Level.currentLevelIdx >= LAGMAN.Level.LEVELS.length) {
                    game.state.start('credits');
                } else {
                    game.state.start('play', true, false, LAGMAN.Level.LEVELS[LAGMAN.Level.currentLevelIdx].id);
                }
            }

            if (!this.player.alive) {
                this.music.stop();
                game.state.start('play', true, false, LAGMAN.Level.LEVELS[LAGMAN.Level.currentLevelIdx].id);
            }
        }
    };

    LAGMAN.Level.prototype.getCurrentLag = function (game) {
        this.lagTime = game.rnd.integerInRange(300, 3000);
        //this.lagTime = 0;
        return this.lagTime;
    };

    LAGMAN.Level.LEVELS = [
        { id: 'level11', name: "Level 1-1" },
        { id: 'level12', name: "Level 1-2" },
        { id: 'level13', name: "Level 1-3" },
        { id: 'level14', name: "Level 1-4" }
    ];

    LAGMAN.Level.MUSIC = ['main_music', 'sec_music'];

    LAGMAN.Level.currentLevelIdx = 0;

    exports.LAGMAN = LAGMAN;
}(window));
