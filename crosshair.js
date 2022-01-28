class Crosshair {
    constructor(game) {
        this.game = game;
        this.game.crosshair = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/crosshair.png");
        this.SIZE = 13; // find better way to get this pizel width
        this.SCALE = 3;
        this.spriteSize = this.SIZE * this.SCALE;

        this.xMap = null;
        this.yMap = null;


        //adjust x and y to center bullet sprite drawing over trajectory, trajectory*size/2
        this.spriteWidth = this.SIZE * this.SCALE;

        this.animations = new Map;
        this.loadAnimations();
        
        this.animations = this.animations.get("crosshair1");
    };

    loadAnimations() {
        this.animations.set("crosshair1", new Animator(this.spritesheet, 0, 0, this.SIZE, this.SIZE, 1, 1));
    };

    update() {
        console.log("mousex and camerax:" +this.game.mouseX + this.game.camera.x);
        this.xMap = this.game.mouseX + this.game.camera.x;
        this.yMap = this.game.mouseY + this.game.camera.y;

    };


    draw(ctx) {
        this.animations.drawFrame(this.game.clockTick, ctx, this.game.mouseX, this.game.mouseY, this.SCALE); //this had -9 on the x
    };
};