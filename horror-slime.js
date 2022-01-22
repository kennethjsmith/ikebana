class HorrorSlime {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/horror_slime.png");
        
        // alien's state variables
        this.facing = "right"; // left or right
        this.state = "vibing"; // walking or vibing
        this.deathClock = 90; //TODO: I DONT KNOW WHY THIS UPDATES 55 TIMES FOR 8 FRAMES

        this.x = 100;
        this.y = 300;
        // this.z

        //this.speed = 2.5;
        this.speed = 0;

        this.animations = new Map;
        this.loadAnimations();

        this.animation = this.animations.get(this.facing).get(this.state);
        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration) {

    };

    loadAnimations() {
        this.animations.set("left", new Map);
        this.animations.set("right", new Map);

        this.animations.get("left").set("walking", new Animator(this.spritesheet, 0, 0, 240, 210, 6, .12));
        this.animations.get("left").set("vibing", new Animator(this.spritesheet, 2880, 0, 240, 210, 5, .12));
       
        this.animations.get("right").set("walking", new Animator(this.spritesheet, 1440, 0, 240, 210, 6, .12));
        this.animations.get("right").set("vibing", new Animator(this.spritesheet, 4080, 0, 240, 210, 5, .12));
           };

    update() {
        // update speed
        // update position
        // update armed or unarmed
        //this.x += this.speed + this.game.clockTick;
        if(this.state == "dying"){
            this.deathClock--;
            if(this.deathClock == 0){
                this.removeFromWorld = true;
                this.game.addEntity(new Slime(this.game,this.x,this.y));
            }
        }
    };

    draw(ctx) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .33);
    };
};