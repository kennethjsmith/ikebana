class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = null;
        this.y = null;
        
        this.health = 3;
        this.ammo = { bullet: 255, energy: 55};
        this.flowers = 0;

        this.xMidpoint = null;
        this.yMidpoint = null;
        this.MAXRADIUS = 250;

        //this.gameOver = false;
        this.level = "level1";
        this.levelLabel = new Map;
        this.levelLabel.set("level1", "Level 1");
        this.levelLabel.set("level2", "Level 2");
        this.levelLabel.set("level3", "Level 3");

        this.titleScreen = true; // should this be this.title
        this.pause = false;
        this.play = true;


        this.levelXSize = 75; // # of tiles
        this.levelYSize = 41;
        this.game.numXTiles = this.levelXSize;
        this.game.numYTiles = this.levelYSize;

        this.startXPlayer = null;
        this.startYPlayer = null;
        this.goopsQuadrant = null;

        this.loadLevel(this.level, this.titleScreen);
        this.hud = new Hud(this.game);

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
        let numSlimes = 20;
        for (let i = 0; i < numSlimes; i++) {        
            let enemyLocation = this.randomLocation();
            this.game.addEntity(new Slime(this.game, enemyLocation.x, enemyLocation.y));
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
                        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };
                    }
                }
            }
        // start at the bottom
        } else {
            for (let row = this.levelYSize - 3; row > 3; row--) {
                for (let col = this.levelXSize - 3; col > 3; col--) {
                    if (this.acceptableSpawnLocation(row, col)) {
                        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };
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
        return { x: col * this.game.level.tileSize, y: row * this.game.level.tileSize };        
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
        if (this.startXPlayer > this.levelXSize * this.game.level.tileSize / 2) {
            if (this.startYPlayer > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SE";
            else this.goopsQuadrant = "NE";
        } else if (this.startYPlayer > this.levelYSize * this.game.level.tileSize / 2) this.goopsQuadrant = "SW";
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

        

        let xDistance = ((this.game.crosshair.xMidpoint) - (this.game.goop.xMap + this.game.goop.spriteWidth/2));
        let yDistance = ((this.game.crosshair.yMidpoint) - (this.game.goop.yMap + this.game.goop.spriteHeight/2));
        let totalDistance = Math.hypot(xDistance,yDistance);
        if(totalDistance < this.MAXRADIUS){
            this.x = this.game.goop.xMap - this.xMidpoint + (xDistance/2);
            this.y = this.game.goop.yMap - this.yMidpoint + (yDistance/2);
        }
        else {
            //get max camera movement
            // first, get imaginary point on line
            let ratio = (this.MAXRADIUS/totalDistance);
            //console.log(ratio);
            let imaginaryX = ((1 - ratio) * this.game.goop.xMap + ratio * this.game.crosshair.xMidpoint);
            let imaginaryY = ((1 - ratio) * this.game.goop.yMap + ratio * this.game.crosshair.yMidpoint);
            //console.log("hair(x,y):("+this.game.crosshair.xMidpoint+", "+this.game.crosshair.yMidpoint+")");
            //console.log("(x,y):("+imaginaryX+", "+imaginaryY+")");

            let imaginaryXDistance = (imaginaryX - (this.game.goop.xMap + this.game.goop.spriteWidth/2));
            let imaginaryYDistance = (imaginaryY - (this.game.goop.yMap + this.game.goop.spriteHeight/2));
            this.x = this.game.goop.xMap - this.xMidpoint + (imaginaryXDistance/2);
            this.y = this.game.goop.yMap - this.yMidpoint + (imaginaryYDistance/2);
        }
        

        //TODO: make this radius bound work for camera
        // if(totalDistance > radius){
        //     console.log("here");
        //     this.x = this.game.goop.xMap - this.xMidpoint + ((xDistance/totalDistance)*radius);
        //     this.y = this.game.goop.yMap - this.yMidpoint + ((yDistance/totalDistance)*radius);
        // }
        // else if (totalDistance <= radius){
            //this.x = this.game.goop.xMap - this.xMidpoint + (xDistance/2);
           // this.y = this.game.goop.yMap - this.yMidpoint + (yDistance/2);
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
