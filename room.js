class Room {
    constructor(game) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./testbackground.png");
        
       

        this.x = 0;
        this.y = 0;
        // this.z
    };

    loadAnimations() {
    };

    update() {
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet,0,0,880,800);
    };
};