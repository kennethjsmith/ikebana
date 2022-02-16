// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Context dimensions
        this.surfaceWidth = null;
        this.surfaceHeight = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        // Entities to be added at the end of each update
        this.entitiesToAdd = [];

        // Everything that will be updated and drawn each frame
        this.bullets = [];
        // Entities to be added at the end of each update
        this.bulletsToAdd = [];

        this.tilesToDrawOnTop = [];

        // Information on the input
        this.click = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.wheel = null;

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        // THE KILL SWITCH
        this.running = false;

        this.debug = false;

        // Options and the Details
        this.options = options || {
            prevent: {
                contextMenu: true,
                scrolling: true,
            },
           // debugging: true,
        };
    };

    init(ctx) {
        this.ctx = ctx;
        this.crosshair= new Crosshair(this);
        //what is this? vvv
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            if (this.running) {
                requestAnimFrame(gameLoop, this.ctx.canvas);
            }
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });

        var self = this;

        // on click, lock input
        this.ctx.canvas.onclick = () => {
            if (!self.locked) {
                this.ctx.canvas.requestPointerLock({
                    unadjustedMovement: true,
                });
                this.mouseX = this.ctx.canvas.width / 2;
                this.mouseY = this.ctx.canvas.height / 2;
                self.locked = true;
            }
        };

        // handle locked cursor movement
        document.addEventListener("pointerlockchange", lockChangeAlert, false);
        document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

        function lockChangeAlert() {
            if (document.pointerLockElement === self.ctx.canvas || document.mozPointerLockElement === self.ctx.canvas) {
                document.addEventListener("mousemove", updatePosition, false);
                self.locked = true;
            } else {
                document.removeEventListener("mousemove", updatePosition, false);
                self.locked = false;
            }
        }

        function updatePosition(e) {
            self.mouseX = Math.min(Math.max(0, (self.mouseX += (e.movementX/4))), self.ctx.canvas.width - self.crosshair.spriteSize);
            self.mouseY = Math.min(Math.max(0, (self.mouseY += (e.movementY/4))), self.ctx.canvas.height - self.crosshair.spriteSize);
        }


        this.ctx.canvas.addEventListener("keydown", e => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    this.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    this.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    this.down = true;
                    break;
            }
        }, false);

        this.ctx.canvas.addEventListener("keyup", e => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    this.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    this.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    this.down = false;
                    break;
            }
        }, false);

        this;
        //mouse position in canvas
        function getMousePos(canvas, e) {
            var rect = canvas.getBoundingClientRect();
            return {
              x: e.clientX - rect.left,//400 width of canvas. 300 height
              y: e.clientY - rect.top
            };
          }

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            // var pos = getMousePos(this.ctx.canvas, e, this.goop);
            // this.mouseX = pos.x;
            // this.mouseY = pos.y;
            if(this.locked){
                updatePosition(e);
                this.crosshair.update(); //update here since not in entities list, update after movement too so that camera updates
            }
        });

        this.ctx.canvas.addEventListener("mousedown", e => {
            // if (this.options.debugging) {
            //     console.log("CLICK", getXandY(e));
            // }
            this.clicked = true;
            ASSET_MANAGER.playAsset("dummy-path");
            //console.log("pressed");
        });

        this.ctx.canvas.addEventListener("mouseup", e => {
            // if (this.options.debugging) {
            //     console.log("CLICK", getXandY(e));
            // }
            this.clicked = false;
            //console.log("released");
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            // if (this.options.debugging) {
            //     console.log("WHEEL", getXandY(e), e.wheelDelta);
            // }
            if (this.options.prevent.scrolling) {
                e.preventDefault(); // Prevent Scrolling
            }
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            // if (this.options.debugging) {
            //     console.log("RIGHT_CLICK", getXandY(e));
            // }
            if (this.options.prevent.contextMenu) {
                e.preventDefault(); // Prevent Context Menu
            }
            this.rightclick = getXandY(e);
        });

        this.mouseX = this.ctx.canvas.width / 2;
        this.mouseY = this.ctx.canvas.height / 2;
    };

    addEntity(entity) {
        this.entitiesToAdd.push(entity);
    };

    addBullet(bullet) {
        this.bulletsToAdd.push(bullet);
    };
    

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // if (this.camera.titleScreen)this.camera.draw(this.ctx);
        // else{
            this.level.draw(this.ctx);

            // Draw latest entities first
            for (let i = this.entities.length - 1; i >= 0; i--) {
                this.entities[i].draw(this.ctx, this);
            }

            // draw goops gun
            this.goop.gun.draw(this.ctx);

            // Draw latest bullets first
            for (let i = this.bullets.length - 1; i >= 0; i--) {
                this.bullets[i].draw(this.ctx, this);
            }


            // draw south wall tiles on top of necessary entities
            if (this.tilesToDrawOnTop.length > 0) {
                this.tilesToDrawOnTop.forEach( tile => {
                    let image = tile.image;
                    let col = tile.col;
                    let row = tile.row;
                    let tileSize = this.level.tileSize;
                    let scale = this.level.scale;
                    image.drawFrame(this.clockTick, this.ctx, Math.floor((col * tileSize) - (this.camera.x)), Math.floor((row * tileSize) - (this.camera.y)), scale); 
                });
            }

            this.camera.hud.draw(this.ctx);
        //}
        this.crosshair.draw(this.ctx);
    };

    update() {
        this.tilesToDrawOnTop = [];
        // Update Entities
        this.entities.forEach(entity => entity.update(this));
        //this.crosshair.update();
        // Update Bullets
        this.bullets.forEach(bullet => bullet.update(this));

        // Remove dead things
        this.entities = this.entities.filter(entity => !entity.removeFromWorld);

        // Remove dead things
        this.bullets = this.bullets.filter(bullet => !bullet.removeFromWorld);

        // Add new things
        this.entities = this.entities.concat(this.entitiesToAdd);
        this.entitiesToAdd = [];

        // Add new things
        this.bullets = this.bullets.concat(this.bulletsToAdd);
        this.bulletsToAdd = [];
        this.camera.hud.update();
        this.crosshair.update();
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

    get["deltaTime"]() { return this.clockTick; }

};