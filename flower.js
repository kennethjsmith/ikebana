class Flower {
    constructor(game, x, y) {
        this.game = game;
        console.log("NEW FLOWER ADDED");

        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/flower.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/flower2.png");
        if (this.game.camera.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;

        this.scale = 5;
        this.spriteHeight = 20 * this.scale; // scaled height
        this.spriteWidth = 12 * this.scale; // scaled width
        this.heightOffset = this.spriteHeight - 15; // 
        this.widthOffset = this.spriteWidth / 2;
        
        this.xMap = x - this.widthOffset;
        this.yMap = y - this.heightOffset;
       // this.midpoint = { x: this.xMap + this.widthOffset, y: this.yMap + this.heightOffset };

        // flower's state variables
        this.state = "growing"; // growing grown, or destroyed

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get(this.state);
    };

    loadAnimations() {
        this.animations.set("growing", new Animator(this.spritesheet, 0, 0, 12, 20, 6, .2));
        this.animations.set("grown", new Animator(this.spritesheet, 60, 0, 12, 20, 1, .08));
        this.animations.set("destroyed", new Animator(this.spritesheet, 72, 0, 12, 20, 1, .08));
    };

    update() {
        if (this.animation.currentFrame() == 5) this.state = "grown";
        this.animation = this.animations.get(this.state);
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.scale);
    };
};