
function HUD(width, height) {

    var score = new createjs.Text("Flappy Penguin", "32px Segoe UI", "#fff");
    var scoretextBaseline = "alphabetic";                   //TODO @thomas: provide rationale (score.textBaseline?)
    var pauseScreen = PauseScreen(width, height);
    var pauseText = PauseText(width, height);
    var breathBubbles = [];

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

    this.registerForRender = function (stage) {
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

    this.pause = function (stage) {
        stage.addChild(pauseScreen);
        stage.addChild(pauseText);
    };

    this.unpause = function (stage) {
        stage.removeChild(pauseScreen);
        stage.removeChild(pauseText);
    };

}
