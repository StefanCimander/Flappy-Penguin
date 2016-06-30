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