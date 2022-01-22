class Goop {
    constructor(game) {
        this.game = game;
        this.game.alien = this;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/goop.png");
        
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin
        this.armed = "unarmed"; // armed or uarmed

        this.x = 100;
        this.y = 80;
        this.velocity = { x: 0, y: 0 };

        this.gun = new Gun(this.x, this.y, game);

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

        this.animations.get("left").get("walking").set("unarmed", new Animator(this.spritesheet, 0, 0, 390, 430, 8, .1));
        this.animations.get("left").get("vibing").set("unarmed", new Animator(this.spritesheet, 6240, 0, 390, 430, 8, .15));

        this.animations.get("right").get("walking").set("unarmed", new Animator(this.spritesheet, 3120, 0, 390, 430, 8, .07));
        this.animations.get("right").get("vibing").set("unarmed", new Animator(this.spritesheet, 9360, 0, 390, 430, 8, .15));
    };

    update() {
        const WALK = 4;
        const DIAGONAL = 2.8; // based on WALK speed: 4^2 = 2(a^2); where a = x = y
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
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.gun.update(this.velocity.x, this.velocity.y, this.game.mouseX, this.game.mouseY);

        // update the animation
        this.animation = this.animations.get(this.facing).get(this.state).get(this.armed);
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .3);
        this.gun.draw(ctx);
    };
};