class Slime {
    constructor(game, x, y) {
        this.game = game;

        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/slime.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/slime2.png");

        if (this.game.camera.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;        
        this.scale = 2.5;

        // alien's state variables
        this.facing = "right"; // left or right
        this.state = "walking"; // walking or vibin
        this.spriteHeight = 16 * this.scale;
        this.spriteWidth = 16 * this.scale;
        this.shadowHeight = 2 * this.scale;

        this.xMap = x;
        this.yMap = y;
        this.speed = 3;
        this.velocity = { x: this.randomDirection(), y: this.randomDirection() }
        while (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity = { x: this.randomDirection(), y: this.randomDirection() };
        }
        this.updateBoundingBox();


        this.animations = new Map;
        this.loadAnimations();
        this.animation = this.animations.get("left").get("vibing");

    };

    randomDirection() {
        let choice = floor(Math.random() * 2);
        switch (choice) {
            case 0:
                return -this.speed;
            case 1:
                return this.speed;
            case 2: 
                return this.speed;
        }
    };


    loadAnimations() {
        this.animations.set("left", new Map);
        this.animations.set("right", new Map);

        this.animations.get("left").set("walking", new Animator(this.spritesheet, 0, 0, 16, 16, 10, .08));
        this.animations.get("left").set("vibing", new Animator(this.spritesheet, 0, 0, 16, 16, 10, .08));
    //    this.animations.get("left").set("dying", new Animator(this.spritesheet, 8, 30, 16, 16, 10, .12));  // fix this

        this.animations.get("right").set("walking", new Animator(this.spritesheet, 160, 0, 16, 16, 10, .08));
        this.animations.get("right").set("vibing", new Animator(this.spritesheet, 160, 0, 16, 16, 10, .08));
       // this.animations.get("right").set("dying", new Animator(this.spritesheet, 320, 30, 32, 27.5, 10, .12));  // fix this

    };

    update() {
        //const WALK = 5;
        //const DIAGONAL = 2;
        const WALK = this.speed;
        const DIAGONAL = Math.sqrt(Math.pow(this.speed, 2) / 2); //  based on WALK speed: 1^2 = 2(a^2); where a = x = y

       

        // collisions with other entities
        this.game.entities.forEach(entity => {
            if (entity instanceof Slime && entity != this) {
                if (this.boundingBox.getXProjectedBB(this.velocity.x).collide(entity.boundingBox)) {
                    this.velocity.x = -this.velocity.x;
                    this.velocity.y = this.randomDirection();
                } else if (this.boundingBox.getYProjectedBB(this.velocity.y).collide(entity.boundingBox)) {
                    this.velocity.y = -this.velocity.y;
                    this.velocity.x = this.randomDirection();
                } 
            }
        });
         // a list of tiles to draw on top of slime
        //this.tilesToDrawOnTop = [];

        // handle wall collissions
        this.game.spriteGrid.forEach( row => {
            row.forEach( tile => {
                let type = tile.type;
                let xProjectedBB = this.boundingBox.getXProjectedBB(this.velocity.x);
                let yProjectedBB = this.boundingBox.getYProjectedBB(this.velocity.y);

                if (type == "wall" || type == "north_wall") {
                    if (xProjectedBB.collide(tile.BB) && (!yProjectedBB.collide(tile.BB))) {
                            this.velocity.x = -this.velocity.x;
                            this.velocity.y = this.randomDirection();
                    } else if ((!xProjectedBB.collide(tile.BB)) && (yProjectedBB.collide(tile.BB))) {
                            this.velocity.y = -this.velocity.y;
                            this.velocity.x = this.randomDirection();
                    } else if (xProjectedBB.collide(tile.BB) && yProjectedBB.collide(tile.BB)) {
                        this.velocity.x = -this.velocity.x;
                        this.velocity.y = -this.velocity.y;
                    }
                } else if (type == "south_wall") {
                    if (xProjectedBB.collide(tile.BB.lower) && !(yProjectedBB.collide(tile.BB.lower))) {
                            this.velocity.x = -this.velocity.x;
                            this.velocity.y = this.randomDirection();
                    } else if (!(xProjectedBB.collide(tile.BB.lower)) && (yProjectedBB.collide(tile.BB.lower))) {
                            this.velocity.y = -this.velocity.y;
                            this.velocity.x = this.randomDirection();
                    } else if (xProjectedBB.collide(tile.BB.lower) && yProjectedBB.collide(tile.BB.lower)) {
                        this.velocity.x = -this.velocity.x;
                        this.velocity.y = -this.velocity.y;
                    }
                }
                    
                    // add tiles to draw on top
                   // if (type == "south_wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB.upper)) this.tilesToDrawOnTop.push(tile); // this will always redraw the tile
                   // if (type == "wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB)) this.tilesToDrawOnTop.push(tile); // this will always redraw the tile
                   // if (type == "north_wall" && this.boundingBox.getProjectedBigBB().collide(tile.BB) && this.boundingBox.top < tile.BB.bottom) this.tilesToDrawOnTop.push(tile);
                
            });
        });


        
        // update velocity if they are moving diagnolly
        if (this.velocity.x != 0 && this.velocity.y != 0) {
            this.velocity.x = this.velocity.x > 0 ? DIAGONAL : -DIAGONAL;
            this.velocity.y = this.velocity.y > 0 ? DIAGONAL : -DIAGONAL;
        } else {
            if (this.velocity.x != 0) this.velocity.x = this.velocity.x > 0 ? WALK : -WALK;
            if (this.velocity.y != 0) this.velocity.y = this.velocity.y > 0 ? -WALK : WALK;
        }

        // update the positions
        this.xMap += this.velocity.x;
        this.yMap += this.velocity.y;
        this.updateBoundingBox();

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
        this.animation = this.animations.get(this.facing).get(this.state);
    };

    updateBoundingBox() {
        this.boundingBox = new BoundingBox(this.xMap, this.yMap, this.spriteWidth, this.spriteHeight - this.shadowHeight);
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.scale);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(Math.floor(this.boundingBox.left - this.game.camera.x), Math.floor(this.boundingBox.top - this.game.camera.y), this.spriteWidth, this.spriteHeight - this.shadowHeight);
       
    };
};