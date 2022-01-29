class Goop {
    constructor(game, xStart, yStart) { // these starting locations should possibly be based on xMidpoint and yMidpoint of the sprite
        this.game = game;
        this.game.goop = this;

        this.game.goop.gun = this.game.gun;
        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/goop.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/goop2.png");

        this.scale = 3;
        this.spriteWidth = 39 * this.scale;
        this.spriteHeight = 43 * this.scale;

        if (this.game.camera.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;

        //this.alt_spritesheet = ASSET_MANAGER.getAsset("./sprites/grep.png");
        
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin
        this.armed = "unarmed"; // armed or uarmed

        this.xMap = xStart;
        this.yMap = yStart;

        this.velocity = { x: 0, y: 0 };

        this.animations = new Map;
        this.loadAnimations();

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
        const WALK = 6;
        const DIAGONAL = 4.24; // 4 -> 2.8 based on WALK speed: 4^2 = 2(a^2); where a = x = y
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

        // update the positions
        this.xMap += this.velocity.x;
        this.yMap += this.velocity.y;

        // update the animation
        this.animation = this.animations.get(this.facing).get(this.state).get(this.armed);
    };

    draw(ctx) {
        //ctx.save();
        //ctx.translate(-this.xMap+this.xStart, -this.yMap+this.xStart);//400 is half canvas width,300 height, - half player widthand height
        this.animation.drawFrame(this.game.clockTick, ctx, Math.floor(this.xMap-this.game.camera.x), Math.floor(this.yMap-this.game.camera.y), this.scale);
        //ctx.restore();
    };
};