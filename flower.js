class Flower {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/flower.png");
        
        // flower's state variables
        this.state = "growing"; // walking or vibin

        this.xMap = x;
        this.yMap = y;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get(this.state);
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        this.animations.set("growing", new Animator(this.spritesheet, 0, 0, 12, 20, 6, .2));
        this.animations.set("grown", new Animator(this.spritesheet, 60, 0, 12, 20, 1, .08));
        this.animations.set("picked", new Animator(this.spritesheet, 72, 0, 12, 20, 1, .08));

    };

    update() {
        if (this.animation.currentFrame() == 5) {
            this.state = "grown";
            this.animation = this.animations.get(this.state);
        }
        // update speed
        // update position
        // update armed or unarmed
        //this.x -= this.speed + this.game.clockTick;
        //if (this.x < 0) this.x = 1000;
    };

    draw(ctx) {
        ctx.save();
        ctx.translate(-this.game.goop.xMap+this.game.goop.xStart, -this.game.goop.yMap+this.game.goop.yStart);

        this.animation.drawFrame(this.game.clockTick, ctx, this.xMap, this.yMap, 5);
        ctx.restore();
    };
};