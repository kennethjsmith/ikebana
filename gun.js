class Gun {
    constructor(type, game) {
        this.count = 0;

        this.type = type;
        this.game = game;
        this.game.gun = this;

        this.facing = "right"; // left or right

        this.mapOffset = 25;
        this.additionalMapOffset = 40;
    
        console.log("" + this.game.camera.startXPlayer)
        this.xMap = this.game.camera.startXPlayer + this.mapOffset;
        this.yMap = this.game.camera.startYPlayer + this.mapOffset;

        this.rotation = 0;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/guns.png");
        this.SIZE = 38; // num of pixels wide
        this.SCALE = 3;
        this.spriteSize = this.SIZE * this.SCALE;

        this.sprites = new Map;
        this.sprites.set("uzi", new Map);
        this.sprites.get("uzi").set("left", new Map);
        this.sprites.get("uzi").set("right", new Map);
        this.sprites.set("laser", new Map);
        this.sprites.get("laser").set("left", new Map);
        this.sprites.get("laser").set("right", new Map);

        this.guncooldown = 20;
        this.uzicooldown = 5;                   

    };

    update() {

    //     // point right or left based on relatived location of crosshair
    //     // if (this.facing == "right" && this.game.crosshair.xMap-(this.game.crosshair.spriteWidth/2) < 385){
    //     //     this.facing = "left";
    //     // }
    //     // else if (this.facing == "left" && this.game.crosshair.xCanvas-(this.game.crosshair.spriteWidth/2) >= 385){
    //     //     this.facing = "right";
    //     // }

    console.log("PI: "+ Math.PI/4);
    // console.log("mouse y: " + this.game.mouseY)
    // console.log("mouse x: " + this.game.mouseX)
    console.log("xmap: " + this.xMap);
    console.log("yMap: " + this.yMap);
    this.rotation = Math.atan2((this.game.crosshair.yMap - this.yMap), (this.game.crosshair.xMap - this.xMap)) + Math.PI/4;
    //     // add alpha angle to rotation to aim gun barrel directly at cursor
        
        //this.rotation -= Math.atan2(Math.hypot((this.game.mouseX - this.xMap),(this.game.mouseY - this.yMap)),10);

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

        this.xMap = x + this.mapOffset;
        this.yMap = y + this.mapOffset;
    };

    draw(ctx) {
        //ctx.rotate(this.rotation);
        // if(this.facing == "right"){
        //      ctx.rotate(this.rotation);
        // }
        // left facing gun needs additional pi rotation
        // if(this.facing == "left"){
        //     this.rotation -= Math.PI;
        //     ctx.rotate(this.rotation);
        //     this.rotation += Math.PI;
        // }
        //ctx.translate(this.xCanvas, this.yCanvas);


        let offscreenCanvas = null;
        let degrees = Math.floor(this.rotation * (180/Math.PI));
        console.log("degrees: " + degrees + ", radians: " + this.rotation);


        if (this.sprites.get("uzi").get("left").has(degrees)) {
            offscreenCanvas = this.sprites.get("uzi").get("left").get(degrees);
        } else {
            this.count++;
            // create the canvas with the rotated image
            offscreenCanvas = document.createElement('canvas')                                                              
            offscreenCanvas.width = (2*(this.spriteSize / 3)*2);
            console.log("canvas width: " + offscreenCanvas.width)
            offscreenCanvas.height = (2*(this.spriteSize / 3)*2);
            let offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.imageSmoothingEnabled = false;
            offscreenCtx.save();
            offscreenCtx.translate(2*(this.spriteSize / 3), this.spriteSize / 2);
            offscreenCtx.rotate(this.rotation);
            offscreenCtx.translate(-2*(this.spriteSize / 3), -this.spriteSize / 2);     
                
            offscreenCtx.drawImage(this.spritesheet, this.SIZE, 0, this.SIZE, this.SIZE, 10, 10,this.spriteSize,this.spriteSize)
            offscreenCtx.restore();
            this.sprites.get("uzi").get("left").set(degrees, offscreenCanvas);
        }
        console.log(this.count);

        ctx.drawImage(offscreenCanvas, this.xMap-this.game.camera.x, this.yMap-this.game.camera.y);
        //this.animation.drawFrame(this.game.clockTick, ctx, this.xMap-this.game.camera.x, this.yMap-this.game.camera.y, this.SCALE);
        



        // this.bullets.forEach(bullet => {
        //     bullet.draw(ctx);
        // });
    };
};