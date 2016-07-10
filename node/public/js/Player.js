
function Player(width, height, spawnX, spawnY, gender, diver) {
    var penguin = new createjs.Bitmap(gender === GENDER_MALE ?
            (diver ? MALE_PENGUIN_DIVER_SPRITE : MALE_PENGUIN_SPRITE) :
            (diver ? FEMALE_PENGUIN_DIVER_SPRITE : FEMALE_PENGUIN_SPRITE));

    var yVelocity = -1;

    var stunned = false;
    var stunremain = 0;

    //constructor code
    {
        penguin.x = spawnX;
        penguin.y = spawnY;
    }

    this.registerForRender = function (stage) {
        stage.addChild(penguin);
    };


    // var stunfactor = 0;
    // var stunincrease = 0;

    this.update = function(dt) {
        if (!stunned) {
            yVelocity = Math.max(yVelocity - YVELOCITY_DECREASE * dt, - MAX_DROP_SPEED);
            penguin.y = Math.min(penguin.y - yVelocity * dt, height - PINGU_SIZE);
            penguin.x += /* (1 - stunfactor) * */ SCENE_X_SPEED * dt;
        } else {
            stunremain -= dt;
            stunned = stunremain > 0;
        }

        // stunfactor = Math.max(0, stunfactor + stunincrease);
        // stunincrease -= 0.1;
    };

    this.stun = function (duration) {
        // stunincrease = 1;
        stunned = true;
        stunremain = duration;
    };

    this.jump           = function () {
        if (penguin.y > TOP_DIST - PINGU_SIZE / 2)
            yVelocity = JUMP_SPEED;
    };

    this.getYPos        = function () { return penguin.y; };
    this.getXPos        = function () { return penguin.x; };
    this.getGUIObjects  = function () { return [penguin]; };
    this.getGUIObject   = function () { return penguin; };

    /**
     * queries if the player-object is colliding with an obstacle.
     * @returns {true: colliding; false: not colliding}
     */
    this.isColliding    = function (obstacles) {
        var obs = obstacles.filter(function (o) {
            var bounds = o.getTransformedBounds();
            return bounds.x + bounds.width > penguin.x;
        });
        for (var i = 0; i < obs.length; i++) {
            if (collision(penguin, obs[i])) {
                return true;
            }
        }
        return false;
    };
}
