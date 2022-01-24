const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./sprites/goop.png");
ASSET_MANAGER.queueDownload("./sprites/goop2.png");
ASSET_MANAGER.queueDownload("./sprites/horror_slime.png");
ASSET_MANAGER.queueDownload("./sprites/horror_slime2.png");
ASSET_MANAGER.queueDownload("./sprites/slime.png");
ASSET_MANAGER.queueDownload("./sprites/slime2.png");
ASSET_MANAGER.queueDownload("./sprites/flower.png");
ASSET_MANAGER.queueDownload("./sprites/flower2.png");
ASSET_MANAGER.queueDownload("./sprites/crosshair.png");
ASSET_MANAGER.queueDownload("./sprites/bullet.png");
ASSET_MANAGER.queueDownload("./sprites/gun.png");
ASSET_MANAGER.queueDownload("./sprites/uzi.png");
ASSET_MANAGER.queueDownload("./sprites/level2.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	gameEngine.init(ctx);
	gameEngine.addEntity(new Crosshair(gameEngine));
	gameEngine.addEntity(new Gun("uzi", gameEngine));
	gameEngine.addEntity(new Goop(gameEngine));
	gameEngine.addEntity(new HorrorSlime(gameEngine));
	gameEngine.addEntity(new Slime(gameEngine,100,400));
	gameEngine.addEntity(new Flower(gameEngine,200,400));
	gameEngine.addEntity(new LevelGenerator(gameEngine));
	gameEngine.start();
});
