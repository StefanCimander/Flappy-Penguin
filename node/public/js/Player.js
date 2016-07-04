
function Player(width, height, spawnX, spawnY, gender) {
    var penguin = new createjs.Bitmap(gender === GENDER_MALE ? MALE_PENGUIN_SPRITE : FEMALE_PENGUIN_SPRITE);


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

    this.update = function(dt)
    {
        if (!stunned) {
            yVelocity = Math.max(yVelocity - YVELOCITY_DECREASE * dt, -MAX_DROP_SPEED);
            penguin.y = Math.min(penguin.y - yVelocity * dt, height - PINGU_SIZE);
            penguin.x += SCENE_X_SPEED * dt;
        } else {
            stunremain -= dt;
            stunned = stunremain > 0;
        }
    }

    this.stun = function (duration) {
        console.log("stunned " + duration);
        stunned = true;
        stunremain = duration;
    };

    this.jump = function () { yVelocity = JUMP_SPEED };

    this.getYPos = function () { return penguin.y; };
    this.getXPos = function () { return penguin.x; };
    this.getGUIObjects = function () { return [penguin]; };
    this.getGUIObject = function () { return penguin; }
}