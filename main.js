const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./unarmed.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	gameEngine.init(ctx);
	
	gameEngine.addEntity(new Alien(gameEngine));

	gameEngine.start();
});
