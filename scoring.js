const FULLHOUSE = 25;
const SMALLSTRAIGHT = 30;
const LARGESTRAIGHT = 40;
const YAHTZEE = 50;
const YAHTZEEBONUS = 100;

const lowerSectionCategory = {
    THREE : 'three-kind', // three of a kind
    FOUR : 'four-kind', // four of a kind
    FULLHOUSE : 'full-house',
    SMSTRAIGHT : 'small-straight',
    LGSTRAIGHT : 'large-straight',
    YAHTZEE : 'yahtzee'
};

function categorize(category_name) {
    switch (category_name) {
    case 'aces':
	return 1;
    case 'twos':
	return 2;
    case 'threes':
	return 3;
    case 'fours':
	return 4;
    case 'fives':
	return 5;
    case 'sixes':
	return 6;
    default:
	return category_name;
    }
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
    let sortedDice = dice.concat().sort(dieCompare);
    let seq = 1;
    let last = sortedDice[0].value;

    for (let i = 0; i < quantity; i++) {
	let next = sortedDice[i].value;
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
    let sortedDice = dice.concat().sort(dieCompare);
    return (sortedDice[0].value === sortedDice[1].value && // pair (less than triplet)
	     
	    sortedDice[2].value === sortedDice[3].value && // triplet 
	    sortedDice[2].value === sortedDice[4].value &&
	    
	    sortedDice[0].value !== sortedDice[2].value) || // pair is not the same as triplet
	    
	    (sortedDice[0].value === sortedDice[1].value && // triplet (less than pair)
	     sortedDice[0].value === sortedDice[2].value &&
	     
	     sortedDice[3].value === sortedDice[4].value && // pair
	     
	     sortedDice[0].value !== sortedDice[3].value); // pair is not the same as triplet
}

function isYahtzee(dice) {
    return dice.every(die => die.value === dice[0].value);
}    

function upperScore(dice, val) {
    return sumDice(dice.filter(die => die.value === val));
}

function lowerScore(dice, category, joker) {
    let score = 0;
    switch (category) {
    case lowerSectionCategory.THREE :
	if (isNKind(dice, 3) || joker ) {
	    score = sumDice(dice);
	} 
	break;
    case lowerSectionCategory.FOUR :
	if (isNKind(dice, 4) || joker) {
	    score = sumDice(dice);
	}
	break;
    case lowerSectionCategory.FULLHOUSE :
	if (isFullHouse(dice) || joker) {
	    score = fullHouse;
	}
	break;
    case lowerSectionCategory.SMSTRAIGHT :
	if (isStraight(dice, 4) || joker) {
	    score = smallStraight;
	}
	break;
    case lowerSectionCategory.LGSTRAIGHT :
	if (isStraight(dice, 5) || joker) {
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
    this.scored = 0;
}

UpperSection.prototype.score = function(dice, val) {
    let score = sumDice(dice.filter(die => die.value === val));
    switch (val) {
    case 1:
	this.aces = score;
	break;
    case 2:
	this.twos = score;
	break;
    case 3:
	this.threes = score;
	break;
    case 4:
	this.fours = score;
	break;
    case 5:
	this.fives = score;
	break;
    case 6:
	this.sixes = score;
	break;
    }

    this.scored += 1;
    if (this.scored > 5) {
	this.calcTotalScore();
	this.calcBonus();
    }
    return score;
};

UpperSection.prototype.calcTotalScore = function() {
    this.totalScore = this.aces + this.twos + this.threes + this.fives + this.sixes;
};

UpperSection.prototype.calcBonus = function() {
    if (this.totalScore >= 63) {
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
    this.yahtzeeBonusCount = null;
    this.yahtzeeBonusScore = null;
    this.total = null;
}

LowerSection.prototype.score = function(dice, category) {
    let score = 0;
    switch (category) {
    case lowerSectionCategory.THREE :
	if (isNKind(dice, 3)) {
	    score = sumDice(dice);
	    this.threeKind = score;
	} 
	break;
    case lowerSectionCategory.FOUR :
	if (isNKind(dice, 4)) {
	    score = sumDice(dice);
	    this.fourKind = score;
	}
	break;
    case lowerSectionCategory.FULLHOUSE :
	if (isFullHouse(dice)) {
	    score = FULLHOUSE;
	    this.fullHouse = score;
	}
	break;
    case lowerSectionCategory.SMSTRAIGHT :
	if (isStraight(dice, 4)) {
	    score = SMALLSTRAIGHT;
	    this.smStraight = score;
	}
	break;
    case lowerSectionCategory.LGSTRAIGHT :
	if (isStraight(dice, 5)) {
	    score = LARGESTRAIGHT;
	    this.lgStaight = score;
	}
	break;
    case lowerSectionCategory.YAHTZEE :
	if (isYahtzee(dice)) {
	    score = YAHTZEE;
	    this.yahtzee = score;
	}
	break;
    default:
	score = sumDice(dice); // chance
	this.chance = score;
    }

    return score;
};

LowerSection.prototype.calcYahtzeeBonus = function() {
    this.yahtzeeBonusScore = this.yahtzeeBonusCount * YAHTZEEBONUS;
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

Scorecard.prototype.score = function(dice, category_name) {
    let val = categorize(category_name);
    if (typeof val === 'number') {
	return this.upperSection.score(dice, val);
    } else {
	return this.lowerSection.score(dice, category_name);
    }
};

Scorecard.prototype.grandTotal = function() {
    this.grandTotal = this.upperSection.total + this.lowerSection.total;
};
