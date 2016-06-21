function updateBreath(game) {
    if (game.scene.penguin.y < TOP_DIST - PINGU_SIZE / 4) {
        game.breath = Math.min(MAX_BREATH, game.breath + BREATH_REPLENISH_RATE);
    } else {
        game.breath = Math.max(0, game.breath - BREATH_DECREASE_RATE);
    }

    for (var i = 0; i < MAX_BREATH; i++) {
        if (game.breath < i + 1 && game.breath > i) {
            game.scene.gui.breathBubbles[i].alpha = game.breath - Math.floor(game.breath);
        } else if (game.breath < i + 1) {
            game.scene.gui.breathBubbles[i].alpha = 0;
        } else {
            game.scene.gui.breathBubbles[i].alpha = 1;
        }
    }
}