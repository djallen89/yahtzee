const diceQuantity = 5;

function Die() {
    this.value = 1;
    this.rollable = true;
}

Die.prototype.getValue = function() {
    return this.value;
};

Die.prototype.setValue = function(val) {
    this.value = val;
};

Die.prototype.toggleRollable = function() {
    this.rollable = !this.rollable;
};

function printDie(die) {
    console.log(die.value + " " + die.rollable);
}

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function createDice(quantity) {
    let dice = [];
    for (let i = 0; i < quantity; i++) {
	dice.push(new Die());
    }
    return dice;
}

function printDice(dice) {
    let i = 0;
    for (let die of dice) {
	printDie(die);
    }
}

function toggleDice(dice, toggleList) {
    for (let idx of toggleList) {
	dice[idx].toggleRollable();
    }
}

function rollDice(dice) {
    for (let die of dice) {
	if (die.rollable) {
	    die.setValue(rollDie());
	}
    }
}

function sumDice(dice) {
    return dice.reduce((score, die) => score + die.value, 0);
}
