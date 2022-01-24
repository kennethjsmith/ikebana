/*
 * TODO: create an "animator" interface that can be used for drawing the level
 * it probably isn't necessary to "animate" the ground, walls, etc if they remain
 * static throughout the game, so maybe we can create an animator that isn't "updated" constantly?
 */

class Level {
    // constructor(game, spritesheet) {
    constructor(game) {
        this.game = game;
        //this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level1.png");
        // //this.spritesheet = spritesheet;

        // this.levelAssets = new Map;


        this.x = 0;
        this.y = 0;
        
        // this.loadWalls();
        // this.loadGround();

        this.map = new LevelGenerator(game);

        //this.map = null;

        //this.loadMap();


        //this.square = this.levelAssets.get("wall").get("corner").get("nw");


    };

    loadWalls() {
        this.levelAssets.set("wall", new Map);

        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration)
        this.levelAssets.get("wall").set("nWall", new Map);
        this.levelAssets.get("wall").get("nWall").set("plain1", new Animator(this.spritesheet, 112, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain2", new Animator(this.spritesheet, 16, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain3", new Animator(this.spritesheet, 32, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain4", new Animator(this.spritesheet, 80, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain5", new Animator(this.spritesheet, 128, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("cracked1", new Animator(this.spritesheet, 144, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("cracked2", new Animator(this.spritesheet, 160, 16, 16, 16, 1, 2));

        this.levelAssets.get("wall").set("corner", new Map);
        this.levelAssets.get("wall").get("corner").set("nw", new Map);
        this.levelAssets.get("wall").get("corner").get("nw").set("plain", new Animator(this.spritesheet, 0, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").get("nw").set("cracked", new Animator(this.spritesheet, 144, 0, 16, 16, 1, 2));

        this.levelAssets.get("wall").get("corner").set("sw", new Animator(this.spritesheet, 0, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").set("ne", new Animator(this.spritesheet, 48, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").set("se", new Animator(this.spritesheet, 48, 48, 16, 16, 1, 2));

        this.levelAssets.get("wall").set("invertedCorner", new Map);
        this.levelAssets.get("wall").get("invertedCorner").set("nw", new Animator(this.spritesheet, 80, 32, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("invertedCorner").set("sw", new Animator(this.spritesheet, 128, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("invertedCorner").set("se", new Animator(this.spritesheet, 128, 0, 16, 16, 1, 2));

        this.levelAssets.get("wall").get("invertedCorner").set("ne", new Map);
        this.levelAssets.get("wall").get("invertedCorner").get("ne").set("plain", new Animator(this.spritesheet, 128, 32, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("invertedCorner").get("ne").set("cracked", new Animator(this.spritesheet, 160, 0, 16, 16, 1, 2));

        this.levelAssets.get("wall").set("wallTop", new Map);
        this.levelAssets.get("wall").get("wallTop").set("north", new Map);
        this.levelAssets.get("wall").get("wallTop").get("north").set("plain", new Animator(this.spritesheet, 64, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").get("north").set("cracked1", new Animator(this.spritesheet, 16, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").get("north").set("cracked2", new Animator(this.spritesheet, 32, 0, 16, 16, 1, 2));

        this.levelAssets.get("wall").get("wallTop").set("south", new Map);
        this.levelAssets.get("wall").get("wallTop").get("south").set("plain", new Animator(this.spritesheet, 80, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").get("south").set("cracked1", new Animator(this.spritesheet, 16, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").get("south").set("cracked2", new Animator(this.spritesheet, 32, 48, 16, 16, 1, 2));

        this.levelAssets.get("wall").get("wallTop").set("east", new Animator(this.spritesheet, 48, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("west", new Animator(this.spritesheet, 0, 16, 16, 16, 1, 2));
    };

    loadGround() {

        this.levelAssets.set("ground", new Map);
        this.levelAssets.get("ground").set("plain", new Animator(this.spritesheet, 64, 32, 16, 16, 1, 2));
        this.levelAssets.get("ground").set("cracked1", new Animator(this.spritesheet, 64, 16, 16, 16, 1, 2));
        this.levelAssets.get("ground").set("cracked2", new Animator(this.spritesheet, 80, 16, 16, 16, 1, 2));
        this.levelAssets.get("ground").set("cracked3", new Animator(this.spritesheet, 16, 32, 16, 16, 1, 2));
        this.levelAssets.get("ground").set("cracked4", new Animator(this.spritesheet, 32, 32, 16, 16, 1, 2));

        this.levelAssets.get("ground").set("shadow", new Map);

        this.levelAssets.get("ground").get("shadow").set("north", new Map);
        this.levelAssets.get("ground").get("shadow").get("north").set("plain", new Animator(this.spritesheet, 112, 16, 16, 16, 1, 2));
        this.levelAssets.get("ground").get("shadow").get("north").set("cracked", new Animator(this.spritesheet, 80, 64, 16, 16, 1, 2));
        this.levelAssets.get("ground").get("shadow").get("north").set("gradient", new Animator(this.spritesheet, 96, 80, 16, 16, 1, 2));

        this.levelAssets.get("ground").get("shadow").set("west", new Map);
        this.levelAssets.get("ground").get("shadow").get("west").set("plain", new Animator(this.spritesheet, 96, 48, 16, 16, 1, 2));
        this.levelAssets.get("ground").get("shadow").get("west").set("cracked", new Animator(this.spritesheet, 64, 64, 16, 16, 1, 2));
        this.levelAssets.get("ground").get("shadow").get("west").set("gradient", new Animator(this.spritesheet, 64, 80, 16, 16, 1, 2));

        this.levelAssets.get("ground").get("shadow").set("south", new Animator(this.spritesheet, 80, 80, 16, 16, 1, 2));

        this.levelAssets.get("ground").get("shadow").set("corner", new Animator(this.spritesheet, 96, 32, 16, 16, 1, 2));
        this.levelAssets.get("ground").get("shadow").set("invertedCorner", new Animator(this.spritesheet, 96, 64, 16, 16, 1, 2));

        this.levelAssets.get("ground").set("filler", new Animator(this.spritesheet, 0, 96, 16, 16, 1, 2));
    };

    loadDecoration() {

    };

    update() {

    };

    loadMap() {

        // walker algorithm


        // 5 x 5 map

        this.map = [
            [   
                this.levelAssets.get("wall").get("corner").get("nw").get("plain"), 
                this.levelAssets.get("wall").get("wallTop").get("north").get("cracked1"),
                this.levelAssets.get("wall").get("wallTop").get("north").get("cracked2"),
                this.levelAssets.get("wall").get("corner").get("ne"),
                this.levelAssets.get("wall").get("wallTop").get("north").get("plain"),
                this.levelAssets.get("wall").get("wallTop").get("south").get("plain"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("wall").get("nWall").get("plain1"),
                this.levelAssets.get("wall").get("invertedCorner").get("se"),
                this.levelAssets.get("wall").get("corner").get("nw").get("cracked"), 
                this.levelAssets.get("wall").get("invertedCorner").get("ne").get("cracked")
            ],
            [ 
                this.levelAssets.get("wall").get("wallTop").get("west"),
                this.levelAssets.get("wall").get("nWall"). get("plain2"),
                this.levelAssets.get("wall").get("nWall"). get("plain3"),
                this.levelAssets.get("wall").get("wallTop").get("east"),
                this.levelAssets.get("ground").get("cracked1"),
                this.levelAssets.get("ground").get("cracked2"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("shadow").get("north").get("plain"),
                this.levelAssets.get("wall").get("invertedCorner").get("sw"),
                this.levelAssets.get("wall").get("nWall").get("cracked1"),
                this.levelAssets.get("wall").get("nWall").get("cracked2")
            ], 
            [
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("cracked3"),
                this.levelAssets.get("ground").get("cracked4"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("plain"),
                this.levelAssets.get("wall").get("invertedCorner").get("nw"),
                this.levelAssets.get("ground").get("shadow").get("corner"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("wall").get("invertedCorner").get("ne").get("plain"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler")
            ],
            [
                this.levelAssets.get("wall").get("corner").get("sw"),
                this.levelAssets.get("wall").get("wallTop").get("south").get("cracked1"),
                this.levelAssets.get("wall").get("wallTop").get("south").get("cracked2"),
                this.levelAssets.get("wall").get("corner").get("se"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("wall").get("nWall").get("plain4"),
                this.levelAssets.get("ground").get("shadow").get("west").get("plain"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("wall").get("nWall").get("plain5"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler")
            ],
            [
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("shadow").get("west").get("cracked"),
                this.levelAssets.get("ground").get("shadow").get("north").get("cracked"),
                this.levelAssets.get("ground").get("shadow").get("invertedCorner"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler")
            ],
            [
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("shadow").get("west").get("gradient"),
                this.levelAssets.get("ground").get("shadow").get("south"),
                this.levelAssets.get("ground").get("shadow").get("north").get("gradient"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler"),
                this.levelAssets.get("ground").get("filler")
            ]
        ]


    };

    draw(ctx) {

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 11; j++) {
                console.log("here " + i + ", " + j);
                square = this.map[i][j];
                this.square.drawFrame(this.game.clockTick, ctx, j * 80, i * 80, 5);
            }
        }
    };

}