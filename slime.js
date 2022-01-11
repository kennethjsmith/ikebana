class Slime {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/slime.png");
        
        // alien's state variables
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin

        this.x = 100;
        this.y = 400;
        // this.z

        //this.speed = 2.5;
        this.speed = 0;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get("right").get("vibing");
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

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

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2.5);
    };
};