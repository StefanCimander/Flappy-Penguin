
function HUD(width, height) {
    var self = this;

    var score = new createjs.Text("Flappy Penguin", "32px Segoe UI", "#fff");
    var pauseScreen = PauseScreen(width, height);
    var pauseText = PauseText(width, height);
    var gameLostText = GameOverText(width, height);
    var gameWonText = GameWonText(width, height);
    var breathBubbles = [];

    var stage = null;

    //constructor code
    {
        score.x = 48;
        score.y = 24;

        for (var i = 0; i < MAX_BREATH; i++) {
            var bubble = new createjs.Bitmap("assets/square/bubble.png");
            bubble.scaleX = 0.5;
            bubble.scaleY = 0.5;
            bubble.x = width - 96;
            bubble.y = height - 64 - i * 48;
            breathBubbles.push(bubble);
        }
    }

    this.registerForRender = function (renderStage) {
        stage = renderStage;
        stage.addChild(score);

        breathBubbles.map(function (x) {stage.addChild(x);});

        stage.addChild(pauseScreen);
        stage.addChild(pauseText);
    };

    this.updateBreath = function (breath) {
        for (var i = 0; i < MAX_BREATH; i++) {
            breathBubbles[i].alpha = (breath < i) ? 0 : (breath >= i + 1) ? 1 : breath - Math.floor(breath);
        }
    };

    this.pause = function () {
        stage.addChild(pauseScreen);
        stage.addChild(pauseText);
    };

    this.unpause = function () {
        stage.removeChild(pauseScreen);
        stage.removeChild(pauseText);
    };

    var goWon = false;
    var goLost = false;
    this.showGameOverFailure = function () {
        goLost = true;
        stage.addChild(gameLostText);
    };
    this.showGameOverSuccess = function () {
        goWon = true;
        stage.addChild(gameWonText);
    };
    this.clearGameOver = function () {
        if (goWon) stage.removeChild(gameWonText);
        if (goLost) stage.removeChild(gameLostText);
        goWon = false;
        goLost = false;
    };
}
