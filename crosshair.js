class Crosshair {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/crosshair.png");
        this.SIZE = 13; // find better way to get this pizel width
        this.SCALE = 4;

        this.x = 400;
        this.y = 400;


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
        this.x = this.game.mouseX;
        this.y = this.game.mouseY;
    };


    draw(ctx) {
        // I don't know why this 9 is necessary to center
        this.animations.drawFrame(this.game.clockTick, ctx, this.x-(this.spriteWidth/2)-9, this.y-(this.spriteWidth/2), this.SCALE);
    };
};