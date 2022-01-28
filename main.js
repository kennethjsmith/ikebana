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
ASSET_MANAGER.queueDownload("./sprites/guns.png");
ASSET_MANAGER.queueDownload("./sprites/HUD_mockup.png");
ASSET_MANAGER.queueDownload("./sprites/level1.png");
ASSET_MANAGER.queueDownload("./sprites/level2.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	gameEngine.init(ctx);
	//gameEngine.addEntity(new Crosshair(gameEngine));
	//gameEngine.addEntity(new Gun("gun", gameEngine));
	gameEngine.addEntity(new SceneManager(gameEngine));
	//gameEngine.addEntity(new HorrorSlime(gameEngine,2800,2800));
	//gameEngine.addEntity(new Slime(gameEngine,3000,3000));
	//gameEngine.addEntity(new Flower(gameEngine,2900,2900));
	gameEngine.start();
});
