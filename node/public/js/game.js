/**
 * keeper of the game State (init, paused, runing)
 * @returns {}
 */
function Game() {
    var self = this;

    this.stage  = new createjs.Stage('stage');

    var scene   = new Scene(self.stage.canvas.width, self.stage.canvas.height);
    var hud     = new HUD(self.stage.canvas.width, self.stage.canvas.height);
    var player = new Player(self.stage.canvas.width, self.stage.canvas.height, self.stage.canvas.width / 4 - PINGU_SIZE, self.stage.canvas.height / 2, GENDER_MALE);
    var chased = new Player(self.stage.canvas.width,
                            self.stage.canvas.height,
                            self.stage.canvas.width * 3 / 4 - PINGU_SIZE,
                            self.stage.canvas.height / 2, GENDER_FEMALE, true);

    var bubbles = [];
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
            scene.update(dt);

            if (dxScene > 0)
                [scene, player, chased].map(function (c) { c.getGUIObjects().map(function (o) { o.x -= dxScene; }) });

            scene.checkCollisions([player, chased]);
            if (collision(player.getGUIObject(), chased.getGUIObject())) {
                //end Game
            }

            hud.updateBreath(breath);
            bubbles.map(function (bubble, i) {
                bubble.rotation += 0.1;
                bubble.alpha -= 0.001;
                bubble.x -= 1 + i % 3 * 0.25;
                bubble.y -= 1 + i % 3 * 0.2;
                bubble.scaleX *= 1.001;
                bubble.scaleY = bubble.scaleX;
                if (bubble.y < TOP_DIST) clearBubble(bubble, self.stage);
            });
        }
    };

    var togglePause = function () {
        paused = !paused;
        if (paused) hud.pause(self.stage);
        else hud.unpause(self.stage);
    };



    function addBubble() {
        var bubble = new createjs.Bitmap(BUBBLE);
        bubble.x = player.getXPos() + 0.75 * PINGU_SIZE;
        bubble.y = player.getYPos() + 0.25 * PINGU_SIZE;
        bubble.scaleX = Math.random() * 0.1 + 0.1;
        bubble.scaleY = bubble.scaleX;
        self.stage.addChild(bubble);
        bubbles.push(bubble);
    }

    function clearBubble(bubble) {
        self.stage.removeChild(bubble);
        // TODO: Remove from bubbles array
    }

    this.breathe = function () {
        if (!paused) {
            breath = (player.getYPos() < TOP_DIST - PINGU_SIZE / 4) ? Math.min(MAX_BREATH, breath + BREATH_REPLENISH_RATE)
                                                                    : breath = Math.max(0, breath - BREATH_DECREASE_RATE);
            addBubble();
            addBubble();
            addBubble();
        }
    };

    this.jump = function () {
        player.jump();
    };

    var handleKeypress = function (event) {
        if (event.key || event.keyCode) {
            switch (event.keyCode) {
                case 32: //SPACE
                    self.jump();
                    break;
                case 13: // ENTER
                case 80: // P
                    togglePause();
                    break;
                case 81: // Q
                    self.breathe();
                    break;
                default:
                    console.log(event.keyCode);
            }
        }
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

    this.getKeyboardHandler = function () { return handleKeypress; };
}
