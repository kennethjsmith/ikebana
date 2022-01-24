class Gun {
    constructor(type, game) {
        this.type = type;
        this.game = game;
        this.game.gun = this;

        this.x = 100 + 50;//(100,80) is goops starting location. (55,50) is the offset to the hand
        this.y = 80 + 50;
        this.rotation = 0;
        
        this.spritesheet = { gun: ASSET_MANAGER.getAsset("./sprites/gun.png"), 
                            uzi: ASSET_MANAGER.getAsset("./sprites/uzi.png")};

        this.guncooldown = 20;
        this.uzicooldown = 5;                   
        
        this.facing = "right"; // left or right
        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get("right");
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        if(this.type == "gun"){
            this.animations.set("left", new Animator(this.spritesheet.gun, 0, 0, 660, 360, 1, 1));
            this.animations.set("right", new Animator(this.spritesheet.gun, 660, 0, 660, 360, 1, 1));
        }
        else if(this.type == "uzi"){
            this.animations.set("left", new Animator(this.spritesheet.uzi, 0, 0, 660, 470, 1, 1));
            this.animations.set("right", new Animator(this.spritesheet.uzi, 660, 0, 660, 470, 1, 1));
        }
    };
    // update() {
    //     this.rotation = Math.atan2((this.game.mouse.x - this.x), -(this.game.mouse.y - this.y)); //Math.atan2(this.game. -x, -(this.game.mouse) );
    // }

    update() {

        this.x += this.game.goop.velocity.x;
        this.y += this.game.goop.velocity.y;

        if (this.rotation < -1.5 ){
            this.facing = "left";
        }
        else this.facing = "right";

        this.rotation = Math.atan2((this.game.mouseX - this.x), -(this.game.mouseY - this.y)) - Math.PI/2;
        // add alpha angle to rotation to aim gun barrel directly at cursor
        
        // this.rotation -= Math.atan2(Math.hypot((mouseX - this.x),(mouseY - this.y)),10);

        // update the animation
        //console.log(this.facing + this.rotation);
        if (this.game.clicked) {
            console.log("gun sees pressed");
            if(this.type == "gun"){
                if(this.guncooldown == 0){
                    console.log("adding gun bullet");
                    this.game.addEntity(new Bullet(this.game));    
                    this.guncooldown = 20;
                }
                this.guncooldown--;  
            }
            else if(this.type == "uzi") {
                if(this.uzicooldown == 0){
                    console.log("adding uzi bullet");
                    this.game.addEntity(new Bullet(this.game)); //TODO: can make this unshift or change order of entityconcat in game update
                                                                // BUT GUN MOVES WEIRD
                    //this.bullets.push(new Bullet(this.game, this.x, this.y, this.game.mouseX, this.game.mouseY));    
                    this.uzicooldown = 10;
                }
                this.uzicooldown--;  
            }

        }
        else if(!this.game.clicked){
             if(this.type == "gun" && this.guncooldown > 0) this.guncooldown--;
             else if(this.type == "uzi" && this.uzicooldown > 0) this.uzicooldown--;
        }


        this.animation = this.animations.get(this.facing);

        // this.bullets.forEach(bullet => {
        //     bullet.update();
        //     if (bullet.removeFromWorld){
        //         const index = this.bullets.indexOf(bullet);
        //         if (index > -1) {
        //             this.bullets.splice(index, 1);
        //         }      
        //     }
        // });
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

        // this.bullets.forEach(bullet => {
        //     bullet.draw(ctx);
        // });

    };
};