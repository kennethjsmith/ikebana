class Hud {
    constructor(game) {
        this.game = game;
        this.heartSprites = ASSET_MANAGER.getAsset("./sprites/hearts.png");
        this.flowerSprite = ASSET_MANAGER.getAsset("./sprites/symbol_flower.png");
        this.numberSprites = ASSET_MANAGER.getAsset("./sprites/numbers.png");
        //this.amo = ASSET_MANAGER.getAsset("./")

        this.sprites = new Map;
        this.loadSprites();
        this.health = this.sprites.get("heart").get(3);
        this.flower = this.sprites.get("flower");
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
    };

    update() {
        
        if (this.game.camera.health <= 0) this.health = this.sprites.get("heart").get(0);
        else this.health = this.sprites.get("heart").get(this.game.camera.health);
        // update the flower count
    };

    draw(ctx) {
        this.health.drawFrame(this.game.clockTick, ctx, 0, 0, 0.6);
        this.flower.drawFrame(this.game.clockTick, ctx, 480, 3, 0.27);
        ctx.fillStyle = "White";
        ctx.font = '50px Kouryuu';
        ctx.fillText(": " + this.game.camera.flowers, 550, 55)

        ctx.font = 'bold 50px Kouryuu';
        ctx.fillStyle = "Black";

        ctx.strokeText(": " + this.game.camera.flowers, 550, 55);
    };
};