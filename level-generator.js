class LevelGenerator {

    constructor(game, levelAssets) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level1.png");
        this.levelAssets = new Map;
        this.loadWalls();
        this.loadGround();
        
        this.height = 36; // each increment of height is 16 pixels
        this.width = 60; // each increment of width is 16 pixels

        this.setup();
        this.createFloors();
        //createWalls();
        //removeSingleWalls();
        //spawnLevel();        
    };

    setup() {

         // create gridspapce (2d array)
        // set every cell to be an empty gradspace
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = (this.levelAssets.get("ground").get("filler"));
            }
        }

        this.maxWalkers = 20;
        this.chanceWalkerChangeDir = 0.25;
        this.chanceWalkerSpawn = 0.5;
        this.chanceWalkerDestroy = 0.05;
        this.percentToFill = 0.80;

        // create empty list of walkers
        this.walkers = [];

        // put a walker at the center of the grid, give it random direction
        let walker = { direction: this.randomDirection(), row: floor(this.height / 2), col: floor(this.width / 2) }

        // add it to the list of walkers
        this.walkers.push(walker);
    };

    randomDirection() {
        var choice = floor(Math.random() * 3);
        switch (choice) {
            case 0:
                return "S";
            case 1:
                return "W";
            case 2: 
                return "N";
            default: 
                return "E";
        }

    };

    createFloors() {
        var numFloors = 0;
        var iteration = 0;
        do {
            // foreach walker in the list of walkers:
            // create a floor where the walker currently is
            this.walkers.forEach (walker => {
                console.log("row: " + walker.row + ", col: " + walker.col);
                this.grid[walker.row][walker.col] = this.levelAssets.get("ground").get("cracked1");
                numFloors++;
            })

            // // chance to destroy the walker
            // let walkerCount = this.walkers.length;
            // for (let i = 0; i < walkerCount; i++) {

            //     if (Math.random() < this.chanceWalkerDestroy && this.walkers.length > 1) {
            //         this.walkers[i].pop();
            //         break;
            //     }
            // }


            // chance for walker to pick a new direction
            for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                if (Math.random() < this.chanceWalkerChangeDir) {
                    console.log("new direction");

                    currWalker.direction = this.randomDirection();
                    this.walkers[i] = currWalker;
                }
            }


            // chance to spawn a new walker
            let numChecks = this.walkers.length;
            for (let i = 0; i < numChecks; i++) {
                if (Math.random() < this.chanceWalkerSpawn && this.walkers.length < this.maxWalkers) {
                    console.log("spawn");

                    let currWalker = this.walkers[i];
                    this.walkers.push({ direction: this.randomDirection(), row: currWalker.row, col: currWalker.col })
                }
            }

            // move the walkers
            for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                let direction = currWalker.direction;
                console.log("direction: " + direction + ", row: " + currWalker.row + ", col: " + currWalker.col);
                if (direction == "N") currWalker.row = currWalker.row + 1;
                else if (direction == "S") currWalker.row = currWalker.row - 1;
                else if (direction == "W") currWalker.col = currWalker.col - 1;
                else currWalker.col = currWalker.col + 1;
                console.log("direction: " + direction + ", row: " + currWalker.row + ", col: " + currWalker.col);

                //console.log("direction: " + direction);
                // switch (direction) {
                //     case "S":
                //         console.log("move S");

                //         currWalker.row = currWalker.row - 1;
                //     case "W":
                //         console.log("move W");
                //         currWalker.col = currWalker.col - 1;
                //     case "N": 
                //         console.log("move N");
                //         currWalker.row = currWalker.row + 1;
                //     default: 
                //         console.log("move E");
                //         currWalker.col = currWalker.col + 1;
                // }
                this.walkers[i] = currWalker;
            }

            //avoid the boarder of the grid
            for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                console.log("row: " + currWalker.row + ", col: " + currWalker.col);

                if (currWalker.row <= 0) currWalker.row = 1;
                else if (currWalker.row >= this.height) currWalker.row = this.height - 2;
                if (currWalker.col <= 0) currWalker.col = 1;
                else if (currWalker.col >= this.width) currWalker.col = this.width - 2;
                this.walkers[i] = currWalker;
            }


            //check to exit the loop
            if (numFloors / (this.width * this.height) > this.percentToFill) {
                console.log(numFloors / (this.width * this.height));
                console.log(this.percentToFill);
                break;
            }
            iteration++;
        } while (iteration < 1000); // early termination if we are still going
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

    update() {

    };

    draw(ctx) {

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var square = this.grid[i][j]; 
                square.drawFrame(this.game.clockTick, ctx, j * 16, i * 16, 1); 
                // *16 because each tile is 16 x 16 pixels
                // if changing the scale, the multiplier also needs to change
            }
        }
    };

}