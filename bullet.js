class Bullet {
    constructor(game) {
        this.game = game;
        this.speed = 10;
        this.range = 100; //how many updates, ie this bullet will travel speed*range
        this.removeFromWorld = false;
        

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bullet.png");
        this.SIZE = 12; // find better way to get this pizel width
        this.SCALE = 4;

        // adjust x and y so bullets start at gun, WHY is this not the proper x and y passed from constructor in gun????
        this.xMap = this.game.gun.xBarrelTipMap;
        this.yMap = this.game.gun.yBarrelTipMap;
        this.xCanvas = this.game.gun.xBarrelTipCanvas;
        this.yCanvas = this.game.gun.yBarrelTipCanvas;
        
        this.xDistance = (this.game.crosshair.xCanvas-this.xCanvas);
        this.yDistance = (this.game.crosshair.yCanvas-this.yCanvas);
       
        this.diagonal = Math.sqrt((this.xDistance*this.xDistance) + (this.yDistance*this.yDistance));
    
        this.xTrajectory = (this.xDistance/this.diagonal);
        this.yTrajectory = (this.yDistance/this.diagonal);

        this.xVelocity = this.speed*this.xTrajectory;
        this.yVelocity = this.speed*this.yTrajectory;

        //adjust x and y to center bullet sprite drawing over trajectory, trajectory*size/2
        this.spriteWidth = this.SIZE * this.SCALE;

        this.animations = new Map;
        this.loadAnimations();
        
        this.animations = this.animations.get("shot");
    };

    loadAnimations() {
        this.animations.set("shot", new Animator(this.spritesheet, 1, 1, 10, 10, 1, 1));
    };

    update() {
        this.xMap += this.xVelocity;// * this.game.clockTick);
        this.yMap += this.yVelocity;// * this.game.clockTick);
        // bullets need to move on canvas in the opposite direction of goop movement
        this.xCanvas += this.xVelocity-this.game.goop.velocity.x;
        this.yCanvas += this.yVelocity-this.game.goop.velocity.y;

        this.range--;
        if(this.range == 0) this.removeFromWorld = true;
        
    };


    draw(ctx) {

        console.log("drawing bullet");
        ctx.save();
        //ctx.translate(this.xCanvas, this.yCanvas);
        if(this.range < 95) this.animations.drawFrame(this.game.clockTick, ctx, this.xCanvas-(this.spriteWidth/2), this.yCanvas-(this.spriteWidth/2), this.SCALE);
        ctx.restore();
    };
};