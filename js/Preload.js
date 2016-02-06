var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.game.load.spritesheet('logo-tiles', 'assets/images/logo-tiles.png', 17, 16);
    this.game.load.spritesheet('tiles', 'assets/images/bitslap-minild62.png', 16, 16);
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('sky', 'assets/images/sky_new.png');
    this.game.load.image('star', 'assets/images/B13.png');
    this.game.load.image('ship', 'assets/images/A5.png');
    this.game.load.image('enemy1', 'assets/images/B6.png');
    this.game.load.image('enemy2', 'assets/images/C7.png');
    this.game.load.image('enemy3', 'assets/images/D8.png');
    this.game.load.image('enemy4', 'assets/images/E9.png');
    this.game.load.image('enemy5', 'assets/images/F10.png');
    this.game.load.image('star1', 'assets/images/star1.png');
    this.game.load.image('star2', 'assets/images/star2.png');
    this.game.load.image('star3', 'assets/images/star3.png');
    this.game.load.image('star4', 'assets/images/star4.png');
    this.game.load.image('star5', 'assets/images/star5.png');

    this.game.load.spritesheet('explosion1', 'assets/images/explosion_01_strip13.png', 196, 190);
    this.game.load.spritesheet('explosion2', 'assets/images/explosion_02_strip13.png', 205, 190);
    this.game.load.spritesheet('explosion3', 'assets/images/explosion_03_strip13.png', 190, 190);

    this.game.load.audio('music', 'assets/audio/music.ogg');

  },
  create: function() {
    this.state.start('Game');
  }
};
