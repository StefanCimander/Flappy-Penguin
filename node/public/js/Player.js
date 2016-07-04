﻿
function Player(width, height) {
    var penguin = new createjs.Bitmap(IS_FEMALE ? FEMALE_PENGUIN_SPRITE : MALE_PENGUIN_SPRITE);

    var yVelocity = -1;
    var yPos = height / 2;

    //constructor code
    {
        penguin.x = width / 4 - PINGU_SIZE;
        penguin.y = height / 2;
    }

    this.registerForRender = function (stage) {
        stage.addChild(penguin);
    }

    this.update = function()
    {
        yVelocity -= YVELOCITY_DECREASE;
        if (yVelocity < -MAX_DROP_SPEED) {
            yVelocity = -MAX_DROP_SPEED;
        }

        yPos = yPos + -1 * MAX_DROP_SPEED * yVelocity;
        if (yPos > height - PINGU_SIZE) {
            yPos = height - PINGU_SIZE;
        }

        penguin.x = width / 4 - PINGU_SIZE;
        penguin.y = yPos;
    }
    this.jump = function() { yVelocity = 1 };
    this.getYPos = function () { return yPos; };
    this.getGUIObject = function () { return penguin; };
}