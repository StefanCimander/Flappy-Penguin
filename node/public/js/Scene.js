/**
 * the scene object contains and manages all objects that act passively in the game (e.g. obstacles)
 * @param {stage object the scene is to be drawn on} stage
 * @returns {Initialised Scene object. Needs to be manually registered for rendering by calling .registerForRender}
 */
function Scene(stage) {
    var width = stage.canvas.width;
    var height = stage.canvas.height;

    var bg = new createjs.Shape();
    var water = new createjs.Shape();
    var reflection = new createjs.Shape();

    var obstacles = [];
    var flavorObstacles = [];
    var shards = [];
    var bubbles = [];

    this.getObstacles = function () { return obstacles; };

    function generateObstacles(array, count, flavor) {
        for (var i = 0; i < count; i++) {
            if (array[i] == null) array[i] = new createjs.Shape();
            array[i].graphics.beginFill("#fff").drawRect(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            array[i].setBounds(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            array[i].x = (flavor ? 0 : width / 2) + Math.random() * width;
            array[i].y = Math.random() * (height - 75 - TOP_DIST) + TOP_DIST;

            array[i].rotation = Math.random() * 20 - 10;
            array[i].scaleY = 0.5 + (Math.random() / 2);
            array[i].scaleX = array[i].scaleY;
            array[i].alpha = flavor ? 0.1 : 1;
        }
    }

    function addBubbles(n, player) {
        function addBubble() {
            var bubble = new createjs.Bitmap(BUBBLE);
            bubble.x = player.getXPos() + 0.75 * PINGU_SIZE;
            bubble.y = player.getYPos() + 0.25 * PINGU_SIZE;
            bubble.scaleX = Math.random() * 0.1 + 0.1;
            bubble.scaleY = bubble.scaleX;
            stage.addChild(bubble);
            bubbles.push(bubble);
        }
        for (var i = 0; i < n; i++) {
            addBubble();
        }
    }

    function clearBubble(bubble) {
        stage.removeChild(bubble);
        var i = bubbles.indexOf(bubble);
        i == -1 || delete bubbles[i];   //what kind of hacky code is this? (btw. VSWarning: use === to prevent coerce
    }

    this.addBubbles = addBubbles;

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

    this.registerForRenderBackground = function() {
        stage.addChild(bg);

        flavorObstacles.map(function (x) { stage.addChild(x); });
        obstacles.map(function (x) {stage.addChild(x);});
    };

    this.registerForRenderForeground = function () {
        stage.addChild(water);
        stage.addChild(reflection);
    };

    this.obstacleAt = function (x, y) {
        for (var i = 0; i < obstacles.length; i++) {
            if (obstacles[i].getTransformedBounds().contains(x,y)) return true;
        }
        return false;
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

    this.update = function (dx) {
        obstacles.map(function (obstacle) {
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnObstacle(obstacle);
        });

        flavorObstacles.map(function (obstacle, i) {
            obstacle.x -= (i * 0.1 + 0.75) / 2;
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnBackgroundObstacle(obstacle);
        });

        // Moves bubbles irregularly upwards
        bubbles.map(function (bubble, i) {
            bubble.rotation += 0.1;
            bubble.alpha    -= 0.001;
            bubble.x        -= 1 + (i % (3 + Math.floor(Math.random() * 3))) * 0.25; // Don't mind this magic-numbering
            bubble.y        -= 1 + (i % (3 + Math.floor(Math.random() * 7))) * 0.2;
            bubble.scaleX   *= 1.001;
            bubble.scaleY    = bubble.scaleX;
            if (bubble.y < TOP_DIST) clearBubble(bubble);
        });

        shards.map(function (s) { s.update(dx); });
    };

    /**
     *  Creates ice-block shards for a given obstacle ice-block.
     */
    function shatter(obstacle) {
        /** Tmp class holding shape object and update method */
        function Shard(size) {          //TODO: refactor this to be resetable at game reset
            var shape = new createjs.Shape();
            shape.graphics.beginFill("#fff").drawRect(0, 0, size, size);
            shape.alpha = 0.8;
            this.update = function (dx) {
                    shape.x -= dx < 1 ? 2 : dx;
                    shape.rotation += Math.random() * 3 - 3;
                    shape.alpha -= 0.01 * Math.random();
                    if (shape.alpha <= 0) {
                        stage.removeChild(shape);
                        var i = shards.indexOf(this);
                        delete shards[i];
                    }
            };
            this.getShape = function () { return shape; };
        }

        function generateShards(n) {
            for (var i = 0; i < n; i++) {
                var size =  (Math.random() + 0.5) * obstacle.getTransformedBounds().width / n * 4;
                var shard = new Shard(size);
                var shape = shard.getShape();
                shape.x = obstacle.x + Math.random() * obstacle.getTransformedBounds().width;
                shape.y = obstacle.y + Math.random() * obstacle.getTransformedBounds().height;
                stage.addChild(shape);
                shards.push(shard);
            }
        }
        generateShards(16);
    }
    this.shatter = shatter;

    this.getGUIObjects = function () { return obstacles; };
    this.reset = function () {
        generateObstacles(obstacles, 6, false);
        generateObstacles(flavorObstacles, 8, true);
        //TODO: remove shards and Bubles
    };
}
