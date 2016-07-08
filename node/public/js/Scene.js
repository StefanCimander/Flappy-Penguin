/**
 * the scene object contains and manages all objects that act passively in the game (e.g. obstacles)
 * @param {width of the scene} width
 * @param {height of the scene} height
 * @returns {Initialised Scene object. Needs to be manually registered for rendering by calling .registerForRender}
 */
function Scene(width, height) {
    var bg = new createjs.Shape();
    var water = new createjs.Shape();
    var reflection = new createjs.Shape();

    var obstacles = [];
    var flavorObstacles = [];

    var generateObstacles = function (array, count, flavor) {
        for (var i = 0; i < count; i++) {
            array[i] = new createjs.Shape();
            array[i].graphics.beginFill("#fff").drawRect(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            array[i].setBounds(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            array[i].x = (flavor ? 0 : width / 2) + Math.random() * width;
            array[i].y = Math.random() * (height - 75 - TOP_DIST) + TOP_DIST;

            array[i].rotation = Math.random() * 20 - 10;
            array[i].scaleY = 0.5 + (Math.random() / 2);
            array[i].scaleX = array[i].scaleY;
            array[i].alpha = flavor ? 0.1 : 1;
        }
    };

    //constructor code
    {
        bg.graphics.beginFill("#3e77b2").drawRect(0, 0, width, height);
        bg.alpha = 0.5;

        water.graphics.beginFill("#88baec").drawRect(0, TOP_DIST, width, height - TOP_DIST);
        water.alpha = 0.5;

        reflection.graphics.beginFill("#fff").drawRect(0, TOP_DIST, width, 1);
        reflection.alpha = 0.5;

        generateObstacles(obstacles, 6, false);
        generateObstacles(flavorObstacles, 8, true);
    }

    this.registerForRenderBackground = function(stage)
    {
        stage.addChild(bg);

        flavorObstacles.map(function (x) { stage.addChild(x); });
        obstacles.map(function (x) {stage.addChild(x);});
    };

    this.registerForRenderForeground = function (stage) {
        stage.addChild(water);
        stage.addChild(reflection);
    };


    function respawnObstacle(obstacle) {
        obstacle.y = TOP_DIST / 2 + Math.floor(Math.random() * (height - TOP_DIST));
        obstacle.x = width + Math.random() * MAX_OBSTACLE_SIZE;
        obstacle.rotation = Math.random() * 2 * OBSTACLE_ROTATION - OBSTACLE_ROTATION;
        obstacle.scaleY = 0.5 + (Math.random() / 2);
        obstacle.scaleX = obstacle.scaleY;
        obstacle.scaleY *= STAGE_YSCALE;
        obstacle.scaleX *= STAGE_XSCALE;
        obstacle.alpha = 1;
    }

    function respawnBackgroundObstacle(obstacle) {
        obstacle.y = TOP_DIST + Math.floor(Math.random() * (height - TOP_DIST));
        obstacle.x = width + Math.random() * MAX_OBSTACLE_SIZE;
        obstacle.rotation = Math.random() * 2 * OBSTACLE_ROTATION - OBSTACLE_ROTATION;
        obstacle.scaleY = 0.75 + (Math.random() / 2);
        obstacle.scaleX = obstacle.scaleY;
        obstacle.scaleY *= STAGE_YSCALE;
        obstacle.scaleX *= STAGE_XSCALE;
    }

    this.update = function () {
        obstacles.map(function (obstacle) {
            obstacle.x -= 1;
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnObstacle(obstacle);
        });

        flavorObstacles.map(function (obstacle, i) {
            obstacle.x -= (i * 0.5 + 0.75) / 2;
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnBackgroundObstacle(obstacle);
        });
    };

    this.checkCollisions = function (player) {
        obstacles.map(function (obstacle) {
            if (collision(player, obstacle))
                collide(player, obstacle);
        });
    };
}
