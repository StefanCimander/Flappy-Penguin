/**
 * keeper of the game State (init, paused, runing)
 * @returns {}
 */
function Game() {
    var self = this;

    //Scene and RenderTarget
    this.stage = new createjs.Stage('stagec');
    function initStage () {
        self.stage.rotation = STAGE_ROTATION;
        self.stage.scaleY = STAGE_XSCALE;
        self.stage.scaleX = STAGE_YSCALE;
        self.stage.removeAllChildren();
    };

    var width = self.stage.canvas.width;
    var height = self.stage.canvas.height;

    var scene  = new Scene(self.stage);
    var hud = new HUD(width, height);

    //Game Elements
    var player = new Player(width, height, width / 4 - PINGU_SIZE, height / 2, GENDER_MALE);
    var chased = new Player(width, height, width * 3 / 4 - PINGU_SIZE, height / 2, GENDER_FEMALE, true);

    var breath = MAX_BREATH;
    var score = 0;

    var setupGame = function () {
        player.reset();
        chased.reset();
        scene.reset();

        breath = MAX_BREATH;
        score = 0;
    };

    //Game State
    var paused = true;       //refactoring neede, dificult to synch with HUD
    var gameover = false;
    
    this.isPaused = function () { return paused; };
    this.isGameOver = function () { return gameover; };
    function pauseGame () {
        if (!paused) hud.pause();
        paused = true;
    }
    function unpauseGame() {
        if (paused) hud.unpause();
        paused = false;
    }
    function togglePause() {
        paused = !paused;
        if (paused) hud.pause(self.stage);
        else hud.unpause(self.stage);
    }
    function endGameSuccess() {
        pauseGame();
        gameover = true;
        hud.showGameOverSuccess();
    }
    function endGameFailure () {
        pauseGame();
        gameover = true;
        hud.showGameOverFailure();
    }
    function restartGame () {
        //assert(self.isPaused());
        setupGame();
        hud.clearGameOver();
        gameover = false;
    }
    this.handleKeyPause = function(){
        if (gameover)
            restartGame();
        else {
            togglePause();
        }
    }

    //constructor code
    {
        initStage();
        setupGame();

        scene.registerForRenderBackground(self.stage);
        chased.registerForRender(self.stage);
        player.registerForRender(self.stage);
        scene.registerForRenderForeground(self.stage);
        hud.registerForRender(self.stage);
    }


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
            chased.getGUIObject().x = Math.max(chased.getXPos(), player.getXPos());

            hud.updateBreath(breath);

            if (chased.getXPos() >= width || breath === 0) 
                endGameFailure();
            if (collision(player.getGUIObject(), chased.getGUIObject())) 
                endGameSuccess();
        }
    };

    
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
