class Crosshair {
    constructor(game) {
        this.game = game;
        this.game.crosshair = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/crosshair.png");
        this.SIZE = 13; // find better way to get this pizel width
        this.SCALE = 3;

        this.xCanvas = 0;
        this.yCanvas = 0;
        this.xMap = 0;
        this.yMap = 0;


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
        this.xCanvas = this.game.mouseX;
        this.yCanvas = this.game.mouseY;

        this.xMap = this.xCanvas + this.game.goop.xMap;
        this.yMap = this.yCanvas + this.game.goop.yMap;

    };


    draw(ctx) {
        // I don't know why this 9 is necessary to center
        // ctx.save();
        // ctx.translate(-this.game.goop.x, -this.game.goop.y);//400 is half canvas width,300 height, - half player widthand height
        
        this.animations.drawFrame(this.game.clockTick, ctx, this.xCanvas-(this.spriteWidth/2), this.yCanvas-(this.spriteWidth/2), this.SCALE); //this had -9 on the x
        // ctx.restore();
    };
};