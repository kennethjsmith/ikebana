class Gun {
    constructor(type, game) {
        this.type = type;
        this.game = game;
        this.game.gun = this;

        // this is the necesary offset from player location to put grip in players hand
        // these values are calculated as distance to goops hand (x:32,y:27) minus gripOffsets, times SCALE
        this.yMapOffset = 24;
        this.xMapOffset = 39;
        this.xMap = this.game.camera.startXPlayer + this.xMapOffset;
        this.yMap = this.game.camera.startYPlayer + this.yMapOffset;

        this.rotation = 0;
        this.alpha = 0;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/uzi.png");
        this.SIZE = 38; // num of pixels wide
        this.SCALE = 3;
        this.spriteSize = this.SIZE * this.SCALE;

        // offsets from corner of sprite image
        this.gripXOffset = 19 * this.SCALE;
        this.gripYOffset = 19 * this.SCALE;

        this.barrelMidXOffset = 19 * this.SCALE;
        this.barrelMidYOffset = 16 * this.SCALE;

        this.barrelTipXOffset = 34 * this.SCALE;
        this.barrelTipYOffset = 16 * this.SCALE;

        // radius/distance between 3 critical points
        // TODO: this calculation would look better if we didnt have to unscale every property
        // the needed values (used to calculate the scaled offsets, 19... 16 etc) should be got from enumerated type in weapons.js
        this.smallR = ((this.gripYOffset/this.SCALE)-(this.barrelMidYOffset/this.SCALE)) * this.SCALE; // grip to barrelMid
        this.bigR = ((this.barrelTipXOffset/this.SCALE)-(this.barrelMidXOffset/this.SCALE)) * this.SCALE; //barrelMid to barrelTip
        //this.smallR = 3 * this.SCALE;
        //this.bigR = 15 * this.SCALE; //about

        // cartesian coordinates in game
        this.gripXMap = this.xMap + this.gripXOffset;
        this.gripYMap = this.yMap + this.gripYOffset;

        this.barrelMidXMap = this.gripXMap;
        this.barrelMidYMap = this.gripYMap - this.smallR;

        this.barrelTipXMap = this.gripXMap + this.bigR;
        this.barrelTipYMap = this.gripYMap - this.smallR;

        this.sprites = new Map;
        this.sprites.set("uzi", new Map);
        this.sprites.set("laser", new Map);

        this.guncooldown = 20;
        this.uzicooldown = 0;                   

    };

    update() {

        // move the gun to goops new location
        this.xMap += this.game.goop.velocity.x;
        this.yMap += this.game.goop.velocity.y;
        this.gripXMap += this.game.goop.velocity.x;
        this.gripYMap += this.game.goop.velocity.y;
        // this.barrelMidXMap = this.game.goop.velocity.x;
        // this.barrelMidYMap = this.game.goop.velocity.y;
        // this.barrelTipXMap = this.game.goop.velocity.x;
        // this.barrelTipYMap = this.game.goop.velocity.y;

        // this distance from grip to center of crosshair is used to calculate angle alpha
        let xDistToCross = this.game.crosshair.xMidpoint - this.gripXMap;
        let yDistToCross = this.game.crosshair.yMidpoint - this.gripYMap;
        let distToCross = Math.hypot(xDistToCross, yDistToCross);
        
        // as long as the crosshair is not inside the very small space between the barrel and grip, calculate the new rotation
        if(distToCross > this.smallR) {
            this.rotation = Math.atan2(((this.game.crosshair.yMidpoint) - (this.gripYMap)), ((this.game.crosshair.xMidpoint) - (this.gripXMap)));
            this.alpha = Math.asin(this.smallR/distToCross);
            //if(this.rotation > -Math.PI/2 || this.rotation < Math.PI/2) this.alpha = Math.asin(this.smallR/distToCross);
            //else this.alpha = Math.asin(-this.smallR/distToCross);
            this.rotation += this.alpha;
        } 

        // calculate the new barrel offsets and map locaions
        //if (this.rotation > -Math.PI/2 || this.rotation < Math.PI/2) {
            this.barrelMidXOffsetFromGrip = (this.smallR*Math.sin(this.rotation));
            this.barrelMidYOffsetFromGrip = -(this.smallR*Math.cos(this.rotation));
            this.barrelMidXMap = this.gripXMap + this.barrelMidXOffsetFromGrip;
            this.barrelMidYMap = this.gripYMap + this.barrelMidYOffsetFromGrip;

            this.barrelTipXOffsetFromGrip = (this.bigR*Math.cos(this.rotation)) + this.barrelMidXOffsetFromGrip;
            this.barrelTipYOffsetFromGrip = (this.bigR*Math.sin(this.rotation)) + this.barrelMidYOffsetFromGrip;
            this.barrelTipXMap = this.gripXMap + this.barrelTipXOffsetFromGrip;
            this.barrelTipYMap = this.gripYMap + this.barrelTipYOffsetFromGrip;
        // } 
        // else {
        //     this.barrelMidXOffsetFromGrip = (-this.smallR*Math.sin(this.rotation));
        //     this.barrelMidYOffsetFromGrip = -(-this.smallR*Math.cos(this.rotation));
        //     this.barrelMidXMap = this.gripXMap + this.barrelMidXOffsetFromGrip;
        //     this.barrelMidYMap = this.gripYMap + this.barrelMidYOffsetFromGrip;

        //     this.barrelTipXOffsetFromGrip = (this.bigR*Math.cos(this.rotation)) + this.barrelMidXOffsetFromGrip;
        //     this.barrelTipYOffsetFromGrip = (this.bigR*Math.sin(this.rotation)) + this.barrelMidYOffsetFromGrip;
        //     this.barrelTipXMap = this.gripXMap + this.barrelTipXOffsetFromGrip;
        //     this.barrelTipYMap = this.gripYMap + this.barrelTipYOffsetFromGrip;
        // }
       
        // add bullets if clicked, else simply decrement cooldown counter
        if (this.game.clicked) {
            if(this.type == "laser"){
                if(this.guncooldown == 0){
                    //this.game.addEntity(new Bullet(this.game));    
                    this.guncooldown = 20;
                }
                this.guncooldown--;  
            }
            else if(this.type == "uzi") {
                if(this.uzicooldown == 0){
                    this.game.addBullet(new Bullet(this.game));    
                    this.uzicooldown = 10;
                }
                this.uzicooldown--;  
            }
        }
        else if(!this.game.clicked){
             if(this.type == "laser" && this.guncooldown > 0) this.guncooldown--;
             else if(this.type == "uzi" && this.uzicooldown > 0) this.uzicooldown--;
        }
    };

    draw(ctx) {
        let offscreenCanvas = null;
        let offscreenCanvas2 = null;
        let degrees = Math.floor(this.rotation * (180/Math.PI));
        console.log(degrees);
        
        // if the gun image is already cached, then fetch it
        if (this.sprites.get(this.type).has(degrees)) {
            offscreenCanvas = this.sprites.get(this.type).get(degrees).image;
        } 
        // else draw the new gun rotation on offscreen canvas and cache in sprites map
        else {
            offscreenCanvas = document.createElement('canvas')                                                              
            offscreenCanvas.width = (this.spriteSize);
            offscreenCanvas.height = (this.spriteSize);
            let offscreenCtx = offscreenCanvas.getContext('2d');
            offscreenCtx.imageSmoothingEnabled = false;
            offscreenCtx.save();
            offscreenCtx.translate(this.gripXOffset, this.gripYOffset);
            offscreenCtx.rotate(this.rotation);
            //if(this.rotation - this.alpha < -Math.PI/2 || this.rotation - this.alpha > Math.PI/2) offscreenCtx.scale(1,-1);
            offscreenCtx.translate(-this.gripXOffset, -this.gripYOffset);     
            offscreenCtx.drawImage(this.spritesheet, 0, 0, this.SIZE, this.SIZE, 0, 0,this.spriteSize,this.spriteSize);
            offscreenCtx.restore();
            // FOR DEBUGING GUN TRIGONOMETRY: draws points on critical locations (grip, barrelMid, barrelTip)
            //offscreenCtx.fillRect(this.gripXOffset, this.gripYOffset,1,1);
            //offscreenCtx.fillRect(this.barrelMidXMap - this.xMap, this.barrelMidYMap - this.yMap,1,1);
            //offscreenCtx.fillRect(this.barrelTipXMap - this.xMap, this.barrelTipYMap - this.yMap,1,1);
            this.sprites.get(this.type).set(degrees, { image: offscreenCanvas });  
        }
        // draw the fetched or newly created image
        ctx.drawImage(offscreenCanvas, this.xMap-this.game.camera.x, this.yMap-this.game.camera.y); 
    };
};