const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./alien_sprite_sheet.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	
	gameEngine.init(ctx);

	//ctx.drawImage(ASSET_MANAGER.getAsset("./alien_sprite_sheet.png"),7820,20,740,740,15,15,370,370);

	gameEngine.addEntity(new Alien(gameEngine));

	gameEngine.start();
});
