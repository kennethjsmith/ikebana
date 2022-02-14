class Hud {
    constructor(game) {
        this.game = game;
        this.heartSprites = ASSET_MANAGER.getAsset("./sprites/hearts.png");
        this.flowerSprite = ASSET_MANAGER.getAsset("./sprites/symbol_flower.png");
        this.numberSprites = ASSET_MANAGER.getAsset("./sprites/numbers.png");

        //this.amo = ASSET_MANAGER.getAsset("./")

        this.sprites = new Map;
        this.loadSprites();
        this.health = this.sprites.get("heart").get(2);
        this.flower = this.sprites.get("flower");
       // this.flowerCount = this.sprites.get("number").get(0);
        //this.flowerCount = this.sprites.get("number").get();

    };

    loadSprites() {

        this.sprites.set("heart", new Map);
        this.sprites.get("heart").set(3, new Animator(this.heartSprites, 0, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(2.5, new Animator(this.heartSprites, 430, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(2, new Animator(this.heartSprites, 860, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(1.5, new Animator(this.heartSprites, 1290, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(1, new Animator(this.heartSprites, 1720, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(0.5, new Animator(this.heartSprites, 2150, 0, 430, 120, 1, 1));
        this.sprites.get("heart").set(0, new Animator(this.heartSprites, 2580, 0, 430, 120, 1, 1));

        this.sprites.set("flower", new Animator(this.flowerSprite, 0, 0, 240, 240, 1, 1));
        //this.sprites.set("ammo", new Animator())

        this.sprites.set("number").set("x", new Animator(this.numberSprites, 0, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(0, new Animator(this.numberSprites, 100, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(1, new Animator(this.numberSprites, 220, 0, 70, 120, 1, 1));

        this.sprites.set("number").set(2, new Animator(this.numberSprites, 290, 0, 90, 120, 1, 1));
        this.sprites.set("number").set(3, new Animator(this.numberSprites, 380, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(4, new Animator(this.numberSprites, 480, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(5, new Animator(this.numberSprites, 580, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(6, new Animator(this.numberSprites, 690, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(7, new Animator(this.numberSprites, 790, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(8, new Animator(this.numberSprites, 890, 0, 100, 120, 1, 1));
        this.sprites.set("number").set(9, new Animator(this.numberSprites, 990, 0, 100, 120, 1, 1));


       // this.animations.set("growing", new Animator(this.spritesheet, 0, 0, 12, 20, 6, .2));
       // this.animations.set("grown", new Animator(this.spritesheet, 60, 0, 12, 20, 1, .08));
        //this.animations.set("picked", new Animator(this.spritesheet, 72, 0, 12, 20, 1, .08));

    };

    update() {
        this.health = this.sprites.get("heart").get(this.game.camera.health);
        // update the flower count

     //   if (this.animation.currentFrame() == 5) {
       //     this.state = "grown";
       //     this.animation = this.animations.get(this.state);
        //}
        // update speed
        // update position
        // update armed or unarmed
        //this.x -= this.speed + this.game.clockTick;
        //if (this.x < 0) this.x = 1000;
    };

    draw(ctx) {
        if (this.game.camera.play || this.game.camera.pause) {
            console.log("HERE");
            // first try to draw the correct heart
            this.health.drawFrame(this.game.clockTick, ctx, 0, 0, 0.6);

        //     let BLOCKWIDTH = 20;
        //     ctx.fillStyle = "White";
        //     ctx.fillText("TITLE", 1.5 * BLOCKWIDTH, 1 * BLOCKWIDTH);
        //    // ctx.fillText((this.score + "").padStart(8,"0"), 1.5 * BLOCKWIDTH, 1.5 * BLOCKWIDTH);
        //    // ctx.fillText("x" + (this.coins < 10 ? "0" : "") + this.coins, 6.5 * BLOCKWIDTH, 1.5 * BLOCKWIDTH);
        //     ctx.fillText("LEVEL", 9 * BLOCKWIDTH, 1 * BLOCKWIDTH);
        //     ctx.fillText(this.game.camera.levelLabel.level, 9.5 * BLOCKWIDTH, 1.5 * BLOCKWIDTH);
        //     ctx.fillText("TIME", 12.5 * BLOCKWIDTH, 1 * BLOCKWIDTH);
        //     ctx.fillText("400", 13 * BLOCKWIDTH, 1.5 * BLOCKWIDTH);
        // this.animation.drawFrame(this.game.clockTick, ctx, 0, 0, .4);
        }
    };
};