class Gun {
    constructor(type, game) {
        this.type = type;
        this.game = game;
        this.game.gun = this;

        this.uziGunSprite = ASSET_MANAGER.getAsset("./sprites/uzi.png");
        this.bubbleGunSprite = ASSET_MANAGER.getAsset("./sprites/bubble_gun.png");
        this.laserGunSprite = ASSET_MANAGER.getAsset("./sprites/laser.png");

        if (this.type == "uzi") this.spritesheet = this.uziGunSprite;
        else if (this.type == "bubble") this.spritesheet = this.bubbleGunSprite;
        else if (this.type == "laser") this.spritesheet = this.laserGunSprite;

        // if (this.game.camera.level == "level1") this.spritesheet = this.level1SpriteSheet;
        // else this.spritesheet = this.level2SpriteSheet;

        this.SIZE = 38; // num of pixels wide
        this.SCALE = 2;
        this.spriteSize = this.SIZE * this.SCALE;

        // offsets from corner of sprite image
        this.gripXOffset = this.spriteSize/2;
        this.gripYOffset = this.spriteSize/2;

        this.barrelMidXOffset = 19 * this.SCALE;
        this.barrelMidYOffset = 16 * this.SCALE;

        this.barrelTipXOffset = 34 * this.SCALE;
        this.barrelTipYOffset = 16 * this.SCALE;

        // this is the necesary offset from player location to put grips in players hand
        this.xMapOffset = (this.game.goop.handOffset.x - this.gripXOffset);
        this.yMapOffset = (this.game.goop.handOffset.y - this.gripYOffset);

        this.xMap = this.game.camera.startXPlayer + this.xMapOffset;
        this.yMap = this.game.camera.startYPlayer + this.yMapOffset;

        this.rotation = 0;
        this.alpha = 0;


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
        this.sprites.set("bubble", new Map);

        this.guncooldown = 0;

        this.damage = {
            "uzi" :  2,
            "bubble" : 1,
            "laser" : 5
        };             
    };

    update() {

        // move the gun to goops new location
        this.xMap += this.game.goop.velocity.x * this.game.clockTick;;
        this.yMap += this.game.goop.velocity.y * this.game.clockTick;;
        this.gripXMap += this.game.goop.velocity.x * this.game.clockTick;;
        this.gripYMap += this.game.goop.velocity.y * this.game.clockTick;;

        // this distance from grip to center of crosshair is used to calculate angle alpha
        let xDistToCross = this.game.crosshair.xMidpoint - this.gripXMap;
        let yDistToCross = this.game.crosshair.yMidpoint - this.gripYMap;
        let distToCross = Math.hypot(xDistToCross, yDistToCross);
        
        // as long as the crosshair is not inside the very small space between the barrel and grip, calculate the new rotation
        if(distToCross > this.smallR) {
            this.rotation = Math.atan2(((this.game.crosshair.yMidpoint) - (this.gripYMap)), ((this.game.crosshair.xMidpoint) - (this.gripXMap)));
            this.alpha = Math.asin(this.smallR/distToCross);
            this.rotation += this.alpha;
        } 

        this.barrelMidXOffsetFromGrip = (this.smallR*Math.sin(this.rotation));
        this.barrelMidYOffsetFromGrip = -(this.smallR*Math.cos(this.rotation));
        this.barrelMidXMap = this.gripXMap + this.barrelMidXOffsetFromGrip;
        this.barrelMidYMap = this.gripYMap + this.barrelMidYOffsetFromGrip;

        this.barrelTipXOffsetFromGrip = (this.bigR*Math.cos(this.rotation)) + this.barrelMidXOffsetFromGrip;
        this.barrelTipYOffsetFromGrip = (this.bigR*Math.sin(this.rotation)) + this.barrelMidYOffsetFromGrip;
        this.barrelTipXMap = this.gripXMap + this.barrelTipXOffsetFromGrip;
        this.barrelTipYMap = this.gripYMap + this.barrelTipYOffsetFromGrip;
    
       
        // add bullets if clicked, else simply decrement cooldown counter
        if (this.game.clicked) {
            if(this.type == "uzi") {
                if(this.guncooldown == 0){
                    this.game.addBullet(new Bullet("uzi", this.game));    
                    this.guncooldown = 10;
                }
                this.guncooldown--;  
            } else if (this.type == "bubble") {
                if(this.guncooldown == 0){
                    this.game.addBullet(new Bullet("bubble", this.game));    
                    this.guncooldown = 5;
                }
                this.guncooldown--;  
            } else if(this.type == "laser"){
                if(this.guncooldown == 0){
                    this.game.addBullet(new Beam(this.game));    
                    this.guncooldown = 50;
                } if (this.guncooldown > 1) this.guncooldown--;
            }
        }
        else if(!this.game.clicked){
            if (this.guncooldown > 0) this.guncooldown--;
        }
    };

    draw(ctx) {
        let offscreenCanvas = null;
        let degrees = Math.floor(this.rotation * (180/Math.PI));
        //console.log(degrees);
        
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

        if (!this.game.camera.lose) {
            // draw the fetched or newly created image
            ctx.drawImage(offscreenCanvas, this.xMap-this.game.camera.x, this.yMap-this.game.camera.y); 
        }

    };
};