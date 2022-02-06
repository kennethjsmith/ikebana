class Bullet {
    constructor(game, x, y) {
        this.game = game;
        this.speed = 30;
        this.range = 100; //how many updates, ie this bullet will travel speed*range
        this.removeFromWorld = false;
        

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bullet.png");
        this.SIZE = 12; // find better way to get this pizel width
        this.SCALE = 2;
        this.FLASHSCALE = 5;

        // adjust x and y so bullets start at gun, WHY is this not the proper x and y passed from constructor in gun????
        this.xFlash = x;
        this.yFlash = y;
        
        this.xMap = this.game.gun.xMap + (this.game.gun.spriteSize/2);
        this.yMap = this.game.gun.yMap + (this.game.gun.spriteSize/2);
        //TODO: trajectory would be better if calculated in gun and passed in
        // in a perfect worlt the trajectory would be the slope of the barrel and the barrel would be rotated to always point directly at the crosshair
        this.xDistance = this.game.crosshair.xMidpoint-(this.game.gun.xMap+(this.game.gun.spriteSize/2));
        this.yDistance = this.game.crosshair.yMidpoint-(this.game.gun.yMap+(this.game.gun.spriteSize/2));
       
        this.diagonal = Math.sqrt((this.xDistance*this.xDistance) + (this.yDistance*this.yDistance));
        
        this.xTrajectory = (this.xDistance/this.diagonal);
        this.yTrajectory = (this.yDistance/this.diagonal);
        
        this.xVelocity = this.speed*this.xTrajectory;
        this.yVelocity = this.speed*this.yTrajectory;
        
        this.game.ctx.fillRect(this.xMap,this.yMap,1,1);

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

        this.range--;
        if(this.range == 0) this.removeFromWorld = true;
        
    };


    draw(ctx) {
        //console.log("drawing bullet");
        //console.log("bullet x:"+ this.xMap+"bullet y:"+ this.yMap);
        
        ctx.save();
        //ctx.translate(this.xCanvas, this.yCanvas);
        //this.game.ctx.fillRect(this.xMap-this.game.camera.x,this.yMap-this.game.camera.y,1,1);

        if (this.range == 100) this.animations.drawFrame(this.game.clockTick, ctx, this.xFlash - this.game.camera.x - ((this.SIZE*this.FLASHSCALE)/2), this.yFlash - this.game.camera.y - ((this.SIZE*this.FLASHSCALE)/2), this.FLASHSCALE);
        if (this.range < 95) this.animations.drawFrame(this.game.clockTick, ctx, this.xMap - this.game.camera.x - this.spriteWidth/2, this.yMap - this.game.camera.y - this.spriteWidth/2, this.SCALE);
        ctx.restore();
    };
};