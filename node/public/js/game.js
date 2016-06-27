function Game() {
    var self = this;

    this.stage = new createjs.Stage('stage');
    this.scene = null;
    this.player = null;

    this.paused = true;

    this.breath = MAX_BREATH;
    this.score = 0;


    var initStage = function () {
        self.stage.rotation = STAGE_ROTATION;
        self.stage.scaleY = STAGE_XSCALE;
        self.stage.scaleX = STAGE_YSCALE;
        self.stage.removeAllChildren();
    };

    var generateObstacles = function(count, flavor) {
        var obstacles = []; 
        for (var i = 0; i < count; i++) {
            obstacles[i] = new createjs.Shape();
            obstacles[i].graphics.beginFill("#fff").drawRect(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            obstacles[i].setBounds(0, 0, MAX_OBSTACLE_SIZE, MAX_OBSTACLE_SIZE);
            obstacles[i].x = (flavor ? 0 : self.stage.canvas.width / 2) + Math.random() * self.stage.canvas.width;
            obstacles[i].y = Math.random() * (self.stage.canvas.height - 75 - TOP_DIST) + TOP_DIST;

            obstacles[i].rotation = Math.random() * 20 - 10;
            obstacles[i].scaleY = 0.5 + (Math.random() / 2);
            obstacles[i].scaleX = obstacles[i].scaleY;
            obstacles[i].alpha = flavor ? 0.1 : 1;
            self.stage.addChild(obstacles[i]);
        }
        return obstacles;
    }

    var generateScene = function () {
        self.scene = {};
        self.scene.bg = new createjs.Shape();
        self.scene.bg.graphics.beginFill("#3e77b2").drawRect(0, 0, self.stage.canvas.width, self.stage.canvas.height);
        self.scene.bg.alpha = 0.5;

        self.scene.water = new createjs.Shape();
        self.scene.water.graphics.beginFill("#88baec").drawRect(0, TOP_DIST, self.stage.canvas.width, self.stage.canvas.height - TOP_DIST);
        self.scene.water.alpha = 0.5;
        
        self.scene.reflection = new createjs.Shape();
        self.scene.reflection.graphics.beginFill("#fff").drawRect(0, TOP_DIST, self.stage.canvas.width, 1);
        self.scene.reflection.alpha = 0.5;
        
        self.scene.penguin = IS_FEMALE ? new createjs.Bitmap(FEMALE_PENGUIN_SPRITE)
                                       : new createjs.Bitmap(MALE_PENGUIN_SPRITE);
        self.scene.penguin.x = self.stage.canvas.width / 4 - 64;
        self.scene.penguin.y = self.stage.canvas.height / 2;


        self.stage.addChild(self.scene.bg);

        self.scene.obstacles = generateObstacles(6, false);
        self.scene.flavorObstacles = generateObstacles(8, true);

        self.stage.addChild(self.scene.penguin);
        self.stage.addChild(self.scene.water);
        self.stage.addChild(self.scene.reflection);
    };
    var setupGUI = function () {
        self.scene.hud = {};
        self.scene.hud.score = new createjs.Text("Flappy Penguin", "32px Segoe UI", "#fff");
        self.scene.hud.score.x = 48;
        self.scene.hud.score.y = 24;
        self.scene.hud.scoretextBaseline = "alphabetic";

        self.scene.hud.pauseScreen = PauseScreen(self.stage.canvas);
        self.scene.hud.pauseText = PauseText(self.stage.canvas);

        self.stage.addChild(self.scene.hud.score);

        self.stage.addChild(self.scene.hud.pauseScreen);
        self.stage.addChild(self.scene.hud.pauseText);

        self.scene.hud.breathBubbles = [];
        for (var i = 0; i < MAX_BREATH; i++) {
            var bubble = new createjs.Bitmap("assets/square/bubble.png");
            bubble.scaleX = 0.5;
            bubble.scaleY = 0.5;
            bubble.x = self.stage.canvas.width - 96;
            bubble.y = self.stage.canvas.height - 64 - i * 48;
            self.stage.addChild(bubble);
            self.scene.hud.breathBubbles[i] = bubble;
        }
    };

    var setupGame = function () {
        self.breath = MAX_BREATH;
        self.score = 0;
        
        self.player = {};
        self.player.shape = self.scene.penguin;
        self.player.yVelocity = -1;
        self.player.yPos = self.stage.canvas.height / 2;
    };
    
    var switchPaused = function () {
        self.paused = !self.paused;

        if (self.paused) {
            self.stage.addChild(self.scene.hud.pauseScreen);
            self.stage.addChild(self.scene.hud.pauseText);
        } else {
            self.stage.removeChild(self.scene.hud.pauseScreen);
            self.stage.removeChild(self.scene.hud.pauseText);
        }
    }

    var handleKeypress = function (event) {
        if (event.key || event.keyCode) {
            switch (event.keyCode) {
                case 32:
                    if (self.player.yPos > TOP_DIST - PINGU_SIZE / 2) self.player.yVelocity = 1;
                    break;
                case 13:
                case 80:
                    switchPaused();
                    break;
                default:
                    console.log(event.keyCode);
            }
        }
    };
    this.getKeyboardHandler = function () { return handleKeypress; };
    this.breath = function() {
        self.breath = (self.scene.penguin.y < TOP_DIST - PINGU_SIZE / 4) ? Math.min(MAX_BREATH, self.breath + BREATH_REPLENISH_RATE)
                                                                         : self.breath = Math.max(0, self.breath - BREATH_DECREASE_RATE);
    }

    //constructor code
    {
        initStage();
        generateScene();
        setupGUI();
        setupGame();
    }


    var updateBreath = function () {
        for (var i = 0; i < MAX_BREATH; i++) {
            self.scene.hud.breathBubbles[i].alpha = (self.breath < i ) ? 0 : (self.breath >= i + 1) ? 1 : self.breath - Math.floor(self.breath);
        }
    }

    var respawnObstacle = function (obstacle) {
        obstacle.y = TOP_DIST / 2 + Math.floor(Math.random() * (self.stage.canvas.height - TOP_DIST));
        obstacle.x = self.stage.canvas.width + Math.random() * MAX_OBSTACLE_SIZE;
        obstacle.rotation = Math.random() * 2 * OBSTACLE_ROTATION - OBSTACLE_ROTATION;
        obstacle.scaleY = 0.5 + (Math.random() / 2);
        obstacle.scaleX = obstacle.scaleY;
        obstacle.scaleY *= STAGE_YSCALE;
        obstacle.scaleX *= STAGE_XSCALE;
        obstacle.alpha = 1;
    }
    var respawnBackgroundObstacle = function(obstacle) {
        obstacle.y = TOP_DIST + Math.floor(Math.random() * (self.stage.canvas.height - TOP_DIST));
        obstacle.x = self.stage.canvas.width + Math.random() * MAX_OBSTACLE_SIZE;
        obstacle.rotation = Math.random() * 2 * OBSTACLE_ROTATION - OBSTACLE_ROTATION;
        obstacle.scaleY = 0.75 + (Math.random() / 2);
        obstacle.scaleX = obstacle.scaleY;
        obstacle.scaleY *= STAGE_YSCALE;
        obstacle.scaleX *= STAGE_XSCALE;
    }

    var updateObstacles = function () {
        self.scene.obstacles.map(function (obstacle) {
            if (collision(self.scene.penguin, obstacle))
                collide(self.scene.player, obstacle);
            
            obstacle.x -= 1;
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnObstacle(obstacle);
        });

        self.scene.flavorObstacles.map(function (obstacle, i) {
            obstacle.x -= (i * 0.5 + 0.75) / 2;
            if (obstacle.x < -1 * MAX_OBSTACLE_SIZE)
                respawnBackgroundObstacle(obstacle);
        });
    }


    this.gameUpdate = function () {
        if (!self.paused) {
            self.score += 1 / FPS;

            self.player.yVelocity -= YVELOCITY_DECREASE;
            if (self.player.yVelocity < -MAX_DROP_SPEED) {
                self.player.yVelocity = -MAX_DROP_SPEED;
            }

            self.player.yPos = self.player.yPos + -1 * MAX_DROP_SPEED * self.player.yVelocity;
            if (self.player.yPos > self.stage.canvas.height - PINGU_SIZE) {
                self.player.yPos = self.stage.canvas.height - PINGU_SIZE;
            }

            self.scene.penguin.y = self.player.yPos;
            self.scene.penguin.x = self.stage.canvas.width / 4 - PINGU_SIZE;

            updateObstacles();

            updateBreath();
        }
    }
}