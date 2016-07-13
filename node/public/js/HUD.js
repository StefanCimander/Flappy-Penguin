
function HUD(width, height) {
    var self = this;

    var header = new createjs.Text("Flappy Penguin", "32px Segoe UI", "#fff");
    var score = new createjs.Text("0.0", "32px Sergoe UI", "#fff");
    var pauseScreen = PauseScreen(width, height);
    var pauseText = PauseText(width, height);
    var gameLostText = GameOverText(width, height);
    var gameWonText = GameWonText(width, height);
    var breathBubbles = [];

    var stage = null;

    //constructor code
    {
        header.x = 48;
        header.y = 24;
        score.x = width - 48;
        score.y = 24;
        score.textAlign = "right";

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
        renderStage.addChild(header);

        breathBubbles.map(function (x) { renderStage.addChild(x); });

        renderStage.addChild(score);

        renderStage.addChild(pauseScreen);
        renderStage.addChild(pauseText);
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

    this.updateScore = function (newScore) {
        score.text = newScore.toFixed(1);
    }
}
