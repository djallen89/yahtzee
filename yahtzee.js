/* Javascript implementation of Yahtzee */

const diceQuantity = 5;
const aces = 1;
const twos = 2;
const threes = 3;
const fours = 4;
const fives = 5;
const sixes = 6;

const fullHouse = 25;
const smallStraight = 30;
const largeStraight = 40;
const yahtzee = 50;

const lowerSection = {
    THREE : 'three', // three of a kind
    FOUR : 'four', // four of a kind
    FULLHOUSE : 'full-house',
    SMSTRAIGHT : 'small-straight',
    LGSTRAIGHT : 'large-straight',
    YAHTZEE : 'yahtzee'
}

let dice = [];

function Die() {
    this.value = 1;
    this.rollable = true;
}

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
	const dieState = dice[idx].rollable;
	dice[idx].rollable = !dieState;
    }
}

function rollDice(dice) {
    for (let die of dice) {
	if (die.rollable) {
	    die.value = rollDie();
	}
    }
}

function sumDice(dice) {
    return dice.reduce((score, die) => score + die.value);
}

function isNKind(dice, quantity) {
    /* fix me: although this is a small array and cheap to compute
       with brute force, it is a bad algorithm. */
    for (let i = 1; i <= 6; i++) {
	let count = dice.filter(die => die.value === i).length;
	if (count >= quantity) {
	    return true;
	}
    }
    
    return false; 
}

function isStraight(dice, quantity) {
    
    return false; //FIXME
}

function isYahtzee(dice) {
    return false; //FIXME
}    

function upperScore(dice, val) {
    let score = 0;
    for (let die of dice) {
	if (die.value === val) {
	    score += val;
	}
    }
    return score;
}

function lowerScore(dice, category) {
    let score = 0;
    switch (category) {
    case lowerSection.THREE :
	if (isNKind(dice, 3)) {
	    score = sumDice(dice);
	}
	break;
    case lowerSection.FOUR :
	if (isNKind(dice, 4)) {
	    score = sumDice(dice);
	}
	break;
    case lowerSection.FULLHOUSE :
	if (isFullHouse(dice)) {
	    score = fullHouse;
	}
	break;
    case lowerSection.SMSTRAIGHT :
	if (isStraight(dice, 4)) {
	    score = smallStraight;
	}
	break;
    case lowerSection.LGSTRAIGHT :
	if (isStraight(dice, 5)) {
	    score = largeStraight;
	}
	break;
    case lowerSection.YAHTZEE :
	if (isYahtzee(dice)) {
	    score = yahtzee;
	}
	break;
    default:
	score = sumDice(dice);
    }
}

dice = createDice(diceQuantity);
