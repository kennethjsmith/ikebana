class Bulb {
    constructor(game, x, y) {
        this.game = game;
        if (this.game.camera.level == "level1") this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bulb1.png");
        else if (this.game.camera.level == "level2") this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bulb2.png");

        this.scale = 5;
        this.spriteHeight = 20 * this.scale; // scaled height
        this.spriteWidth = 12 * this.scale; // scaled width

        this.xMap = x;
        this.yMap = y;

        this.animations = new Map;
        this.loadAnimations();

        this.sparkle = false;
        this.animation = this.animations.get(this.sparkle);
        this.sparkleTimeout = 200;
        this.sparkleTimer = 0;
    };

    loadAnimations() {
        this.animations.set(false, new Animator(this.spritesheet, 0, 0, 10, 10, 1, 200));
        this.animations.set(true, new Animator(this.spritesheet, 0, 0, 10, 10, 8, .08));
    };

    update() {
        console.log(this.sparkle);
        console.log(this.animation.currentFrame());
        //console.log("TIMER: " + this.sparkleTimer);

        if (this.sparkle && this.animation.isDone()) {
            this.sparkle = false;
            this.animation = this.animations.get(this.sparkle);
            //this.sparkleTimer = 0;

        } else if (!this.sparkle && this.animation.isDone()) {
            this.sparkle = true;
            this.animation = this.animations.get(this.sparkle);
        }
            // if (this.sparkleTimer >= this.sparkleTimeout) {
            //     this.sparkle = true;
            //     this.animation = this.animations.get(this.sparkle);
            //     this.sparkleTimer = 0;
            // } else {
            //     this.sparkleTimer++;
            // }
        //}
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.scale);
    };

};