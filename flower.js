class Flower {
    constructor(game, x, y) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/flower1.png");
        
        // flower's state variables
        this.state = "growing"; // walking or vibin

        this.x = x;
        this.y = y;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get(this.state);
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        this.animations.set("growing", new Animator(this.spritesheet, 0, 0, 100, 200, 6, .2));
        this.animations.set("grown", new Animator(this.spritesheet, 500, 0, 100, 200, 1, .08));
        this.animations.set("picked", new Animator(this.spritesheet, 600, 0, 100, 200, 1, .08));

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
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
    };
};