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

    scene.penguin = IS_FEMALE ? new createjs.Bitmap("assets/square/pingu_female.png")
                              : new createjs.Bitmap("assets/square/pingu_male.png");
    scene.penguin.x = stage.canvas.width / 4 - 64;
    scene.penguin.y = stage.canvas.height / 2;

    stage.addChild(scene.bg);

    function generateObstacles(count, stage) {
        var obstacles = [];
        for (var i = 0; i < count; i++) {
            obstacles[i] = new createjs.Shape();
            obstacles[i].graphics.beginFill('#fff').drawRect(0, 0, 150, 150);
            obstacles[i].setBounds(0,0,150,150);
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
    scene.gui = {}
    scene.gui.score = new createjs.Text("0", "24px Segoe UI", "#fff");
    scene.gui.score.x = 40;
    scene.gui.score.y = 40;
    scene.gui.scoretextBaseline = "alphabetic";

    stage.addChild(scene.gui.score);

    scene.gui.breathBubbles = [];
    for (var i = 0; i < MAX_BREATH; i++) {
        var bubble  = new createjs.Shape();
            bubble.graphics.beginFill('#abe2fc').drawCircle(stage.canvas.width - 45, 45 + i * 25, 10);
            stage.addChild(bubble);
        scene.gui.breathBubbles[i] = bubble;
    }
}