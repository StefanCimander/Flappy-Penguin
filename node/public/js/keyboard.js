function keyboardHandler(game) {
    return function(event) {
        if (event.key || event.keyCode) {
            switch (event.keyCode) {
                case 32:
                    if (game.player.yPos > TOP_DIST - PINGU_SIZE / 2) game.player.yVelocity = 1;
                    break;
                case 13:
                case 80:
                    game.paused = !game.paused;
                    break;
                default: console.log(event.keyCode);
            }
        }
    };
}
