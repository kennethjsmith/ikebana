const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/goop.png");
ASSET_MANAGER.queueDownload("./sprites/grep.png");
ASSET_MANAGER.queueDownload("./sprites/horror_slime.png");
ASSET_MANAGER.queueDownload("./sprites/slime.png");
ASSET_MANAGER.queueDownload("./sprites/flower1.png");
ASSET_MANAGER.queueDownload("./sprites/crosshair.png");
ASSET_MANAGER.queueDownload("./sprites/bullet.png");
ASSET_MANAGER.queueDownload("./sprites/gun.png");
ASSET_MANAGER.queueDownload("./sprites/level1.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	gameEngine.init(ctx);
	
	gameEngine.addEntity(new Crosshair(gameEngine));
	gameEngine.addEntity(new Goop(gameEngine));
	gameEngine.addEntity(new Grep(gameEngine));
	gameEngine.addEntity(new HorrorSlime(gameEngine));
	gameEngine.addEntity(new Slime(gameEngine,100,400));
	gameEngine.addEntity(new Flower(gameEngine,200,400));
	gameEngine.addEntity(new LevelGenerator(gameEngine));
	gameEngine.start();
});
