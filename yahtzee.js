/* Javascript implementation of Yahtzee */

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

let dice = createDice(diceQuantity);
