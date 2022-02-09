class Slime {
    constructor(game, x, y) {
        this.game = game;

        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/slime.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/slime2.png");

        if (this.game.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;        
        this.scale = 2.5;

        // alien's state variables
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin
        this.spriteHeight = 32;
        this.spriteWidth = 29;

        this.xMap = x;
        this.yMap = y;
        this.updateBoundingBox();

        //this.speed = 2.5;
        this.speed = 0;

        this.animations = new Map;
        this.loadAnimations();
        this.animation = this.animations.get("right").get("vibing");

    };



    loadAnimations() {
        this.animations.set("left", new Map);
        this.animations.set("right", new Map);

        this.animations.get("left").set("walking", new Animator(this.spritesheet, 0, 0, 32, 29, 10, .08));
        this.animations.get("left").set("vibing", new Animator(this.spritesheet, 0, 0, 32, 29, 10, .08));
        this.animations.get("left").set("dying", new Animator(this.spritesheet, 0, 30, 32, 29, 10, .12));

        this.animations.get("right").set("walking", new Animator(this.spritesheet, 320, 0, 32, 29, 10, .08));
        this.animations.get("right").set("vibing", new Animator(this.spritesheet, 320, 0, 32, 29, 10, .08));
        this.animations.get("right").set("dying", new Animator(this.spritesheet, 320, 30, 32, 29, 10, .12));

    };

    update() {

        // update speed
        // update position
        // update armed or unarmed
        //this.x -= this.speed + this.game.clockTick;
        //if (this.x < 0) this.x = 1000;
    };

    updateBoundingBox() {
        this.boundingBox = new BoundingBox(this.xMap + this.spriteWidth /2, this.yMap + this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.scale);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(Math.floor(this.boundingBox.left - this.game.camera.x), Math.floor(this.boundingBox.top - this.game.camera.y), this.spriteWidth, this.spriteHeight);
       
    };
};