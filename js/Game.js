var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {
        this.game.stage.backgroundColor = "#000";

        this.game.camera.follow(this.player);

        this.powerUps = this.game.add.group();
        this.powerUps.enableBody = true;
        //  Finally some stars to collect
        this.stars = this.game.add.group();
        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        this.explosions = this.game.add.group();

        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;

        this.players = this.game.add.group();
        
        this.player = this.players.create(400, 400, 'ship');
        this.player.scale.setTo(1, -1);

        this.game.physics.arcade.enable(this.player);

        this.player.anchor.setTo(0.5);
        this.player.body.collideWorldBounds = true;
        this.reset();
        
        this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.rKey.onDown.add(this.reset, this);
               
        this.music = this.game.add.audio('music');
        this.music.loop = true;
        this.music.play();
        this.music.volume = 0.6;
        

        //  The score
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
        //this.scoreText.fixedToCamera = true;
        this.score = 0;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;

        this.showDebug = false;

        
        
    },

    reset: function() {
        this.speed = 300;
        this.score = 0;
        this.player.x = 400;
        this.player.y = 400;
        this.player.visible = true;
        this.timer = 0;
        this.deathWhat = false;

    },

    spawnEnemy: function() {

        var starfoo = 'enemy' + this.game.rnd.integerInRange(1,5);

        var enemy = this.enemies.create(this.game.rnd.integerInRange(1, 799), -200, starfoo);
        enemy.body.velocity.y = 300 + this.game.rnd.integerInRange(10,this.timer/10);
        enemy.anchor.setTo(0.5);
        if (enemy.body.x > this.player.body.x) {
            enemy.body.velocity.x = -this.game.rnd.integerInRange(0,300) + this.timer/100;
        }
        else {
            enemy.body.velocity.x = this.game.rnd.integerInRange(0,300) + this.timer/100;
        }


    },

    spawnStars: function(number) {
                //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < number; i++)
        {
            //  Create a star inside of the 'stars' group
            var starfoo = 'star' + this.game.rnd.integerInRange(1,5);
            var star = this.stars.create(this.game.rnd.integerInRange(1, 799), -20, starfoo);

            star.scale.setTo(0.5);

            //  Let gravity do its thing
            star.body.velocity.y = 300 + this.game.rnd.integerInRange(10,300);
            
            
        }

    },

    explode: function(player, enemy) {
        var starfoo = 'explosion' + this.game.rnd.integerInRange(2,3);

        var explode = this.explosions.create(enemy.body.x - 40, enemy.body.y - 10, starfoo);        
        explode.animations.add('bang', [0,1,2,3,4,5,6,7,8,9,10,11,12,], 10, false);
        explode.animations.play('bang');
        explode.anchor.setTo(0, 0);
        enemy.kill();
    },

    explode2: function(enemy1, enemy) {
        var starfoo = 'explosion2'; // + this.game.rnd.integerInRange(1,3);

        var explode = this.explosions.create(enemy.body.x - 40, enemy.body.y - 10, starfoo);        
        explode.animations.add('bang', [0,1,2,3,4,5,6,7,8,9,10,11,12,], 10, false);
        explode.animations.play('bang');
        explode.anchor.setTo(0, 0);
        enemy.kill();

        var starfoo = 'explosion3'; // + this.game.rnd.integerInRange(1,3);

        var explode = this.explosions.create(enemy1.body.x - 40, enemy1.body.y - 10, starfoo);        
        explode.animations.add('bang', [0,1,2,3,4,5,6,7,8,9,10,11,12,], 10, false);
        explode.animations.play('bang');
        explode.anchor.setTo(0, 0);
        enemy1.kill();
    },

    update: function() {
        this.timer++;
            if (this.deathWhat == false) {
                this.score += 1;
                this.scoreText.text = "Score: " + this.score;
            }
            else {
                this.scoreText.text = "Score: " + this.score + " - hit R to restart";
            }

        if (this.timer % 10 == 0) {
            this.spawnStars(this.game.rnd.integerInRange(1,10));
            this.game.world.bringToTop(this.enemies);
            this.game.world.bringToTop(this.player);
        }
        if (this.timer % 100 == 0 || this.game.rnd.integerInRange(1,30000) < this.timer ) {
            this.spawnEnemy();
        }
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(this.player, this.enemies, this.death, this.isVisible, this);
        this.game.physics.arcade.collide(this.enemies, this.enemies, this.explode2, this.isVisible, this);
        //this.game.physics.arcade.collide(this.stars, this.blockedLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.powerUps, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
//            this.player.scale.setTo(-1, 1);
            this.player.body.velocity.x = -this.speed;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
  //          this.player.scale.setTo(1, 1);
            this.player.body.velocity.x = this.speed;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 3;
        }
        
        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -this.speed;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = this.speed;
        }

        if (this.space.isDown) {
            this.fire();

        }
    },

    isVisible: function() {
        return this.player.visible;
    },
    fire: function() {

    },
    death: function(player, enemy) {
        var starfoo = 'explosion1'; // + this.game.rnd.integerInRange(1,3);

        var explode = this.explosions.create(player.body.x - 40, player.body.y - 20, starfoo);        
        explode.animations.add('bang', [0,1,2,3,4,5,6,7,8,9,10,11,12,], 10, false);
        explode.animations.play('bang');
        explode.anchor.setTo(0, 0);
        this.player.visible = false;
        this.explode(player, enemy);
        this.deathWhat = true;


    },

    collectStar : function(player, star) {
        
        // Removes the star from the screen
        star.kill();
        if (star.dangerous) {
            player.kill();
        }

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },


    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },


    render: function() {

        if (this.showDebug) {
            this.game.debug.body(this.player);
        }
    },

};