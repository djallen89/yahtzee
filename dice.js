const diceQuantity = 5;

function Die() {
    this.value = 1;
    this.rollable = true;
}

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
    return Array.from({length: quantity}, _elt => new Die());
}

function printDice(dice) {
    dice.map(die => printDie(die));
}

function toggleDice(dice, toggleList) {
    toggleList.map(idx => dice[idx].toggleRollable());
}

function rollDice(dice) {
    dice.filter(die => die.rollable).map(die => die.value = rollDie());
}

function sumDice(dice) {
    return dice.reduce((score, die) => score + die.value, 0);
}

function dieCompare(a, b) {
    return a.value - b.value;
}
