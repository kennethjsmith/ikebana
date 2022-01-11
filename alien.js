class Alien {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/unarmed_alien.png");
        
        // alien's state variables
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibin
        this.armed = "unarmed"; // armed or uarmed

        this.x = 100;
        this.y = 100;
        // this.z

        this.speed = 4;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get("right").get("walking").get("unarmed");
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
        // update speed
        // update position
        // update armed or unarmed
        console.log(this.facing)
        if (this.facing == "right"){
            console.log("here1")
            this.x += this.speed + this.game.clockTick;
            if (this.x > 512) {
                this.facing = "left";
                this.animation = this.animations.get("left").get("walking").get("unarmed");
            }
        }
        else{
            console.log("here2")
            this.x -= this.speed + this.game.clockTick;
            if (this.x < 100) {
                this.facing = "right";
                this.animation = this.animations.get("right").get("walking").get("unarmed");
            }
        }
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .25);
    };
};