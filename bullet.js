class Bullet {
    constructor(game) {
        this.game = game;
        this.speed = 10;
        this.range = 100; //how many updates, ie this bullet will travel speed*range
        this.removeFromWorld = false;
        

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bullet.png");
        this.SIZE = 12; // find better way to get this pizel width
        this.SCALE = 5;

        // adjust x and y so bullets start at gun, WHY is this not the proper x and y passed from constructor in gun????
        this.x = this.game.goop.gun.x + 55;
        this.y = this.game.goop.gun.y + 30;

        this.xDistance = (this.game.mouseX-this.x);
        this.yDistance = (this.game.mouseY-this.y);
       
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
        this.x += this.xVelocity;// * this.game.clockTick);
        this.y += this.yVelocity;// * this.game.clockTick);
        this.range--;
        if(this.range == 0) this.removeFromWorld = true;
        
    };


    draw(ctx) {
        console.log("should be drawing bullet");
        // dont draw until bullet is past gun barrel, this is def hacky
        if(this.range < 95) this.animations.drawFrame(this.game.clockTick, ctx, this.x-(this.spriteWidth/2), this.y-(this.spriteWidth/2), this.SCALE);
    };
};