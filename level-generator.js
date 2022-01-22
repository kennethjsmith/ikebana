class LevelGenerator {

    constructor(game, levelAssets) {
        this.game = game;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/level1.png");
        this.levelAssets = new Map;
        this.loadWalls();
        this.loadGround();
        
        this.height = 41; // each increment of height is 16 pixels
        this.width = 75; // each increment of width is 16 pixels

        this.setup();
        this.createFloors();
        //this.createWalls();
        //removeSingleWalls();
        this.spawnLevel();        
    };

    setup() {

         // create gridspapce (2d array)
        // set every cell to be an empty gradspace
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = ("empty");
            }
        }

        this.spriteGrid = [];
        for (let i = 0; i < this.height; i++) {
            this.spriteGrid.push([]);
            for (let j = 0; j < this.width; j++) {
                this.spriteGrid[i][j] = this.levelAssets.get("ground").get("filler");
            }
        }

        this.maxWalkers = 15;
        this.chanceWalkerChangeDir = 0.1;
        this.chanceWalkerSpawn = 0.3;
        this.chanceWalkerDestroy = 0.25;
        this.percentToFill = 0.45;

        // create empty list of walkers
        this.walkers = [];

        // put a walker at the center of the grid, give it random direction
        let walker = { direction: this.randomDirection(), row: floor(this.height / 2), col: floor(this.width / 2) }

        // add it to the list of walkers
        this.walkers.push(walker);
    };

    randomDirection() {
        var choice = floor(Math.random() * 4);
        switch (choice) {
            case 0:
                return "S";
            case 1:
                return "W";
            case 2: 
                return "N";
            case 3: 
                return "E";
        }

    };

    createFloors() {
        var numFloors = 0;
        var iteration = 0;
        
        do {
             //avoid the boarder of the grid
             for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                if (currWalker.row <= 0) currWalker.row = 1;
                if (currWalker.row >= this.height - 4) currWalker.row = this.height - 4;
                if (currWalker.col <= 0) currWalker.col = 1;
                if (currWalker.col >= this.width - 4) currWalker.col = this.width - 4;
                this.walkers[i] = currWalker;
            }
        
            // foreach walker in the list of walkers:
            // create a floor where the walker currently is
            this.walkers.forEach (curr => {
                this.grid[curr.row][curr.col] = "floor";
                this.grid[curr.row+1][curr.col] = "floor";
                this.grid[curr.row+2][curr.col] = "floor";

                this.grid[curr.row][curr.col+1] = "floor";
                this.grid[curr.row+1][curr.col+1] = "floor";
                this.grid[curr.row+2][curr.col+1] = "floor";

                this.grid[curr.row][curr.col+2] = "floor";
                this.grid[curr.row+1][curr.col+2] = "floor";
                this.grid[curr.row+2][curr.col+2] = "floor";

                numFloors++;
            })

            // chance to destroy the walker
            let walkerCount = this.walkers.length;
            for (let i = 0; i < walkerCount; i++) {
                if (Math.random() < this.chanceWalkerDestroy && this.walkers.length > 1) {
                    this.walkers.splice(i, 1);
                    break;
                }
            }

            // chance for walker to pick a new direction
            for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                if (Math.random() < this.chanceWalkerChangeDir) {
                    currWalker.direction = this.randomDirection();
                    this.walkers[i] = currWalker;
                }
            }


            // chance to spawn a new walker
            let numChecks = this.walkers.length;
            for (let i = 0; i < numChecks; i++) {
                if (Math.random() < this.chanceWalkerSpawn && this.walkers.length < this.maxWalkers) {
                    let currWalker = this.walkers[i];
                    this.walkers.push({ direction: this.randomDirection(), row: currWalker.row, col: currWalker.col })
                }
            }

            // move the walkers
            for (let i = 0; i < this.walkers.length; i++) {
                let currWalker = this.walkers[i];
                let direction = currWalker.direction;
                switch (direction) {
                    case "S":
                        currWalker.row = currWalker.row - 1;
                        break;
                    case "W":
                        currWalker.col = currWalker.col - 1;
                        break;
                    case "N": 
                        currWalker.row = currWalker.row + 1;
                        break;
                    default: 
                        currWalker.col = currWalker.col + 1;
                        break;
                }
                this.walkers[i] = currWalker;
            }

            //check to exit the loop
            if (numFloors / (this.width * this.height) > this.percentToFill) break;
            iteration++;
        } while (iteration < 1000); // early termination if we are still going
    };

    spawnLevel() {

        for (var i = 1; i < this.height - 1; i++) {
            for (var j = 1; j < this.width - 1; j++) {
                let curr = this.grid[i][j];
                let northOfCurr = this.grid[i - 1][j];
                let westOfCurr = this.grid[i][j - 1];
                let nwOfCurr = this.grid[i - 1][j - 1];
                let southOfCurr = this.grid[i + 1][j];
                let seOfCurr = this.grid[i + 1][j + 1]
                let eastOfCurr = this.grid[i][j + 1];
                let neOfCurr = this.grid[i - 1][j + 1];
                let swOfCurr = this.grid[i + 1][j - 1];

                if (curr == "floor") {
                    if (nwOfCurr == "empty" && northOfCurr == "empty" && westOfCurr == "empty") {
                        this.spriteGrid[i][j] = this.levelAssets.get("ground").get("shadow").get("corner");

                    } else if (nwOfCurr == "empty" && northOfCurr == "floor" && westOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("ground").get("shadow").get("invertedCorner");

                    } else if (nwOfCurr == "floor" && northOfCurr == "floor" && westOfCurr == "empty") {
                        this.spriteGrid[i][j] = this.levelAssets.get("ground").get("shadow").get("west").get("gradient");

                    } else if (northOfCurr == "empty" && nwOfCurr == "floor" && westOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("ground").get("shadow").get("north").get("gradient");

                    } else if (northOfCurr == "empty") {
                        this.spriteGrid[i][j] = this.randomNorthGround();

                    } else if (westOfCurr == "empty") {
                        this.spriteGrid[i][j] = this.randomWestGround();

                    } else {
                        this.spriteGrid[i][j] = this.randomGround();
                    }

                } else if (curr == "empty") {

                    if (this.isNWCorner(i, j, seOfCurr, eastOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] =  this.levelAssets.get("wall").get("corner").get("nw");

                    } else if (this.isSWCorner(i, j, northOfCurr, eastOfCurr, neOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("corner").get("sw");
                    
                    } else if (this.isSECorner(i, j, westOfCurr, northOfCurr, nwOfCurr)) {
                        this.spriteGrid[i][j] =  this.levelAssets.get("wall").get("corner").get("se");
                    
                    } else if (this.isNECorner(i, j, southOfCurr, swOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("corner").get("ne");
                    
                    } else if (this.isInvertedNWCorner(i, j, eastOfCurr, seOfCurr, southOfCurr, northOfCurr)) {
                        this.spriteGrid[i][j] = this.randomInvertedNWCorner();

                    } else if (this.isInvertedNECorner(i, j, westOfCurr, swOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.randomInvertedNECorner();

                    } else if (this.isInvertedSWCorner(i, j, northOfCurr, neOfCurr, eastOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("invertedCorner").get("sw");
                    
                    } else if (this.isInvertedSECorner(i, j, northOfCurr, nwOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("invertedCorner").get("se");

                    
                    } else if (southOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.randomNorthWall();

                    } else if (northOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.randomSouthWall();

                    } else if (westOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("east");

                    
                        
                    } else if (eastOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("west");
                    }
                }
            }
        }

        // first and last row
        for (let i = 0; i < this.width; i++) {
            if (this.grid[1][i] == "floor") {
                this.spriteGrid[0][i] = this.randomNorthWall();
                console.log("col: " + i);
            }
            //this.grid[this.height - 1][i] = this.levelAssets.get("ground").get("filler");
        }

        //  // first and last col
        //  for (let i = 0; i < this.height; i++) {
        //     this.grid[i][0] = this.levelAssets.get("ground").get("filler");
        //     this.grid[i][this.width - 1] = this.levelAssets.get("ground").get("filler");
        // }
        
    };

    isNWCorner(row, col, seOfCurr, eastOfCurr, southOfCurr) {
        if (row + 2 < this.height - 1
            && seOfCurr == "empty" 
            && eastOfCurr == "empty" 
            && southOfCurr == "empty" 
            && this.grid[row + 2][col] == "empty" // south south
            && this.grid[row + 2][col + 1] == "floor" // south south east
            ) {
                return true;
        } else return false;
    };

    isSWCorner(row, col, northOfCurr, eastOfCurr, neOfCurr) {
        if (northOfCurr == "empty"
            && eastOfCurr == "empty"
            && neOfCurr == "floor") {
                return true;
        } else return false;
    };

    isSECorner(row, col, westOfCurr, northOfCurr, nwOfCurr) {
        if (westOfCurr == "empty"
            && northOfCurr == "empty"
            && nwOfCurr == "floor") {
                return true;
        } else return false;
    };

    isNECorner(row, col, southOfCurr, swOfCurr, westOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && westOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col - 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedNWCorner(row, col, eastOfCurr, seOfCurr, southOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && eastOfCurr == "floor"
            && seOfCurr == "floor"
            && this.grid[row + 2][col] == "floor"
            && this.grid[row + 2][col + 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedNECorner(row, col, westOfCurr, swOfCurr, southOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && westOfCurr == "floor"
            && swOfCurr == "floor"
            && this.grid[row + 2][col] == "floor"
            && this.grid[row + 2][col - 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedSWCorner(row, col, northOfCurr, neOfCurr, eastOfCurr) {
        if (northOfCurr == "floor" && neOfCurr == "floor" && eastOfCurr == "floor"){
            return true;
        } else return false;
    };

    isInvertedSECorner(row, col, northOfCurr, nwOfCurr, westOfCurr) {
        if (northOfCurr == "floor" && nwOfCurr == "floor" && westOfCurr == "floor"){
            return true;
        } else return false;
    };

    randomGround(){
        var choice = floor(Math.random() * 100);
        if (choice < 75) return this.levelAssets.get("ground").get("plain");
        else if (choice < 83) return this.levelAssets.get("ground").get("cracked1");
        else if (choice < 91) return this.levelAssets.get("ground").get("cracked4");
        else if (choice < 99) return this.levelAssets.get("ground").get("cracked3");
        else if (choice == 99) return this.levelAssets.get("ground").get("cracked2");

    };

    randomNorthGround(){
        var choice = floor(Math.random() * 100);
        if (choice < 75) return this.levelAssets.get("ground").get("shadow").get("north").get("plain");
        else return this.levelAssets.get("ground").get("shadow").get("north").get("cracked")
    };

    randomWestGround() {
        var choice = floor(Math.random() * 100);
        if (choice < 75) return this.levelAssets.get("ground").get("shadow").get("west").get("plain");
        else return this.levelAssets.get("ground").get("shadow").get("west").get("cracked")
    };

    randomNorthWall(){
        var choice = floor(Math.random() * 100);
        if (choice < 20) return this.levelAssets.get("wall").get("nWall").get("plain1");
        else if (choice < 40) return this.levelAssets.get("wall").get("nWall").get("plain2");
        else if (choice < 60) return this.levelAssets.get("wall").get("nWall").get("plain3");
        else if (choice < 80) return this.levelAssets.get("wall").get("nWall").get("plain4");
        else if (choice < 97) return this.levelAssets.get("wall").get("nWall").get("plain5");
        else if (choice < 99) return this.levelAssets.get("wall").get("nWall").get("cracked1");
        else return this.levelAssets.get("wall").get("nWall").get("cracked2");
    };

    randomSouthWall(){
        var choice = floor(Math.random() * 100);
        if (choice < 90) return this.levelAssets.get("wall").get("wallTop").get("south").get("plain");
        else if (choice < 95) return this.levelAssets.get("wall").get("wallTop").get("south").get("cracked1");
        else return this.levelAssets.get("wall").get("wallTop").get("south").get("cracked2");
    };

    randomInvertedNWCorner() {
        var choice = floor(Math.random() * 100);
        if (choice < 50) return this.levelAssets.get("wall").get("invertedCorner").get("nw1");
        else return this.levelAssets.get("wall").get("invertedCorner").get("nw2");

    };

    randomInvertedNECorner() {
        var choice = floor(Math.random() * 100);
        if (choice < 50) return this.levelAssets.get("wall").get("invertedCorner").get("ne").get("plain"); 
        else return this.levelAssets.get("wall").get("invertedCorner").get("ne").get("cracked");
    }

    randomNorthWallTop() {
        var choice = floor(Math.random() * 100);
        if (choice < 45) return this.levelAssets.get("wall").get("wallTop").get("north").get("plain");
        else if (choice < 90) return this.levelAssets.get("wall").get("wallTop").get("north").get("cracked1");
        else return this.levelAssets.get("wall").get("wallTop").get("north").get("cracked2");
    }

    randomSouthWallTop() {

    }

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
        this.levelAssets.get("wall").get("corner").set("nw", new Animator(this.spritesheet, 0, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").set("sw", new Animator(this.spritesheet, 0, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").set("ne", new Animator(this.spritesheet, 48, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("corner").set("se", new Animator(this.spritesheet, 48, 48, 16, 16, 1, 2));

        this.levelAssets.get("wall").set("invertedCorner", new Map);
        this.levelAssets.get("wall").get("invertedCorner").set("nw1", new Animator(this.spritesheet, 80, 32, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("invertedCorner").set("nw2", new Animator(this.spritesheet, 144, 0, 16, 16, 1, 2));
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

        for (var i = this.height - 1; i >= 0; i--) {
            for (var j = this.width - 1; j >= 0 ; j--) {
                var square = this.spriteGrid[i][j]; 
                square.drawFrame(this.game.clockTick, ctx, j * 16, i * 16, 1); 
                // *16 because each tile is 16 x 16 pixels
                // if changing the scale, the multiplier also needs to change
            }
        }
    };

}