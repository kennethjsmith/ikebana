class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = null;
        this.y = null;
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/HUD_mockup.png");
        this.animation = new Animator(this.spritesheet, 0, 0, 1483, 198, 1, 1);
        
        this.hud = new Hud(this.game);
        this.health = 3;
        this.ammo = { bullet: 255, energy: 55};
        this.flowers = 0;

        this.xMidpoint = null;
        this.yMidpoint = null;

        //this.gameOver = false;
        this.level = "level1";
        
        this.titleScreen = true;


        this.levelXSize = 75; // # of tiles
        this.levelYSize = 41;
        this.game.numXTiles = this.levelXSize;
        this.game.numYTiles = this.levelYSize;

        this.startXPlayer = null;
        this.startYPlayer = null;
        this.goopsQuadrant = null;

        this.loadLevel(this.level, this.titleScreen);
    };

    updateAudio() {
		var mute = document.getElementById("mute").checked;
		var volume = document.getElementById("volume").value;
		
		ASSET_MANAGER.muteAudio(mute);
		ASSET_MANAGER.adjustVolume(volume);
	};

    loadLevel(level, title) {

       // if(!title){
            // build level map and spawn start location for goop
            this.game.level = new LevelGenerator(this.game, this.levelXSize, this.levelYSize);
            let goopStartLocation = this.randomEdgeLocation();
            this.startXPlayer = goopStartLocation.x;
            this.startYPlayer = goopStartLocation.y;
            this.calculateGoopsStartQuadrant();

            // add gun
            //this.game.addEntity(new Gun("uzi",this.game)); // 5 is level scaler and 16 is the sprite width/height for level tiles
            
            // add goop
            this.game.addEntity(new Goop(this.game)); // 5 is level scaler and 16 is the sprite width/height for level tiles

            this.game.goop.gun = new Gun("uzi", this.game);

            this.xMidpoint = this.game.ctx.canvas.width/2 - (this.game.goop.spriteWidth/2);
            this.yMidpoint = this.game.ctx.canvas.height/2 - (this.game.goop.spriteHeight/2);

            this.x = this.game.goop.xMap - this.xMidpoint;
            this.y = this.game.goop.yMap - this.yMidpoint;

            this.addEnemies();

            ASSET_MANAGER.pauseBackgroundMusic();
            //ASSET_MANAGER.playAsset("dummy-path");
        //}
    }

    clearEntities() {
        this.game.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };

    addEnemies() {
        let numSlimes = 10;
        //this.enemyStartLocation = [];
        for (let i = 0; i < numSlimes; i++) {        
            let enemyLocation = this.randomLocation();
            //enemyStartLocation.push(enemyLocation);

            this.game.addEntity(new Slime(this.game, enemyLocation.x, enemyLocation.y));
            console.log("enemy location. x: " + enemyLocation.x + ", y: " + enemyLocation.y);
        }

    }

    // used to find a random start location for goop
    randomEdgeLocation() {
        var choice = floor(Math.random() * 2);

        // start at the top
        if (choice < 1) {
            for (let row = 1; row < this.levelYSize - 3; row++) {
                for (let col = 1; col < this.levelXSize - 3; col++) {
                    if (this.acceptableSpawnLocation(row, col)) {
                        return { x: col * 5 * 16, y: row * 5 * 16 };
                    }
                }
            }
        // start at the bottom
        } else {
            for (let row = this.levelYSize - 3; row > 3; row--) {
                for (let col = this.levelXSize - 3; col > 3; col--) {
                    if (this.acceptableSpawnLocation(row, col)) {
                        return { x: col * 5 * 16, y: row * 5 * 16 };
                    }
                }
            }
        }
    };

    // used to find a random start location for enemies
    randomLocation() {
        var row = floor(Math.random() * 41);
        var col = floor(Math.random() * 75);
        while (!this.acceptableSpawnLocation(row, col)) {
            row = floor(Math.random() * 41);
            col = floor(Math.random() * 75);
        }
        return { x: col * 5 * 16, y: row * 5 * 16 };        
    }

    // returns true if the location is a 3x3 grid of floorspace
    acceptableSpawnLocation(row, col) {

        // if we are spawning goops start location
        if (this.startXPlayer == null && this.startYPlayer == null
            && this.game.spriteGrid[row][col].type == "floor"
            && this.game.spriteGrid[row+1][col].type == "floor"
            && this.game.spriteGrid[row+2][col].type == "floor"
            && this.game.spriteGrid[row][col+1].type == "floor"
            && this.game.spriteGrid[row+1][col+1].type == "floor"
            && this.game.spriteGrid[row+2][col+1].type == "floor"
            && this.game.spriteGrid[row][col+2].type == "floor"
            && this.game.spriteGrid[row+1][col+2].type == "floor"
            && this.game.spriteGrid[row+2][col+2].type == "floor") {
                return true;

        // else if we are spawning an enemy start location
        // enemies cannot spawn in the same quadrant as goop
        } else if (this.startXPlayer != null && this.startYPlayer != null
            && this.game.spriteGrid[row][col].type == "floor"
            && !this.inGoopsQuadrant(row, col)
            //&& !this.enemyStartLocation.includes({ x: col, y: row })
            ) 
                return true;
        
        return false;
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

    calculateGoopsStartQuadrant() {
        if (this.startXPlayer > this.levelXSize * 5 * 16 / 2) {
            if (this.startYPlayer > this.levelYSize * 5 * 16 / 2) this.goopsQuadrant = "SE";
            else this.goopsQuadrant = "NE";
        } else if (this.startYPlayer > this.levelYSize * 5 * 16 / 2) this.goopsQuadrant = "SW";
        else this.goopsQuadrant = "NW";

    }

    update() {
        //console.log("here");
        // if (this.title && this.game.click) {
		// 	if (this.game.click.x > 415 && this.game.click.x < 565 && this.game.click.y > 660 && this.game.click.y < 710) {
		// 		this.title = false;
		// 		this.loadLevel(levelOne, false);
		// 	}
		// }

        
        let xDistance = ((this.game.crosshair.xMap + this.game.crosshair.spriteSize/2) - (this.game.goop.xMap + this.game.goop.spriteWidth/2));
        let yDistance = ((this.game.crosshair.yMap + this.game.crosshair.spriteSize/2) - (this.game.goop.yMap + this.game.goop.spriteHeight/2));
        
        //TODO: make this radius bound work for camera
        // if(totalDistance > radius){
        //     console.log("here");
        //     this.x = this.game.goop.xMap - this.xMidpoint + ((xDistance/totalDistance)*radius);
        //     this.y = this.game.goop.yMap - this.yMidpoint + ((yDistance/totalDistance)*radius);
        // }
        // else if (totalDistance <= radius){
            this.x = this.game.goop.xMap - this.xMidpoint + (xDistance/2);
            this.y = this.game.goop.yMap - this.yMidpoint + (yDistance/2);
        // }
   

        
        // ScreenMouse = GetComponent.<Camera>().main.ScreenToWorldPoint(Vector3(MousePos1.x, MousePos1.y, Obj.position.z-GetComponent.<Camera>().main.transform.position.z));
        // MouseOffset = ScreenMouse - Parent.position;
    
        // MousePos2 = Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, -transform.position.z));
        // Obj.position.y = ((this.game.mouseY - Parent.position.y)/2.0)+Parent.position.y;
        // Obj.position.x = ((this.game.mouseX - Parent.position.x)/2.0)+Parent.position.x;
        
        // Dist = Vector2.Distance(Vector2(Obj.position.x, Obj.position.y), Vector2(Parent.position.x, Parent.position.y));
        
        // if(Dist > Radius){
        //     var norm = MouseOffset.normalized;
        //     Obj.position.x = norm.x*Radius + Parent.position.x;
        //     Obj.position.y = norm.y*Radius + Parent.position.y;
        // }
        this.updateAudio();
    }

    draw(ctx) {
        if (this.title) {
			//ctx.drawImage(this.titleBackground, 0, 0, 620, 349, 0, 0, 1024, 768);
			ctx.fillStyle = "Black";
			ctx.fillText("Ikebana", 200, 200);
			
			//ctx.fillRect(300, 660, 150, 50);
			ctx.fillStyle = this.game.mouse && this.game.mouse.x > 415 && this.game.mouse.x < 565 && this.game.mouse.y > 660 && this.game.mouse.y < 710 ? "White" : "Black";
			ctx.fillText("PLAY", 425, 700);
		}

        //this.animation.drawFrame(this.game.clockTick, ctx, 0, 0, .5);
    };
}
