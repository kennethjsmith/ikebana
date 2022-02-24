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
ASSET_MANAGER.queueDownload("./sprites/bubble.png");
ASSET_MANAGER.queueDownload("./sprites/laser_segments.png");
ASSET_MANAGER.queueDownload("./sprites/enemy_bullet1.png");
ASSET_MANAGER.queueDownload("./sprites/enemy_bullet2.png");
ASSET_MANAGER.queueDownload("./sprites/test_gun.png");
ASSET_MANAGER.queueDownload("./sprites/bubble_gun.png");
ASSET_MANAGER.queueDownload("./sprites/uzi.png");
ASSET_MANAGER.queueDownload("./sprites/laser.png");
ASSET_MANAGER.queueDownload("./sprites/hearts.png");
ASSET_MANAGER.queueDownload("./sprites/symbol_flower.png");
ASSET_MANAGER.queueDownload("./sprites/numbers.png");
ASSET_MANAGER.queueDownload("./sprites/level1.png");
ASSET_MANAGER.queueDownload("./sprites/level2.png");
ASSET_MANAGER.queueDownload("./sprites/title.png");
ASSET_MANAGER.queueDownload("./sprites/placeholder_title.png");
ASSET_MANAGER.queueDownload("./sprites/tint_screen.png");


ASSET_MANAGER.queueDownload("./sfx/cerise.mp3");
ASSET_MANAGER.queueDownload("./sfx/chiffon.mp3");


ASSET_MANAGER.downloadAll(() => {
	ASSET_MANAGER.autoRepeat("./sfx/chiffon.mp3");

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	gameEngine.init(ctx);
	gameEngine.addEntity(new SceneManager(gameEngine));
	gameEngine.start();
});
