function QLearner(game, alpha, epsilon, gamma, reward, punishment, qtab) {
    var self = this

    var REWARD      = reward        ||  1,
        PUNISHMENT  = punishment    || -1,
        epsilon     = epsilon       || 0.1,
        gamma       = gamma         || 0.6,
        alpha       = alpha         || 0.2;

    var qtable = qtab || {};
    window.qtable = qtable;

    function addNewState(state) {
        if (!qtable[state]) {
            qtable[state] = { jump: Math.random() / 2 + 0.75, stay: Math.random() / 2 + 0.75 };
        }
        return qtable[state];
    }

    function failed() {
        return game.computerPenguinCollided();
    }

    function jump() {
        game.computerPenguinJump();
    }

    function getState() {
        return game.getComputerPenguinState();
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
            return getBestAction(state);
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


    function reward() {
        return failed() ? PUNISHMENT : REWARD;
    }

    function qlearn(curr, next, action) {
        var oldQ = qval(curr, action);
        var newQ = oldQ + alpha * (reward() + gamma * getBestActionQ(next) - oldQ);
        update(curr, action, newQ);
    }

    var lastAction = false;
    var lastState = getState();

    this.learn = function () {
        console.log("learning");
        var state = getState();
        qlearn(lastState, state, lastAction);
        var action = nextAction(state);
        if (action) jump();
        lastAction = action;
        lastState = state;
    }

}