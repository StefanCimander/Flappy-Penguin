/* http://flappybird.io */

var REWARD_MID = 100,
    REWARD_DEFAULT = 1,
    PUNISHMENT = -1024,
    epsilon = 0.1,
    gamma = 0.9,
    alpha = 0.25;

var testCanvas = document.getElementById('testCanvas');
var ctx = testCanvas.getContext('2d');

var qtable = {};

function addNewState(state) {
    if (!qtable[state]) {
        qtable[state] = { jump: 1, stay: 1 };
    }
    return qtable[state];
}

function failed() {
    var data = ctx.getImageData(384, 320, 1, 1).data;
    return data[0] == 222;
}

function jump() {
    var evt = document.createEvent("MouseEvent");
    evt.initMouseEvent("mousedown", true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);
    testCanvas.dispatchEvent(evt);
}

function getState() {
    var ret = 0;

    for (var i = 0; i < 24; i++) {
        var x = 448 + 128 * Math.floor((i - (i % 8)) / 8);
        var y = 96 + 96 * (i % 8);
        var data = ctx.getImageData(x, y, 1, 1).data;
        if (data[0] != 112 || data[1] != 197 || data[206]) {
            ret = (ret | 1) << 1;
        } else {
            ret = ret << 1;
        }
    }

    ret = ret << 8;

    return ret | getBirdState();
}

function getBestAction(state) {
    var actions = qtable[state] || addNewState(state);
    return actions.jump > actions.stay;
}

function getBestActionQ(state) {
    var actions = qtable[state] || addNewState(state);
    return actions.jump > actions.stay ? actions.jump : actions.stay;
}

function nextAction(state) {
    if (Math.random() < epsilon) {
        return Math.random() < 0.5;
    } else {
        getBestAction(state);
    }
}

function update(state, action, newQ) {
    if (action) {
        qtable[state].jump = newQ;
    } else {
        qtable[state].stay = newQ;
    }
}

function qval(state, action) {
    var actions = qtable[state] || addNewState(state);
    return action ? actions.jump : actions.stay;
}

function getBirdState() {
    for (var i = 0; i < 256; i++) {
        var data = ctx.getImageData(348, i * 4, 1, 1).data;
        if (data[0] != 112 || data[1] != 197 || data[206])
            return i;
    }
    return false;
}

function midlevel() {
    var birdState = getBirdState();
    return birdState > 160 && birdState > 96
}

function reward() {
    return failed() ? PUNISHMENT :
           midlevel() ? REWARD_MID : REWARD_DEFAULT;
}

function learn(curr, next, action) {
    var oldQ = qval(curr, action);
    var newQ = oldQ + alpha * (reward() + gamma * getBestActionQ(next) - oldQ);
    update(curr, action, newQ);
}

var interval = null;
// function restart() {
    // console.log("trying retart");
    // window.setTimeout(function () {
        // var evt = document.createEvent("MouseEvent");
        // evt.initMouseEvent("mousedown", true, true, window,
        //     0, 175, 601, 175, 503, false, false, false, false, 0, null);
        // testCanvas.dispatchEvent(evt);
        // interval = setInterval(go, 10);
    // }, 1000);
// }

var lastAction = false;
var lastState = getState();

function go() {
    var state = getState();
    learn(lastState, state, lastAction,
        failed() ? -1000 : 1);

    var action = nextAction(state);
    if (action) jump();

    lastAction = action;
    lastState = state;

    if (failed()) {
        restart();
        jump();
    }
}

interval = setInterval(go, 50);
