class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = null;
        this.y = null;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/HUD_mockup.png");
        this.animation = new Animator(this.spritesheet, 0, 0, 1483, 198, 1, 1);

        this.health = 3;
        this.ammo = { bullet: 255, energy: 55};
        this.flowers = 0;

        this.xMidpoint = null;
        this.yMidpoint = null;



        //this.gameOver = false;
        this.level = "level1";
        this.levelXSize = 75; // # of tiles
        this.levelYSize = 41;

        this.loadLevel(this.level);

        // this.mario = new Mario(this.game, 2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);

        //this.loadLevel(this.level);//levelOne, 2.5 * PARAMS.BLOCKWIDTH, 13 * PARAMS.BLOCKWIDTH, false, true);

        // NOTE: PLEASE USE THE FOLLOWING LINE TO TEST.
        // this.loadLevel(levelTwo, 2.5 * PARAMS.BLOCKWIDTH, 13 * PARAMS.BLOCKWIDTH, false, true);
    };

    loadLevel(level) {

        // add goop
        this.game.addEntity(new Goop(this.game, (this.levelXSize*5*16)/2, (this.levelYSize*5*16)/2)); // 5 is level scaler and 16 is the sprite width/height for level tiles

        console.log("goop max: " + this.game.goop.xMap);

        this.xMidpoint = this.game.ctx.canvas.width/2 - (this.game.goop.spriteWidth/2);
        this.yMidpoint = this.game.ctx.canvas.height/2 - (this.game.goop.spriteHeight/2);

        this.x = this.game.goop.xMap - this.xMidpoint;
        this.y = this.game.goop.yMap - this.yMidpoint;

        // build level map
        this.game.level = new LevelGenerator(this.game, this.levelXSize, this.levelYSize);

    }

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    update() {
        this.x = this.game.goop.xMap - this.xMidpoint;
        this.y = this.game.goop.yMap - this.yMidpoint;
    }


   
    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, 0, 0, .5);
    };
}
