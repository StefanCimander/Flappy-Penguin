function PauseScreen(width, height) {
    var pauseScreen = new createjs.Shape();
    pauseScreen.graphics.beginFill("#eee").drawRect(width / 2 + 16, height / 2 + 16, width / 2, 64);
    pauseScreen.graphics.beginFill("#3e77b2").drawRect(width / 2 + 32, height / 2 + 32, width / 2 - 32, 64);
    pauseScreen.alpha = 0.8;
    return pauseScreen;
}
function PauseText(width, height) {
    var pauseText = new createjs.Text(
        "Press [Enter] or [P] to continue.",
        "24px Segoe UI", "#fff");
    pauseText.x = width / 2 + 48;
    pauseText.y = height / 2 + 46;
    return pauseText;
}
function GameOverText(width, height) {
    var goText = new createjs.Text("Game Over", "24px Sergoe UI", "#fff");
    var b = goText.getBounds();
    
    var goBg = new createjs.Shape();
    goBg.graphics.beginFill("#c00").drawRect(-4, -1 ,b.width + 8, b.height + 2);

    var goSprite = new createjs.Container();
    goSprite.x = (width - b.width) / 2;
    goSprite.y = (height - b.height) / 2;
    goSprite.addChild(goBg);
    goSprite.addChild(goText);
    return goSprite;
}
function GameWonText(width, height) {
    var goText = new createjs.Text("You Won!", "24px Sergoe UI", "#fff");
    var b = goText.getBounds();
    
    var goBg = new createjs.Shape();
    goBg.graphics.beginFill("#0c0").drawRect(-4, -1 ,b.width + 8, b.height + 2);

    var goSprite = new createjs.Container();
    goSprite.x = (width - b.width) / 2;
    goSprite.y = (height - b.height) / 2;
    goSprite.addChild(goBg);
    goSprite.addChild(goText);
    return goSprite;
}
