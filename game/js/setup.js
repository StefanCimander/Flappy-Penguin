function initStage(stage) {
    stage.rotation = STAGE_ROTATION;
    stage.scaleY = STAGE_XSCALE;
    stage.scaleX = STAGE_YSCALE;
}

function generateScene(stage) {
    var scene = {};
    scene.bg = new createjs.Shape();
    scene.bg.graphics.beginFill('#3e77b2').drawRect(0,0,stage.canvas.width, stage.canvas.height);
    scene.bg.alpha = 0.5;

    scene.water = new createjs.Shape();
    scene.water.graphics.beginFill('#88baec').drawRect(0,TOP_DIST,stage.canvas.width, stage.canvas.height - TOP_DIST);
    scene.water.alpha = 0.5;

    scene.reflection = new createjs.Shape();
    scene.reflection.graphics.beginFill('#fff').drawRect(0,TOP_DIST,stage.canvas.width,1);
    scene.reflection.alpha = 0.5;

    scene.penguin = IS_FEMALE ? new createjs.Bitmap(FEMALE_PENGUIN_SPRITE)
                              : new createjs.Bitmap(MALE_PENGUIN_SPRITE);
    scene.penguin.x = stage.canvas.width / 4 - 64;
    scene.penguin.y = stage.canvas.height / 2;

    stage.addChild(scene.bg);

    function generateObstacles(count, stage, flavor) {
        var obstacles = [];
        for (var i = 0; i < count; i++) {
            obstacles[i] = new createjs.Shape();
            obstacles[i].graphics.beginFill('#fff').drawRect(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            obstacles[i].setBounds(0,0,MAX_OBSTACLE_SIZE,MAX_OBSTACLE_SIZE);
            obstacles[i].x = (!!flavor ? 0 : stage.canvas.width / 2) + Math.random() * stage.canvas.width;
            obstacles[i].y = Math.random() * (stage.canvas.height - 75 - TOP_DIST) + TOP_DIST;

            obstacles[i].rotation = Math.random() * 20 - 10;
            obstacles[i].scaleY = 0.5 + (Math.random() / 2);
            obstacles[i].scaleX = obstacles[i].scaleY;
            if (!!flavor) obstacles[i].alpha = 0.1;
            stage.addChild(obstacles[i]);
        }
        return obstacles;
    }

    scene.obstacles = generateObstacles(6, stage);
    scene.flavorObstacles = generateObstacles(8, stage, true);

    stage.addChild(scene.penguin);
    stage.addChild(scene.water);
    stage.addChild(scene.reflection);

    return scene;
}

function setupGUI(stage, scene) {
    scene.hud = {};
    scene.hud.score = new createjs.Text("Flappy Penguin", "32px Segoe UI", "#fff");
    scene.hud.score.x = 48;
    scene.hud.score.y = 24;
    scene.hud.scoretextBaseline = "alphabetic";

    scene.hud.pauseScreen = new createjs.Shape();
    scene.hud.pauseScreen.graphics.beginFill('#eee').drawRect(
        stage.canvas.width / 2 + 16,
        stage.canvas.height / 2 + 16,
        stage.canvas.width / 2,
        64);
    scene.hud.pauseScreen.graphics.beginFill('#3e77b2').drawRect(
        stage.canvas.width / 2 + 32,
        stage.canvas.height / 2 + 32,
        stage.canvas.width / 2 - 32, 64);
    scene.hud.pauseScreen.alpha = 0.8;

    scene.hud.pauseText = new createjs.Text(
        "Press [Enter] or [P] to continue.",
        '24px Segoe UI', '#fff');
    scene.hud.pauseText.x = stage.canvas.width / 2 + 48;
    scene.hud.pauseText.y = stage.canvas.height / 2 + 46;

    stage.addChild(scene.hud.score);

    scene.hud.breathBubbles = [];
    for (var i = 0; i < MAX_BREATH; i++) {
        var bubble  = new createjs.Bitmap('assets/square/bubble.png');
            bubble.scaleX = 0.5;
            bubble.scaleY = 0.5;
            bubble.x = stage.canvas.width - 96;
            bubble.y = stage.canvas.height - 64 - i * 48;
            stage.addChild(bubble);
        scene.hud.breathBubbles[i] = bubble;
    }
}

function setupGame(game) {
    game.breath = MAX_BREATH;
    game.score = 0;

    game.player = {};
    game.player.shape = game.scene.penguin;
    game.player.yVelocity = -1;
    game.player.yPos = game.stage.canvas.height / 2;
}
