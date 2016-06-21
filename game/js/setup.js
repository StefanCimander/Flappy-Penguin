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

    function generateObstacles(count, stage) {
        var obstacles = [];
        for (var i = 0; i < count; i++) {
            obstacles[i] = new createjs.Shape();
            obstacles[i].graphics.beginFill('#fff').drawRect(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            obstacles[i].setBounds(0,0,MAX_OBSTACLE_SIZE,MAX_OBSTACLE_SIZE);
            obstacles[i].x = stage.canvas.width / 2 + Math.random() * stage.canvas.width;
            obstacles[i].y = Math.random() * (stage.canvas.height - 75 - TOP_DIST) + TOP_DIST;
            obstacles[i].rotation = Math.random() * 20 - 10;
            obstacles[i].scaleY = 0.5 + (Math.random() / 2);
            obstacles[i].scaleX = obstacles[i].scaleY;
            stage.addChild(obstacles[i]);
        }
        return obstacles;
    }

    scene.obstacles = generateObstacles(6, stage);

    stage.addChild(scene.penguin);
    stage.addChild(scene.water);
    stage.addChild(scene.reflection);

    return scene;
}

function setupGUI(stage, scene) {
    scene.hud = {}
    scene.hud.score = new createjs.Text("0", "24px Segoe UI", "#fff");
    scene.hud.score.x = 48;
    scene.hud.score.y = 24;
    scene.hud.scoretextBaseline = "alphabetic";

    stage.addChild(scene.hud.score);

    scene.hud.breathBubbles = [];
    for (var i = 0; i < MAX_BREATH; i++) {
        var bubble  = new createjs.Bitmap('assets/square/bubble.png');
            bubble.scaleX = 0.25;
            bubble.scaleY = 0.25;
            bubble.x = stage.canvas.width - 48;
            bubble.y = 24 + i * 25;
            stage.addChild(bubble);
        scene.hud.breathBubbles[i] = bubble;
    }
}

function setupGame(game) {
    game.breath = MAX_BREATH;
    game.score = 0;

    game.player = {}
    game.player.shape = game.scene.penguin;
    game.player.yVelocity = -1;
    game.player.yPos = game.stage.canvas.height - PINGU_SIZE;
}
