class Gun {
    constructor(type, game) {
        this.type = type;
        this.game = game;
        this.game.gun = this;

        this.facing = "right"; // left or right

        this.xMap = this.game.camera.startXPlayer;
        this.yMap = this.game.camera.startYPlayer;
        //barrel tip for bullet spawn
        // this.xBarrelTipCanvas = this.xCanvas+55;
        // this.yBarrelTipCanvas = this.yCanvas+30;
        // this.xBarrelTipMap = this.xMap+55;
        // this.yBarrelTipMap = this.yMap+30;


        // if(this.facing == "right"){
        //     this.xBarrelTip = this.xCanvas +50;
        //     this.yBarrelCanvas = 100;
        // }
        // else{a
        //     this.xBarrelCanvas = 400;
        //     this.yBarrelCanvas = 300;
        // }


        this.rotation = 0;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/guns.png");
        this.scale = 3;

        this.guncooldown = 20;
        this.uzicooldown = 5;                   
        
        
        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get("right");
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        if(this.type == "uzi"){
            this.animations.set("left", new Animator(this.spritesheet, 0, 0, 38, 38, 1, 1));
            this.animations.set("right", new Animator(this.spritesheet, 38, 0, 38, 38, 1, 1));
        }
        else if(this.type == "laser"){
            this.animations.set("left", new Animator(this.spritesheet, 76, 0, 38, 38, 1, 1));
            this.animations.set("right", new Animator(this.spritesheet, 114, 0, 38, 38, 1, 1));
        }
    };
    // update() {
    //     this.rotation = Math.atan2((this.game.mouse.x - this.x), -(this.game.mouse.y - this.y)); //Math.atan2(this.game. -x, -(this.game.mouse) );
    // }

    update() {

    //     // point right or left based on relatived location of crosshair
    //     // if (this.facing == "right" && this.game.crosshair.xMap-(this.game.crosshair.spriteWidth/2) < 385){
    //     //     this.facing = "left";
    //     // }
    //     // else if (this.facing == "left" && this.game.crosshair.xCanvas-(this.game.crosshair.spriteWidth/2) >= 385){
    //     //     this.facing = "right";
    //     // }

    //     this.rotation = Math.atan2((this.game.mouseX - this.xMap), -(this.game.mouseY - this.yMap)) - Math.PI/2;
    //     // add alpha angle to rotation to aim gun barrel directly at cursor
        
        this.rotation -= Math.atan2(Math.hypot((this.game.mouseX - this.xMap),(this.game.mouseY - this.yMap)),10);

    //     // update the animation
    //     //console.log(this.facing + this.rotation);
    //     if (this.game.clicked) {
    //         console.log("gun sees pressed");
    //         if(this.type == "gun"){
    //             if(this.guncooldown == 0){
    //                 //console.log("adding gun bullet");
    //                 //this.game.addEntity(new Bullet(this.game));    
    //                 this.guncooldown = 20;
    //             }
    //             this.guncooldown--;  
    //         }
    //         else if(this.type == "uzi") {
    //             if(this.uzicooldown == 0){
    //                 //console.log("adding uzi bullet");
    //                 //this.game.addEntity(new Bullet(this.game)); //TODO: can make this unshift or change order of entityconcat in game update
    //                                                             // BUT GUN MOVES WEIRD
    //                 //this.bullets.push(new Bullet(this.game, this.x, this.y, this.game.mouseX, this.game.mouseY));    
    //                 this.uzicooldown = 10;
    //             }
    //             this.uzicooldown--;  
    //         }

    //     }
    //     else if(!this.game.clicked){
    //          if(this.type == "gun" && this.guncooldown > 0) this.guncooldown--;
    //          else if(this.type == "uzi" && this.uzicooldown > 0) this.uzicooldown--;
    //     }
    //     this.animation = this.animations.get(this.facing);

    //     // this.bullets.forEach(bullet => {
    //     //     bullet.update();
    //     //     if (bullet.removeFromWorld){
    //     //         const index = this.bullets.indexOf(bullet);
    //     //         if (index > -1) {
    //     //             this.bullets.splice(index, 1);
    //     //         }      
    //     //     }
    //     // });
    };

    move(x,y){
        this.xMap = x;
        this.yMap = y;
    };

    draw(ctx) {
    //     //ctx.rotate(this.rotation);
    //     // if(this.facing == "right"){
    //     //      ctx.rotate(this.rotation);
    //     // }
    //     // left facing gun needs additional pi rotation
    //     // if(this.facing == "left"){
    //     //     this.rotation -= Math.PI;
    //     //     ctx.rotate(this.rotation);
    //     //     this.rotation += Math.PI;
    //     // }
    //     //ctx.translate(this.xCanvas, this.yCanvas);





        let offscreenCanvas = document.createElement('canvas')                                                              
        let dimension = 38 * this.scale;
        offscreenCanvas.width = dimension;
        offscreenCanvas.height = dimension;
        let offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.imageSmoothingEnabled = true;
        offscreenCtx.save();
        offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
        offscreenCtx.rotate(this.rotation);
        offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);

        
        this.animation.drawFrame(this.game.clockTick, ctx, this.xMap-this.game.camera.x, this.yMap-this.game.camera.y, this.scale);
        offscreenCtx.restore();
        // this.bullets.forEach(bullet => {
        //     bullet.draw(ctx);
        // });
    };
};