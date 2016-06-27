function PauseScreen(canvas) {
    var pauseScreen = new createjs.Shape();
    pauseScreen.graphics.beginFill("#eee").drawRect(canvas.width / 2 + 16,
                                                    canvas.height / 2 + 16,
                                                    canvas.width / 2, 64);
    pauseScreen.graphics.beginFill("#3e77b2").drawRect(canvas.width / 2 + 32,
                                                       canvas.height / 2 + 32,
                                                       canvas.width / 2 - 32, 64);
    pauseScreen.alpha = 0.8;
    return pauseScreen;
}
function PauseText(canvas) {
    var pauseText = new createjs.Text(
        "Press [Enter] or [P] to continue.",
        "24px Segoe UI", "#fff");
    pauseText.x = canvas.width / 2 + 48;
    pauseText.y = canvas.height / 2 + 46;
    return pauseText;
}