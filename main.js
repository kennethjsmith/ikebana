const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/unarmed_alien.png");
ASSET_MANAGER.queueDownload("./sprites/unarmed_bad_alien.png");
ASSET_MANAGER.queueDownload("./sprites/horror_slime.png");
ASSET_MANAGER.queueDownload("./sprites/slime.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	gameEngine.init(ctx);
	
	gameEngine.addEntity(new Alien(gameEngine));
	gameEngine.addEntity(new BadAlien(gameEngine));
	gameEngine.addEntity(new HorrorSlime(gameEngine));
	gameEngine.addEntity(new Slime(gameEngine));

	gameEngine.start();
});
