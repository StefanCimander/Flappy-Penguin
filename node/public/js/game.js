/**
 * keeper of the game State (init, paused, runing)
 * @returns {} 
 */
function Game() {
    var self = this;

    this.stage = new createjs.Stage('stage');

    var scene   = new Scene(self.stage.canvas.width, self.stage.canvas.height);
    var hud     = new HUD(self.stage.canvas.width, self.stage.canvas.height);
    var player  = new Player(self.stage.canvas.width, self.stage.canvas.height);

    var paused = true;
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
        player.registerForRender(self.stage);
        scene.registerForRenderForeground(self.stage);
        hud.registerForRender(self.stage);

        setupGame();
    }


    this.gameUpdate = function () {
        if (!paused) {
            score += 1 / FPS;

            player.update();
            scene.update();
            scene.checkCollisions(player.getGUIObject());
            hud.updateBreath(breath);
        }
    }

    var togglePause = function () {
        paused = !paused;
        if (paused) hud.pause(self.stage);
        else hud.unpause(self.stage);
    }

    var handleKeypress = function (event) {
        if (event.key || event.keyCode) {
            switch (event.keyCode) {
                case 32: //SPACE
                    if (player.getYPos() > TOP_DIST - PINGU_SIZE / 2) player.jump();
                    break;
                case 13: //ENTER
                case 80: //q
                    togglePause();
                    break;
                default:
                    console.log(event.keyCode);
            }
        }
    };
    this.getKeyboardHandler = function () { return handleKeypress; };

    this.breathe = function () {
        breath = (player.getYPos() < TOP_DIST - PINGU_SIZE / 4) ? Math.min(MAX_BREATH, breath + BREATH_REPLENISH_RATE)
                                                                : breath = Math.max(0, breath - BREATH_DECREASE_RATE);
    }
}