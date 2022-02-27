class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = null;
        this.y = null;

        this.titleSprite = ASSET_MANAGER.getAsset("./sprites/placeholder_title.png");
        this.tintScreen = ASSET_MANAGER.getAsset("./sprites/tint_screen.png");
        
        this.health = 3;
        this.ammo = { bullet: 255, energy: 55};
        this.flowers = 0;

        this.xMidpoint = null;
        this.yMidpoint = null;
        this.MAXRADIUS = 250;

        this.level = "level1";
        this.levelStats = new Map;
        this.levelStats.set("level1", new LevelStats("Level 1", 10, 0));
        this.levelStats.set("level2", new LevelStats("Level 2", 15, 0));
        this.levelStats.set("level3", new LevelStats("Level 3", 40, 0));

        this.title = true; 
        this.pause = false;
        this.play = false;
        this.bossSpawned = false;
        this.seedPickedUp = false;
        this.win = false;
        this.lose = false;


        this.levelXSize = 75; // # of tiles
        this.levelYSize = 41; // # of tiles
        this.game.numXTiles = this.levelXSize;
        this.game.numYTiles = this.levelYSize;

        this.startXPlayer = null;
        this.startYPlayer = null;
        this.goopsQuadrant = null;

        this.hud = new Hud(this.game);
        this.loadLevel(this.level, this.title);
    };

    updateAudio() {
		var mute = document.getElementById("mute").checked;
		var volume = document.getElementById("volume").value;
		
		ASSET_MANAGER.muteAudio(mute);
		ASSET_MANAGER.adjustVolume(volume);
	};

    loadLevel() {

       if(!this.title){
           this.clearEntities();

            // build level map and spawn start location for goop
            this.game.level = new LevelGenerator(this.game, this.levelXSize, this.levelYSize);
            let goopStartLocation = this.randomEdgeLocation();
            this.startXPlayer = goopStartLocation.x;
            this.startYPlayer = goopStartLocation.y;

            // add gun
            //this.game.addEntity(new Gun("uzi",this.game)); // 5 is level scaler and 16 is the sprite width/height for level tiles
            
            // add jar
            this.game.addEntity(new Jar(this.game, this.randomLocation(true)));


            // add goop
            this.game.addEntity(new Goop(this.game));
            this.calculateGoopsQuadrant();


            this.game.gun = this.game.goop.gun;

            this.xMidpoint = this.game.ctx.canvas.width/2 - (this.game.goop.spriteWidth/2);
            this.yMidpoint = this.game.ctx.canvas.height/2 - (this.game.goop.spriteHeight/2);

            this.x = this.game.goop.xMap - this.xMidpoint;
            this.y = this.game.goop.yMap - this.yMidpoint;

            this.addEnemies(this.levelStats.get(this.level).totalEnemies);
            this.populateTerrain();
           
            //ASSET_MANAGER.pauseBackgroundMusic();
            //ASSET_MANAGER.playAsset("dummy-path");
        }
    }

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });

        this.game.bullets.forEach( bullet => {
            bullet.removeFromWorld = true;
        });

        this.game.enemyBullets.forEach( bullet => {
            bullet.removeFromWorld = true;
        });
    };

    addEnemies(numEnemies) {
        let numSlimes = floor(numEnemies * 2 / 3);
        let numHorrorSlimes = numEnemies - numSlimes;
        for (let i = 0; i < numSlimes; i++) {        
            let enemyLocation = this.randomLocation(2, true);
            this.game.addEntity(new Slime(this.game, enemyLocation.x, enemyLocation.y));
        }

        for (let i = 0; i < numHorrorSlimes; i++) {        
            let enemyLocation = this.randomLocation(4, true);
            this.game.addEntity(new HorrorSlime(this.game, enemyLocation.x, enemyLocation.y));
        }

    }

    populateTerrain() {
        // place a random num of pillars
        for (let i = 0; i < (Math.random() * 5); i++) {
            let location = this.randomLocation(7, false);
            this.game.addEntity(new Terrain(this.game, "pillar", location.x, location.y));
        }

        // place a random num of plants
        for (let i = 0; i < (Math.random() * 10) + 15; i++) {
            let location = this.randomLocation(1, false);
            this.game.addEntity(new Terrain(this.game, "plant", location.x, location.y));
        }

        // place a random number of wide plants
        for (let i = 0; i < (Math.random() * 10) + 5; i++) {
            let location = this.randomLocation(4, false);
            this.game.addEntity(new Terrain(this.game, "wideplant", location.x, location.y));
        }

        // place a random number of wall plants
        for (let i = 0; i < (Math.random() * 10) + 5; i++) {
            let location = this.randomWallLocation();
            this.game.addEntity(new Terrain(this.game, "wallplant", location.x, location.y));
        }

        // place a random number of rocks
        for (let i = 0; i < (Math.random() * 10) + 10; i++) {
            let location = this.randomLocation(1, false);
            this.game.addEntity(new Terrain(this.game, "rock", location.x, location.y));
        }
        
    }

    // used to find a random start location for goop
    randomEdgeLocation() {
        var choice = floor(Math.random() * 2);

        // start at the top
        if (choice < 1) {
            for (let row = 1; row < this.levelYSize - 3; row++) {
                for (let col = 1; col < this.levelXSize - 3; col++) {
                    if (this.acceptableSpawnLocation(row, col, 3, false)) {
                        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };
                    }
                }
            }
        // start at the bottom
        } else {
            for (let row = this.levelYSize - 3; row > 3; row--) {
                for (let col = this.levelXSize - 3; col > 3; col--) {
                    if (this.acceptableSpawnLocation(row, col, 3, false)) {
                        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };
                    }
                }
            }
        }
    };

    // used to find a random start location for enemies and terrain
    randomLocation(size, spawnAwayFromGoop) {
        var row = floor(Math.random() * 41);
        var col = floor(Math.random() * 75);
        while (!this.acceptableSpawnLocation(row, col, size, spawnAwayFromGoop)) {
            row = floor(Math.random() * 41);
            col = floor(Math.random() * 75);
        }
        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };        
    }

    // used to find a random start location for enemies and terrain
    randomWallLocation() {
        var row = floor(Math.random() * 41);
        var col = floor(Math.random() * 75);
        while (this.game.tileGrid[row][col].type != "north_wall") {
            row = floor(Math.random() * 41);
            col = floor(Math.random() * 75);
        }
        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };        
    }

    // returns true if the location is a "size" by "size" grid of floorspace
    // I'm sorry for this mangled and nearly unreadable method :( -heather
    acceptableSpawnLocation(row, col, size, spawnAwayFromGoop) {
        let acceptableSpawnSpot = false;
        if (this.game.tileGrid[row][col].type == "floor") {
            //for (let i = 1 - floor(size/2); i < floor(size/2); i++) {
            for (let i = 0; i < size; i++) {
                if (this.game.tileGrid[row + i][col].type == "floor"
                    && this.game.tileGrid[row][col + i].type == "floor"
                    && this.game.tileGrid[row + i][col + i].type == "floor") {
                        if (spawnAwayFromGoop && this.inGoopsQuadrant(row, col)) {
                            return false;
                        } 
                        continue;
                } else return false;
            }
            acceptableSpawnSpot = true;
        } 

        if (acceptableSpawnSpot) {
            this.game.entities.forEach( entity => {
                if (entity instanceof Jar || (entity instanceof Terrain)) {
                    if (entity.boundingBox.containsPoint(row * this.game.level.tileSize, col * this.game.level.tileSize)) {
                        return false;
                    }
                } 
            });
        }
        return acceptableSpawnSpot;
    };

    // returns true if the row and col are within goops quadrant
    inGoopsQuadrant(row, col) {

        switch(this.goopsQuadrant) {
            case "SE":
                if (row > this.levelYSize / 2 && col > this.levelXSize / 2 ) return true;
                else return false;
                
            case "NE":
                if (row < this.levelYSize / 2 && col > this.levelXSize / 2) return true;
                else return false;

            case "SW":
                if (row > this.levelYSize / 2 && col < this.levelXSize / 2) return true;
                else return false;

            default: // NW
                if (row < this.levelYSize / 2 && col < this.levelXSize / 2) return true;
                else return false;
        }
    };

    calculateGoopsQuadrant() {
        if (this.game.goop.xMap > this.levelXSize * this.game.level.tileSize / 2) {

       // if (this.startXPlayer > this.levelXSize * this.game.level.tileSize / 2) {
           // if (this.startYPlayer > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SE";
            if (this.game.goop.yMap > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SE";

            else this.goopsQuadrant = "NE";
//        } else if (this.startYPlayer > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SW";
        } else if (this.game.goop.yMap > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SW";

        else this.goopsQuadrant = "NW";

    }

    update() {
        if (this.title) {
            if(this.game.clicked) {
			    if (this.game.crosshair.xMidpoint >= 275 && this.game.crosshair.xMidpoint <= 375 && this.game.crosshair.yMidpoint <= 400 && this.game.crosshair.yMidpoint >= 350) {
                    this.title = false;
                    this.play = true;
				    this.loadLevel(this.level);
                }
			}
		} else if (this.pause) { // do nothing right now

        } else if (this.health <= 0) {
            this.play = false;
            this.lose = true;
           
            this.levelStats.get(this.level).deadEnemyCount = 0;

            if(this.game.clicked) {
			    if (this.game.crosshair.xMidpoint - this.x  >= 250 && this.game.crosshair.xMidpoint - this.x <= 400 && 
                    this.game.crosshair.yMidpoint - this.y  <= 400 && this.game.crosshair.yMidpoint - this.y >= 350) {
                    this.x = 0;
                    this.y = 0;
                    this.play = true;
                    this.lose = false;
                    this.health = 3;
                    this.flowers = 0;
                    this.level = "level1";
                    this.bossSpawned = false;
                    this.seedPickedUp = false;
				    this.loadLevel(this.level);
                }
			}            
        } else if (this.win) {
            this.play = false;
            this.levelStats.get(this.level).deadEnemyCount = 0;

            if(this.game.clicked) {
			    if (this.game.crosshair.xMidpoint - this.x  >= 250 && this.game.crosshair.xMidpoint - this.x <= 400 &&
                    this.game.crosshair.yMidpoint  - this.y <= 400 && this.game.crosshair.yMidpoint - this.y >= 350) {
                    this.x = 0;
                    this.y = 0;
                    this.play = true;
                    this.win = false;
                    this.health = 3;
                    this.flowers = 0;
                    this.level = "level1";
                    this.bossSpawned = false;
                    this.seedPickedUp = false;
				    this.loadLevel(this.level);
                }
			}            
        } else if (this.play) { 
            if (this.levelStats.get(this.level).deadEnemyCount >= 5 && !this.bossSpawned) {
                this.calculateGoopsQuadrant();
                let location = this.randomLocation(3, true);
                this.game.addEntity(new Boss(this.game, location.x, location.y));
                this.bossSpawned = true;

            } else if (this.bossSpawned && this.seedPickedUp) {
                this.levelStats.get(this.level).deadEnemyCount = 0;
                this.bossSpawned = false;
                this.seedPickedUp = false;

                if (this.level == "level1") {
                    this.level = "level2";
                    this.loadLevel(this.level);
                } else if (this.level == "level2") {
                   this.win = true;
                }
            
                // this.levelStats.get(this.level).deadEnemyCount >= this.levelStats.get(this.level).totalEnemies) { 
                // this.levelStats.get(this.level).deadEnemyCount = 0;

                // if (this.level == "level1") {
                //     this.level = "level2";
                //     this.loadLevel(this.level, false);
                // } else if (this.level == "level2") {
                //    this.win = true;
                // }
                
            } else {

                let xDistance = ((this.game.crosshair.xMidpoint) - (this.game.goop.xMap + this.game.goop.spriteWidth/2));
                let yDistance = ((this.game.crosshair.yMidpoint) - (this.game.goop.yMap + this.game.goop.spriteHeight/2));
                let totalDistance = Math.hypot(xDistance,yDistance);
                
                if(totalDistance < this.MAXRADIUS){
                    this.x = this.game.goop.xMap - this.xMidpoint + (xDistance/2);
                    this.y = this.game.goop.yMap - this.yMidpoint + (yDistance/2);
                } else { //get max camera movement

                    // first, get imaginary point on line
                    let ratio = (this.MAXRADIUS/totalDistance);
                    let imaginaryX = ((1 - ratio) * this.game.goop.xMap + ratio * this.game.crosshair.xMidpoint);
                    let imaginaryY = ((1 - ratio) * this.game.goop.yMap + ratio * this.game.crosshair.yMidpoint);

                    let imaginaryXDistance = (imaginaryX - (this.game.goop.xMap + this.game.goop.spriteWidth/2));
                    let imaginaryYDistance = (imaginaryY - (this.game.goop.yMap + this.game.goop.spriteHeight/2));
                    this.x = Math.floor(this.game.goop.xMap - this.xMidpoint + (imaginaryXDistance/2));
                    this.y = Math.floor(this.game.goop.yMap - this.yMidpoint + (imaginaryYDistance/2));
                }
            }
        } 
        this.updateAudio();
    }

    draw(ctx) {
        if (this.title) {
            ctx.drawImage(this.titleSprite, 0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = ((this.game.crosshair.xMidpoint >= 275
                                && this.game.crosshair.xMidpoint <= 375 
                                && this.game.crosshair.yMidpoint >= 350 
                                && this.game.crosshair.yMidpoint <= 400) 
                                ? '#2c2f5e' : "White");
			ctx.fillRect(275, 350, 100, 50);
			//ctx.fillStyle = "Pink";
            ctx.fillStyle = ((this.game.crosshair.xMidpoint >= 275
                && this.game.crosshair.xMidpoint <= 375 
                && this.game.crosshair.yMidpoint >= 350 
                && this.game.crosshair.yMidpoint <= 400) 
                ? "White" : '#2c2f5e');
            ctx.font = '30px Kouryuu';
            ctx.fillText("play", 290, 385)

		} else if (this.pause) {
            // draw pause screen
        } else if (this.lose) {
            ctx.drawImage(this.tintScreen, 0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.fillStyle = "White";

            ctx.fillText("goop's down bad", 95, 200)

            ctx.fillStyle = ((this.game.crosshair.xMidpoint - this.x >= 250
                && this.game.crosshair.xMidpoint - this.x  <= 400 
                && this.game.crosshair.yMidpoint - this.y  >= 350 
                && this.game.crosshair.yMidpoint - this.y  <= 400) 
                ? '#2c2f5e' : "White");
            ctx.fillRect(250, 350, 150, 50);
            ctx.fillStyle = ((this.game.crosshair.xMidpoint  - this.x >= 250
                && this.game.crosshair.xMidpoint  - this.x <= 400 
                && this.game.crosshair.yMidpoint  - this.y >= 350 
                && this.game.crosshair.yMidpoint - this.y  <= 400) 
                ? "White" : '#2c2f5e');
            ctx.font = '25px Kouryuu';
            ctx.fillText("play again", 255, 385);
        } else if (this.win) {
            ctx.drawImage(this.tintScreen, 0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.fillStyle = "White";

            ctx.fillText("nice!", 260, 200)

            ctx.fillStyle = ((this.game.crosshair.xMidpoint - this.x  >= 250
                && this.game.crosshair.xMidpoint - this.x  <= 400 
                && this.game.crosshair.yMidpoint - this.y  >= 350 
                && this.game.crosshair.yMidpoint - this.y <= 400) 
                ? '#2c2f5e' : "White");
            ctx.fillRect(250, 350, 150, 50);
            ctx.fillStyle = ((this.game.crosshair.xMidpoint - this.x  >= 250
                && this.game.crosshair.xMidpoint - this.x  <= 400 
                && this.game.crosshair.yMidpoint - this.y  >= 350 
                && this.game.crosshair.yMidpoint - this.y  <= 400) 
                ? "White" : '#2c2f5e');
            ctx.font = '25px Kouryuu';
            ctx.fillText("play again", 255, 385);
        } 
    };
}
