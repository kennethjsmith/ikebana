class Gun {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/gun.png");
        
        this.facing = "right"; // left or right

        this.x = x + 55;
        this.y = y + 50;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get("right");
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        this.animations.set("left", new Animator(this.spritesheet, 0, 0, 660, 360, 1, 1));
        this.animations.set("right", new Animator(this.spritesheet, 660, 0, 660, 360, 1, 1));
    };

    update(mouse) {
        this.rotation = Math.atan2((mouse.x - this.x), -(mouse.y - this.y)); //Math.atan2(this.game. -x, -(this.game.mouse) );
    }

    update(x, y, facing, mouseX, mouseY) {
        this.x += x;
        this.y += y;
        if (this.rotation < -1.5 ){
            this.facing = "left";
        }
        else this.facing = "right";

        this.rotation = Math.atan2((mouseX - this.x), -(mouseY - this.y)) - Math.PI/2;
        // add alpha angle to rotation to aim gun barrel directly at cursor
        // this.rotation -= Math.atan2(Math.hypot((mouseX - this.x),(mouseY - this.y)),40);

        // update the animation
        console.log(this.facing + this.rotation);
        this.animation = this.animations.get(this.facing);
    };

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x+50,this.y+25);
  
        if(this.facing == "right"){
             ctx.rotate(this.rotation);
        }
        // left facing gun needs additional pi rotation
        if(this.facing == "left"){
            this.rotation -= Math.PI;
            ctx.rotate(this.rotation);
            this.rotation += Math.PI;
        }
        
        this.animation.drawFrame(this.game.clockTick, ctx, -50, -25, .15);
        ctx.restore();
    };
};