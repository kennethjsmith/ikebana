class Goop {
    constructor(game) { // these starting locations should possibly be based on xMidpoint and yMidpoint of the sprite
        this.game = game;
        this.game.goop = this;

        this.game.goop.gun = this.game.gun;
        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/goop.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/goop2.png");

        this.SCALE = 2;
        this.xMap = this.game.camera.startXPlayer;
        this.yMap = this.game.camera.startYPlayer;
        this.handOffset = { x: 32*this.SCALE, y: 27*this.SCALE };
        this.spriteWidth = 39 * this.SCALE;
        this.spriteHeight = 43 * this.SCALE;
        this.heightOffset = this.spriteHeight / 2;
        this.widthOffset = this.spriteWidth / 2;
        this.midpoint = {x: this.xMap + this.widthOffset, y: this.yMap + this.heightOffset };

        if (this.game.camera.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;

        //this.alt_spritesheet = ASSET_MANAGER.getAsset("./sprites/grep.png");
        
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin
        this.armed = "unarmed"; // armed or uarmed
        this.dead = false;
        this.hurt = false;

        this.velocity = { x: 0, y: 0 };

        this.animations = new Map;

        this.loadAnimations();
        this.updateBoundingBox();
        this.animation = this.animations.get("right").get("vibing").get("unarmed");
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        this.animations.set("left", new Map);
        this.animations.set("right", new Map);

        this.animations.get("left").set("walking", new Map);
        this.animations.get("left").set("vibing", new Map);

        this.animations.get("right").set("walking", new Map);
        this.animations.get("right").set("vibing", new Map);

        this.animations.get("left").get("walking").set("unarmed", new Animator(this.spritesheet, 0, 0, 39, 43, 8, .1));
        this.animations.get("left").get("vibing").set("unarmed", new Animator(this.spritesheet, 624, 0, 39, 43, 8, .15));

        this.animations.get("right").get("walking").set("unarmed", new Animator(this.spritesheet, 312, 0, 39, 43, 8, .1));
        this.animations.get("right").get("vibing").set("unarmed", new Animator(this.spritesheet, 936, 0, 39, 43, 8, .15));
    };



    update() {
        const WALK = 7;
        const DIAGONAL = 4.95;
       // const WALK = 7;
       // const DIAGONAL = 4.95; // 4 -> 2.8 based on WALK speed: 4^2 = 2(a^2); where a = x = y
        this.velocity.x = 0;
        this.velocity.y = 0;

        // update the velocity
        // evaluates to (left XOR right) AND (up XOR down)
        if ((this.game.left ? !this.game.right : this.game.right) && (this.game.up ? !this.game.down : this.game.down)) {
            this.velocity.x = (this.game.left) ? -DIAGONAL : DIAGONAL;
            this.velocity.y = (this.game.up) ? -DIAGONAL : DIAGONAL;
        } else {
            if (this.game.left) this.velocity.x += -WALK;
            if (this.game.right) this.velocity.x += WALK;
            if (this.game.up) this.velocity.y += -WALK;
            if (this.game.down) this.velocity.y += WALK;
        }

        // check for wall collisions
        let collisionOccurred = false;
        this.game.spriteGrid.forEach( row => {
            row.forEach( tile => {
                let type = tile.type;
                if (type == "north_wall" && this.boundingBox.getXProjectedBB(this.velocity.x).collide(tile.BB)) this.velocity.x = 0;
                if (type == "north_wall" && this.boundingBox.getYProjectedBB(this.velocity.y).collide(tile.BB)) this.velocity.y = 0;
                if (type == "wall" && this.boundingBox.getXProjectedBB(this.velocity.x).collide(tile.BB)) this.velocity.x = 0;
                if (type == "wall" && this.boundingBox.getYProjectedBB(this.velocity.y).collide(tile.BB)) this.velocity.y = 0;
                if (type == "south_wall" && this.boundingBox.getXProjectedBB(this.velocity.x).collide(tile.BB.lower)) this.velocity.x = 0;
                if (type == "south_wall" && this.boundingBox.getYProjectedBB(this.velocity.y).collide(tile.BB.lower)) this.velocity.y = 0;
                // add tiles to draw on top                
                if (type == "south_wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB.upper)) this.game.tilesToDrawOnTop.push(tile); // this will always redraw the tile
                if (type == "wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB)) this.game.tilesToDrawOnTop.push(tile); // this will always redraw the tile
                if (type == "north_wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB) && this.boundingBox.top < tile.BB.bottom) this.game.tilesToDrawOnTop.push(tile);
            });
        });
       

        // update the positions
        this.xMap += this.velocity.x;
        this.yMap += this.velocity.y;
        this.game.crosshair.xMap += this.velocity.x;
        this.game.crosshair.yMap += this.velocity.y;

        this.updateBoundingBox();

        
        this.game.camera.update();
        this.game.crosshair.update();
        this.gun.update();

        // NOTE: this might need to be moved inside of the above !collisionOccurred block as well
        // update the states
        if (this.velocity.x > 0) {
            this.facing = "right";
            this.state = "walking";
        } else if (this.velocity.x < 0) {
            this.facing = "left";
            this.state = "walking";
        } else if (this.velocity.y != 0) {
            this.state = "walking";
        } else if (this.velocity.x == 0 && this.velocity.y == 0) {
            this.state = "vibing";
        } else {
            
        }

        // update the animation
        this.animation = this.animations.get(this.facing).get(this.state).get(this.armed);
        this.midpoint = {x: this.xMap + this.widthOffset, y: this.yMap + this.heightOffset };

    };

    draw(ctx) {
        //ctx.save();
        //ctx.translate(-this.xMap+this.xStart, -this.yMap+this.xStart);//400 is half canvas width,300 height, - half player widthand height
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.SCALE);
        //ctx.restore();
        //drawBoundingBox(this.hurtBox, ctx, this.game, "red");
        //drawBoundingBox(this.boundingBox, ctx, this.game, "white");

        ctx.strokeStyle = 'red';
        ctx.strokeRect(Math.floor(this.midpoint.x - this.game.camera.x), Math.floor(this.midpoint.y - this.game.camera.y), 2, 2);
       
        
       
    };

    updateBoundingBox() {
        this.hurtBox = new BoundingBox(this.xMap, this.yMap, this.spriteWidth, this.spriteHeight);
        this.boundingBox = new BoundingBox(this.xMap+5, this.yMap + 2*(this.spriteHeight/3), this.spriteWidth-10, this.spriteHeight/3);//+5 x, -10 width for narrower box
    };
};