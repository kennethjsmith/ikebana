class Bullet {
    constructor(game, x, y, mouseX, mouseY) {

        this.speed = 10;
        this.range = 100; //how many updates, ie this bullet will travel speed*range
        this.removeFromWorld = false;
        this.game = game;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bullet.png");

        this.x = x;
        this.y = y;
        this.mouseX = mouseX;
        this.mouseY = mouseY;

        this.xDistance = (this.mouseX-this.x);
        this.yDistance = (this.mouseY-this.y);
        this.diagonal = Math.sqrt((this.xDistance*this.xDistance),(this.yDistance*this.yDistance));
        //console.log(this.xDistance);
        //console.log(this.diagonal);
    
        this.xVelocity = this.speed*(this.xDistance/this.diagonal);
        this.yVelocity = this.speed*(this.yDistance/this.diagonal);
        //console.log(this.xVelocity);
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
        console.log("moved");
        this.range--;
        if(this.range == 0) this.removeFromWorld = true;
        
    };


    draw(ctx) {
        this.animations.drawFrame(this.game.clockTick, ctx, this.x, this.y, 5);
    };
};