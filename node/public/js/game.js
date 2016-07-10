/**
 * keeper of the game State (init, paused, runing)
 * @returns {}
 */
function Game() {
    var self = this;

    this.stage = new createjs.Stage('stagec');

    var scene  = new Scene(self.stage);
    var hud    = new HUD(self.stage.canvas.width, self.stage.canvas.height);
    var player = new Player(self.stage.canvas.width,
                            self.stage.canvas.height,
                            self.stage.canvas.width / 4 - PINGU_SIZE,
                            self.stage.canvas.height / 2, GENDER_MALE);
    var chased = new Player(self.stage.canvas.width,
                            self.stage.canvas.height,
                            self.stage.canvas.width * 3 / 4 - PINGU_SIZE,
                            self.stage.canvas.height / 2, GENDER_FEMALE, true);

    var paused = true;
    var gameover = false;
    var breath = MAX_BREATH;
    var score = 0;


    var initStage = function () {
        self.stage.rotation = STAGE_ROTATION;
        self.stage.scaleY = STAGE_XSCALE;
        self.stage.scaleX = STAGE_YSCALE;
        self.stage.removeAllChildren();
    };

    var setupGame = function () {
        breath = MAX_BREATH;
        score = 0;
    };


    //constructor code
    {
        initStage();

        scene.registerForRenderBackground(self.stage);
        chased.registerForRender(self.stage);
        player.registerForRender(self.stage);
        scene.registerForRenderForeground(self.stage);
        hud.registerForRender(self.stage);

        setupGame();
    }

    this.isPaused = function () { return paused; };
    this.isGameOver = function () { return gameover; };

    var timestamp = Date.now();

    this.gameUpdate = function () {
        var dt = (Date.now() - timestamp) / 1000;
        timestamp = Date.now();

        if (!paused) {
            score += dt;

            var playerOldX = player.getXPos();
            player.update(dt);
            chased.update(dt);

            var dxScene = player.getXPos() - playerOldX;
            scene.update(dt, dxScene, self.stage);

            if (dxScene > 0) {
                [scene, player, chased].map(function (c) { c.getGUIObjects().map(function (o) { o.x -= dxScene; }) });
            }

            var obstacles = scene.getObstacles();
            [player, chased].map(function (p) {
                checkCollision(p, obstacles, function (obstacle) {
                    if (obstacle.alpha === 1) {
                        p.stun(STUN_DURATION);
                        obstacle.alpha = 0;
                        scene.shatter(obstacle);
                    }
                });
            });

            if (collision(player.getGUIObject(), chased.getGUIObject())) {
                //end Game
            }

            hud.updateBreath(breath);
        }
    };

    function togglePause() {
        paused = !paused;
        if (paused) hud.pause(self.stage);
        else hud.unpause(self.stage);
    }
    this.togglePause = togglePause;

    function checkCollision(object, obstacles, collisionCallback) {
        var colliding = false;
        obstacles.map(function (obstacle) {
            if (collision(object.getGUIObject(), obstacle)) {
                collisionCallback(obstacle);
                colliding = true;
            }
        });
        return colliding;
    }


    this.breathe = function () {
        if (!paused) {
            breath = (player.getYPos() < TOP_DIST - PINGU_SIZE / 4) ? Math.min(MAX_BREATH, breath + BREATH_REPLENISH_RATE)
                                                                    : breath = Math.max(0, breath - BREATH_DECREASE_RATE);
            scene.addBubbles(16, player);
        }
    };

    this.jump = function () {
        player.jump();
    };


    // Returns true when computer penguin is "currently" {in the last tick? since the last call? called every tick?} colliding with an ice cube
    this.computerPenguinCollided = function () { return chased.isColliding(scene.getObstacles()); };

    // Makes the computer penguin jump
    this.computerPenguinJump = function () { chased.jump(); };

    // Encodes{how?} position of the computer controlled penguin and the (relevant{?}) obstacles
    // preferable in a very limited domain{?}
    this.getComputerPenguinState = function () {
        var x = chased.getXPos();
        var y = chased.getYPos();
        var obstaclesState = 0;
        for (var i = 0; i < 16; i++) {
            if (scene.obstacleAt(
                Math.floor(i / 6) * (self.stage.canvas.width - x) / 4,
                TOP_DIST + (i % 4) * (self.stage.canvas.height - TOP_DIST) / 4
            )) {
                obstaclesState |= 1;
            }
            obstaclesState = obstaclesState << 1;
        }

        var discreetYPos = Math.floor(y / self.stage.canvas.height * 64);

        return (obstaclesState << 6) | discreetYPos;
    };

}
