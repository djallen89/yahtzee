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
const yahtzeeBonus = 100;

const lowerSectionCategory = {
    THREE : 'three', // three of a kind
    FOUR : 'four', // four of a kind
    FULLHOUSE : 'full-house',
    SMSTRAIGHT : 'small-straight',
    LGSTRAIGHT : 'large-straight',
    YAHTZEE : 'yahtzee'
};

const numRounds = 13;

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

function isNKind(dice, quantity) {
    /* fix me: although this is a small array and cheap to compute
       with brute force, it is a bad algorithm. */
    for (let i = 1; i <= 6; i++) {
	let count = dice.filter(die => die.getValue() === i).length;
	if (count >= quantity) {
	    return true;
	}
    }
    
    return false; 
}

function isStraight(dice, quantity) {
    let sortedDice = dice.concat().sort();
    let seq = 1;
    let last = sortedDice[0].getValue();
    
    for (let i = 1; i < quantity; i++) {
	let next = sortedDice[i].getValue();
	if (next - last === 1) {
	    seq += 1;
	    last = next;
	} else {
	    seq = 1;
	}
    }
    
    return seq >= quantity;
}

function isFullHouse(dice) {
    let sortedDice = dice.concat().sort();
    return (dice[0].getValue() === dice[1].getValue() && // lower 2 pair higher 3s
	     
	    dice[2].getValue() === dice[3].getValue() &&
	    dice[2].getValue() === dice[4].getValue() &&
	    
	    dice[0].getValue() !== dice[2].getValue()) ||
	    
	    (dice[0].getValue() === dice[1].getValue() && // lower 3s higher 2 pair
	     dice[0].getValue() === dice[2].getValue() &&
	     
	     dice[3].getValue() === dice[4].getValue() &&
	     
	     dice[0].getValue() !== dice[3].getValue());
}

function isYahtzee(dice) {
    return (dice[0].getValue() === dice[1].getValue() &&
	    dice[0].getValue() === dice[2].getValue() &&
	    dice[0].getValue() === dice[3].getValue() &&
	    dice[0].getValue() === dice[4].getValue());
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
    case lowerSectionCategory.THREE :
	if (isNKind(dice, 3)) {
	    score = sumDice(dice);
	} 
	break;
    case lowerSectionCategory.FOUR :
	if (isNKind(dice, 4)) {
	    score = sumDice(dice);
	}
	break;
    case lowerSectionCategory.FULLHOUSE :
	if (isFullHouse(dice)) {
	    score = fullHouse;
	}
	break;
    case lowerSectionCategory.SMSTRAIGHT :
	if (isStraight(dice, 4)) {
	    score = smallStraight;
	}
	break;
    case lowerSectionCategory.LGSTRAIGHT :
	if (isStraight(dice, 5)) {
	    score = largeStraight;
	}
	break;
    case lowerSectionCategory.YAHTZEE :
	if (isYahtzee(dice)) {
	    score = yahtzee;
	}
	break;
    default:
	score = sumDice(dice); // chance
    }

    return score;
}

function UpperSection() {
    this.aces = null;
    this.twos  = null;
    this.threes = null;
    this.fours = null;
    this.fives = null;
    this.sixes = null;
    this.totalScore = null;
    this.bonus = null;
    this.total = null;
}

UpperSection.prototype.calcTotalScore = function() {
    this.totalScore = this.aces + this.twos + this.threes + this.fives + this.sixes;
};

UpperSection.prototype.calcBonus = function() {
    if (this.totalScore() >= 63) {
	this.bonus = 35;
    } else {
	this.bonus = 0;
    }
};

UpperSection.prototype.calcTotal = function() {
    this.total =  this.totalScore + this.bonus;
};

function LowerSection() {
    this.threeKind = null;
    this.fourKind = null;
    this.fullHouse = null;
    this.smStraight = null;
    this.lgStaight = null;
    this.yahtzee = null;
    this.chance = null;
    this.yahtzeeBonusCount = [false, false, false];
    this.yahtzeeBonusScore = null;
    this.total = null;
}

LowerSection.prototype.calcYahtzeeBonus = function() {
    this.yahtzeeBonusScore = this.yahtzeeBonusCount.reduce((sum, check) => sum + check ? yahtzeeBonus : 0, 0);
};

LowerSection.prototype.calcTotal = function () {
    this.total = this.threeKind + this.fourKind + this.fullHouse +
	this.smStraight + this.lgStaight + this.yahtzee + this.chance + this.yahtzeeBonusScore;
};

function Scorecard() {
    this.upperSection = new UpperSection();
    this.lowerSection = new LowerSection();
    this.grandTotal = null;
}

Scorecard.prototype.grandTotal = function() {
    this.grandTotal = this.upperSection.total + this.lowerSection.total;
};

let dice = createDice(diceQuantity);
