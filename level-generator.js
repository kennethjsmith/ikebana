class LevelGenerator {

    constructor(game, levelAssets) {
        this.game = game;

        this.level1SpriteSheet = ASSET_MANAGER.getAsset("./sprites/level1.png");
        this.level2SpriteSheet = ASSET_MANAGER.getAsset("./sprites/level2.png");
        if (this.game.level == "level1") this.spritesheet = this.level1SpriteSheet;
        else this.spritesheet = this.level2SpriteSheet;

        this.levelAssets = new Map;
        this.loadWalls();
        this.loadGround();
        
        this.height = 41; // each increment of height is 16 pixels
        this.width = 75; // each increment of width is 16 pixels
        this.scale = 5;

        this.setup();
        this.createFloors();
        this.postProcessGrid();
        this.postProcessGrid();
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
                if (currWalker.row <= 2) currWalker.row = 3;
                if (currWalker.row >= this.height - 4) currWalker.row = this.height - 5;
                if (currWalker.col <= 2) currWalker.col = 3;
                if (currWalker.col >= this.width - 4) currWalker.col = this.width - 5;
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

    // removes all non-floor spaces that are only 1 square wide OR 1 square tall
    postProcessGrid() {
        let cleanGrid = false;
        while (!cleanGrid) {
            cleanGrid = true;
            for (var row = 1; row < this.height - 1; row++) {
                for (var col = 1; col < this.width - 1; col++) {
                    let curr = this.grid[row][col];
                    let northOfCurr = this.grid[row - 1][col];
                    let westOfCurr = this.grid[row][col - 1];
                    let nwOfCurr = this.grid[row - 1][col - 1];
                    let southOfCurr = this.grid[row + 1][col];
                    let seOfCurr = this.grid[row + 1][col + 1]
                    let eastOfCurr = this.grid[row][col + 1];
                    let neOfCurr = this.grid[row - 1][col + 1];
                    let swOfCurr = this.grid[row + 1][col - 1];

                    if (curr == "empty") {
                        if (northOfCurr == "floor" && southOfCurr == "floor") {
                            this.grid[row][col] = "floor";
                            cleanGrid = false;
                        }
                        if (eastOfCurr == "floor" && westOfCurr == "floor") {
                            this.grid[row][col] = "floor"; 
                            cleanGrid = false;
                        }
                        if (southOfCurr == "floor" 
                            && neOfCurr == "floor" 
                            && eastOfCurr == "empty" 
                            && westOfCurr == "empty"
                            && northOfCurr == "empty") {
                                this.grid[row + 1][col] = "empty"
                                cleanGrid = false;
                            }  
                    }
                }
            }
        }

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

                    if (this.isNorthSouthWallTop(i, j, northOfCurr, southOfCurr, eastOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("northSouth");
                    
                    } else if (this.isEastWestWallTop(seOfCurr, swOfCurr, northOfCurr, southOfCurr, eastOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("eastWest");
                
                    } else if (this.isNECornerSWInvertedCorner(i, j, southOfCurr, westOfCurr, swOfCurr, eastOfCurr, northOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("neCornerSWInvertedCorner");
                    
                    } else if (this.isSECornerNWInvertedCorner(i, j, nwOfCurr, westOfCurr, northOfCurr, southOfCurr, swOfCurr, seOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("seCornerNWInvertedCorner");

                    } else if (this.isSWCornerNEInvertedCorner(i, j, northOfCurr, southOfCurr, eastOfCurr, swOfCurr, seOfCurr, neOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("swCornerNEInvertedCorner");

                    } else if (this.isNWCornerSEInvertedCorner(i, j, northOfCurr, nwOfCurr, westOfCurr, neOfCurr, southOfCurr, eastOfCurr, seOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("nwCornerSEInvertedCorner");

                    } else if (this.isSECornerNECorner(i, j, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr)){
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("seCornerNECorner");
                    
                    } else if (this.isSWCornerNWCorner(i, j, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("swCornerNWCorner");

                    } else if (this.isSECornerNWCorner(i, j, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("seCornerNWCorner");

                    } else if (this.isNWallSECorner(i, j, northOfCurr, nwOfCurr, westOfCurr, southOfCurr, swOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("nWallSECorner");

                    } else if (this.isWWallSECorner(i, j, southOfCurr, northOfCurr, eastOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("wWallSECorner");

                    } else if (this.isEWallNWCorner(i, j, southOfCurr, northOfCurr, eastOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("eWallNWCorner");
                                                
                    } else if (this.isWWallNECorner(i, j, southOfCurr, northOfCurr, westOfCurr, eastOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("wWallNECorner");

                    } else if (this.isEWallSWCorner(northOfCurr, eastOfCurr, southOfCurr, neOfCurr, swOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("eWallSWCorner");

                    } else if (this.isSWallNECorner(i, j, northOfCurr, eastOfCurr, westOfCurr, southOfCurr, swOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("sWallNECorner");

                    } else if (this.isNWallSWCorner(i, j, northOfCurr, eastOfCurr, southOfCurr, westOfCurr, neOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("nWallSWCorner");

                    } else if (this.isSWallNWCorner(i, j, northOfCurr, eastOfCurr, westOfCurr, southOfCurr, seOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("sWallNWCorner");

                    } else if (this.isEastNorthSouthWallTop(i, j, northOfCurr, westOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("eastNorthSouth");
                
                    } else if (this.isWestNorthSouthWallTop(i, j, southOfCurr, northOfCurr, eastOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("westNorthSouth");
                
                    } else if (this.isInvertedNWCornerTop(i, j, seOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.randomInvertedNWCornerTop();

                    } else if (this.isInvertedNECornerTop(i, j, westOfCurr, swOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.randomInvertedNECornerTop();

                    } else if (this.isInvertedSWCornerTop(i, j, northOfCurr, southOfCurr, eastOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("invertedCorner").get("sw");
                    
                    } else if (this.isInvertedSECornerTop(eastOfCurr, northOfCurr, southOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("invertedCorner").get("se");
                    
                    } else if (this.isNWCornerTop(i, j, seOfCurr, eastOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] =  this.levelAssets.get("wall").get("corner").get("nw");

                    } else if (this.isSWCornerTop(i, j, northOfCurr, eastOfCurr, neOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("corner").get("sw");
                    
                    } else if (this.isSECornerTop(i, j, westOfCurr, northOfCurr, nwOfCurr)) {
                        this.spriteGrid[i][j] =  this.levelAssets.get("wall").get("corner").get("se");
                    
                    } else if (this.isNECornerTop(i, j, southOfCurr, swOfCurr, westOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("corner").get("ne");
                    
                    } else if (this.isNWCorner(northOfCurr, neOfCurr, eastOfCurr, seOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("nWall").get("nwCorner");

                    } else if (this.isNECorner(northOfCurr, nwOfCurr, westOfCurr, swOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("nWall").get("neCorner");

                    } else if (southOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.randomNorthWall();
                        if (this.spriteGrid[i][j] != this.levelAssets.get("wall").get("nWall").get("cracked1")
                            && this.spriteGrid[i - 1][j] == this.levelAssets.get("ground").get("filler")) {                                this.spriteGrid[i - 1][j] = this.levelAssets.get("ground").get("filler");
                            this.spriteGrid[i - 1][j] = this.randomNorthWallTop();
                        } else if (this.spriteGrid[i][j] == this.levelAssets.get("wall").get("nWall").get("cracked1")
                            && this.spriteGrid[i - 1][j] != this.levelAssets.get("ground").get("filler")) {
                            this.spriteGrid[i][j] = this.randomNorthWall();
                        }
                    
                    } else if (this.isWestWallTop(northOfCurr, neOfCurr, eastOfCurr, seOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("west");

                    } else if (this.isEastWallTop(northOfCurr, nwOfCurr, swOfCurr, southOfCurr)) {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("east");

                    } else if (northOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.randomSouthWallTop();

                    } else if (westOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("east");
                        
                    } else if (eastOfCurr == "floor") {
                        this.spriteGrid[i][j] = this.levelAssets.get("wall").get("wallTop").get("west");
                    }
                }
            }
        }
    };

    isNWCornerTop(row, col, seOfCurr, eastOfCurr, southOfCurr) {
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

    isSWCornerTop(row, col, northOfCurr, eastOfCurr, neOfCurr) {
        if (northOfCurr == "empty"
            && eastOfCurr == "empty"
            && neOfCurr == "floor") {
                return true;
        } else return false;
    };

    isSECornerTop(row, col, westOfCurr, northOfCurr, nwOfCurr) {
        if (westOfCurr == "empty"
            && northOfCurr == "empty"
            && nwOfCurr == "floor") {
                return true;
        } else return false;
    };

    isNECornerTop(row, col, southOfCurr, swOfCurr, westOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && westOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col - 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedNWCornerTop(row, col, seOfCurr, southOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && seOfCurr == "floor"
            && this.grid[row + 2][col] == "floor"
            && this.grid[row + 2][col + 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedNECornerTop(row, col, westOfCurr, swOfCurr, southOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && swOfCurr == "floor"
            && this.grid[row + 2][col] == "floor"
            && this.grid[row + 2][col - 1] == "floor") {
                return true;
        } else return false;
    };

    isInvertedSWCornerTop(row, col, northOfCurr, southOfCurr, eastOfCurr, westOfCurr) {
        if (northOfCurr == "floor" 
            && southOfCurr == "empty"
            && westOfCurr == "empty"
            && eastOfCurr == "floor"){
            return true;
        } else return false;
    };

    isInvertedSECornerTop(eastOfCurr, northOfCurr, southOfCurr, westOfCurr) {
        if (northOfCurr == "floor" 
            && southOfCurr == "empty"
            && eastOfCurr == "empty" 
            && westOfCurr == "floor"){
            return true;
        } else return false;
    };

    isNWCorner(northOfCurr, neOfCurr, eastOfCurr, seOfCurr, southOfCurr) {
        if (northOfCurr == "empty" 
            && neOfCurr == "floor" 
            && eastOfCurr == "floor" 
            && seOfCurr == "floor" 
            && southOfCurr == "floor") {
            return true;
        } else return false;
    }

    isNECorner(northOfCurr, nwOfCurr, westOfCurr, swOfCurr, southOfCurr) {
        if (northOfCurr == "empty" 
            && nwOfCurr == "floor" 
            && westOfCurr == "floor" 
            && swOfCurr == "floor" 
            && southOfCurr == "floor") {
            return true;
        } else return false;
    }

    isWestWallTop(northOfCurr, neOfCurr, eastOfCurr, seOfCurr, southOfCurr) {
        if (northOfCurr == "empty" 
            && neOfCurr == "empty" 
            && eastOfCurr == "empty" 
            && southOfCurr == "empty" 
            && seOfCurr == "floor") {
            return true;
        } else return false;
    };

    isEastWallTop(northOfCurr, nwOfCurr, swOfCurr, southOfCurr) {
        if (northOfCurr == "empty" 
            && nwOfCurr == "empty" 
            && southOfCurr == "empty" 
            && swOfCurr == "floor") {
            return true;
        } else return false;
    };
   
    isNorthSouthWallTop(row, col, northOfCurr, southOfCurr, eastOfCurr, westOfCurr){
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && eastOfCurr == "empty"
            && westOfCurr == "empty"
            && northOfCurr == "floor"
            && this.grid[row + 2][col] == "floor") {
                return true;
        } else return false;
    };

    isEastWestWallTop(seOfCurr, swOfCurr, northOfCurr, southOfCurr, eastOfCurr, westOfCurr){
        if (southOfCurr == "empty"
            && northOfCurr == "empty"
            && (
                (eastOfCurr == "floor" && westOfCurr == "floor")
                || (eastOfCurr == "floor" && swOfCurr == "floor")
                || (westOfCurr == "floor" && seOfCurr == "floor")
                || (seOfCurr == "floor" && swOfCurr == "floor")
                )
            ) {
                return true;
        } else return false;
    };

    isEastNorthSouthWallTop(row, col, northOfCurr, westOfCurr, southOfCurr){
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && northOfCurr == "floor" 
            && westOfCurr == "floor" 
            && this.grid[row + 2][col] == "floor") {
            return true;
        } else return false;
    }

    isWestNorthSouthWallTop(row, col, southOfCurr, northOfCurr, eastOfCurr){
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && northOfCurr == "floor" 
            && eastOfCurr == "floor" 
            && this.grid[row + 2][col] == "floor") {
            return true;
        } else return false;
    }

    isSWallNWCorner(row, col, northOfCurr, eastOfCurr, westOfCurr, southOfCurr, seOfCurr) {
        if (row + 2 < this.height - 1 
            && westOfCurr == "empty"
            && eastOfCurr == "empty"
            && southOfCurr == "empty"
            && seOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && northOfCurr == "floor"
            && this.grid[row + 2][col + 1] == "floor"){
            return true;
        } else return false;
    }

    isSWallNECorner(row, col, northOfCurr, eastOfCurr, westOfCurr, southOfCurr, swOfCurr) {
        if (row + 2 < this.height - 1 
            && westOfCurr == "empty"
            && eastOfCurr == "empty"
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && northOfCurr == "floor"
            && this.grid[row + 2][col - 1] == "floor"){
            return true;
        } else return false;
    }

    isNWallSECorner(row, col, northOfCurr, nwOfCurr, westOfCurr, southOfCurr){
        if (row + 2 < this.height - 1
            && northOfCurr == "empty"
            && westOfCurr == "empty"
            && southOfCurr == "empty"
            && nwOfCurr == "floor"
            && this.grid[row + 2][col] == "floor") {
            return true;
        } else return false;
    }

    isNWallSWCorner(row, col, northOfCurr, eastOfCurr, southOfCurr, westOfCurr, neOfCurr){
        if (row + 2 < this.height - 1
            && northOfCurr == "empty"
            && eastOfCurr == "empty"
            && southOfCurr == "empty"
            && westOfCurr == "empty"
            && neOfCurr == "floor"
            && this.grid[row + 2][col] == "floor") {
            return true;
        } else return false;
    }

    isEWallSWCorner(northOfCurr, eastOfCurr, southOfCurr, neOfCurr, swOfCurr) {
        if (northOfCurr == "empty"
            && eastOfCurr == "empty"
            && southOfCurr == "empty"
            && neOfCurr == "floor"
            && swOfCurr == "floor") {
            return true;
        } else return false;
    }

    isWWallNECorner(row, col, southOfCurr, northOfCurr, westOfCurr, eastOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && northOfCurr == "empty"
            && eastOfCurr == "floor"
            && westOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col - 1] == "floor") {
            return true;
        } else return false;
    }

    isEWallNWCorner(row, col, southOfCurr, northOfCurr, eastOfCurr, westOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && northOfCurr == "empty"
            && westOfCurr == "floor"
            && eastOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col + 1] == "floor") {
            return true;
        } else return false;
    };

    isWWallSECorner(row, col, southOfCurr, northOfCurr, eastOfCurr, westOfCurr) {
        if (southOfCurr == "empty"
            && northOfCurr == "empty"
            && (eastOfCurr == "floor" || this.grid[row + 1][col + 1] == "floor") 
            && westOfCurr == "empty"
            && this.grid[row - 1][col - 1] == "floor") {
            return true;
        } else return false;
    };

    isNECornerSWInvertedCorner(row, col, southOfCurr, westOfCurr, swOfCurr, eastOfCurr, northOfCurr) {
        if (row + 2 < this.height - 1
            && southOfCurr == "empty"
            && westOfCurr == "empty"
            && swOfCurr == "empty"
            && eastOfCurr == "floor"
            && northOfCurr == "floor"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col -1] == "floor") {
            return true;
        } else return false;
    };

    isSECornerNWInvertedCorner(row, col, nwOfCurr, westOfCurr, northOfCurr, southOfCurr, swOfCurr, seOfCurr) {
        if (row + 2 < this.height - 1
            && nwOfCurr == "floor"
            && westOfCurr == "empty"
            && northOfCurr == "empty"
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && seOfCurr == "floor"
            && this.grid[row + 2][col] == "floor") {
            return true;
        } else return false;
    };

    isSWCornerNEInvertedCorner(row, col, northOfCurr, southOfCurr, eastOfCurr, swOfCurr, seOfCurr, neOfCurr) {
        if (row + 2 < this.height - 1
            && northOfCurr == "empty"
            && southOfCurr == "empty"
            && eastOfCurr == "empty"
            && seOfCurr == "empty"
            && swOfCurr == "floor"
            && this.grid[row + 2][col] == "floor"
            && neOfCurr == "floor") {
            return true;
        } else return false;
    };

    isNWCornerSEInvertedCorner(row, col, northOfCurr, nwOfCurr, westOfCurr, neOfCurr, southOfCurr, eastOfCurr, seOfCurr) {
        if (row + 2 < this.height - 1 
            && northOfCurr == "floor"
            && nwOfCurr == "floor"
            && westOfCurr == "floor"
            && neOfCurr == "floor"
            && southOfCurr == "empty"
            && eastOfCurr == "empty"
            && seOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col + 1] == "floor") {
            return true;
        } else return false;
    };

    isSECornerNECorner(row, col, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr) {
        if (row + 2 < this.height - 1
            && westOfCurr == "empty"
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && northOfCurr == "empty"
            && eastOfCurr == "empty"
            && neOfCurr == "empty"
            && seOfCurr == "empty"
            && nwOfCurr == "floor"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col - 1] == "floor") {
            return true;
        } else return false;
    };

    isSWCornerNWCorner(row, col, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr) {
        if (row + 2 < this.height - 1
            && westOfCurr == "empty"
            && southOfCurr == "empty"
            && swOfCurr == "empty"
            && northOfCurr == "empty"
            && eastOfCurr == "empty"
            && neOfCurr == "floor"
            && seOfCurr == "empty"
            && nwOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && this.grid[row + 2][col + 1] == "floor") {
            return true;
        } else return false;
    };

    isSECornerNWCorner(row, col, westOfCurr, southOfCurr, swOfCurr, northOfCurr, eastOfCurr, neOfCurr, seOfCurr, nwOfCurr) {
        if (row + 2 < this.height - 1
            && northOfCurr == "empty"
            && eastOfCurr == "empty"
            && southOfCurr == "empty"
            && westOfCurr == "empty"
            && neOfCurr == "empty"
            && swOfCurr == "empty"
            && seOfCurr == "empty"
            && this.grid[row + 2][col] == "empty"
            && nwOfCurr == "floor"
            && this.grid[row + 2][col + 1] == "floor") {
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
        if (choice < 35) return this.levelAssets.get("wall").get("nWall").get("plain1");
        else if (choice < 70) return this.levelAssets.get("wall").get("nWall").get("plain2");
        else if (choice < 98) return this.levelAssets.get("wall").get("nWall").get("plain3");
        else return this.levelAssets.get("wall").get("nWall").get("cracked1");
    };

    randomInvertedNWCornerTop() {
        var choice = floor(Math.random() * 100);
        if (choice < 95) return this.levelAssets.get("wall").get("invertedCorner").get("nw1");
        else return this.levelAssets.get("wall").get("invertedCorner").get("nw2");

    };

    randomInvertedNECornerTop() {
        var choice = floor(Math.random() * 100);
        if (choice < 95) return this.levelAssets.get("wall").get("invertedCorner").get("ne").get("plain"); 
        else return this.levelAssets.get("wall").get("invertedCorner").get("ne").get("cracked");
    }

    randomNorthWallTop() {
        var choice = floor(Math.random() * 100);
        if (choice < 90) return this.levelAssets.get("wall").get("wallTop").get("north").get("plain");
        else if (choice < 95) return this.levelAssets.get("wall").get("wallTop").get("north").get("cracked1");
        else return this.levelAssets.get("wall").get("wallTop").get("north").get("cracked2");
    }

    randomSouthWallTop(){
        var choice = floor(Math.random() * 100);
        if (choice < 90) return this.levelAssets.get("wall").get("wallTop").get("south").get("plain");
        else if (choice < 95) return this.levelAssets.get("wall").get("wallTop").get("south").get("cracked1");
        else return this.levelAssets.get("wall").get("wallTop").get("south").get("cracked2");
    };

    loadWalls() {
        this.levelAssets.set("wall", new Map);

        //Animator constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration)
        this.levelAssets.get("wall").set("nWall", new Map);
        this.levelAssets.get("wall").get("nWall").set("plain1", new Animator(this.spritesheet, 112, 0, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain2", new Animator(this.spritesheet, 16, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("plain3", new Animator(this.spritesheet, 32, 16, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("cracked1", new Animator(this.spritesheet, 144, 16, 16, 16, 1, 2));
        
        this.levelAssets.get("wall").get("nWall").set("nwCorner", new Animator(this.spritesheet, 80, 48, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("nWall").set("neCorner", new Animator(this.spritesheet, 128, 48, 16, 16, 1, 2));

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

        this.levelAssets.get("wall").get("wallTop").set("northSouth", new Animator(this.spritesheet, 160, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("eastWest", new Animator(this.spritesheet, 192, 32, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("eastNorthSouth", new Animator(this.spritesheet, 176, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("westNorthSouth", new Animator(this.spritesheet, 192, 96, 16, 16, 1, 2));

        this.levelAssets.get("wall").get("wallTop").set("sWallNWCorner", new Animator(this.spritesheet, 0, 80, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("eWallNWCorner", new Animator(this.spritesheet, 16, 80, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("wWallSECorner", new Animator(this.spritesheet, 16, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("nwCornerSEInvertedCorner", new Animator(this.spritesheet, 32, 80, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("nWallSECorner", new Animator(this.spritesheet, 32, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("seCornerNWInvertedCorner", new Animator(this.spritesheet, 48, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("eWallSWCorner", new Animator(this.spritesheet, 64, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("nWallSWCorner", new Animator(this.spritesheet, 80, 96, 16, 16, 1, 2));        
        this.levelAssets.get("wall").get("wallTop").set("swCornerNEInvertedCorner", new Animator(this.spritesheet, 96, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("sWallNECorner", new Animator(this.spritesheet, 112, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("wWallNECorner", new Animator(this.spritesheet, 128, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("neCornerSWInvertedCorner", new Animator(this.spritesheet, 144, 96, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("seCornerNECorner", new Animator(this.spritesheet, 0, 64, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("swCornerNWCorner", new Animator(this.spritesheet, 32, 64, 16, 16, 1, 2));
        this.levelAssets.get("wall").get("wallTop").set("seCornerNWCorner", new Animator(this.spritesheet, 176, 32, 16, 16, 1, 2));
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
        ctx.save();
        ctx.translate(-this.game.goop.xMap+this.game.goop.xStart, -this.game.goop.yMap+this.game.goop.yStart);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var square = this.spriteGrid[i][j]; 
                square.drawFrame(this.game.clockTick, ctx, j * 16 * this.scale, i * 16 * this.scale, this.scale); 
                // *16 because each tile is 16 x 16 pixels
                // if changing the scale, the multiplier also needs to change
                // 80, 80, 5 -> regular view
                // 16, 16, 1 -> view whole map
            }
        }
        ctx.restore();
    };

}