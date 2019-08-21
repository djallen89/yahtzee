/* Javascript implementation of Yahtzee */

const NUMROUNDS = 13;
const ROLLSPERROUND = 3;
const check = "&#x2714";

/* Buttons, checklist items and radio buttons */
const SELECTORS = [1, 2, 3, 4, 5].map(n => document.querySelector(`input[name=die${n}]`));
const IMAGES = [1, 2, 3, 4, 5].map(n => document.getElementById(`img${n}`));
const ROLL = document.querySelector('.roll');
const SCORESELECT = document.getElementsByName('pointSelector');
const SCOREBTN = document.querySelector('.score');

let dice = createDice(diceQuantity);
let scorecard = new Scorecard;
let round = 0;
let rollsLeft = ROLLSPERROUND;

function updateImages(dice, images) {
    for (let i = 0; i < diceQuantity; i++) {
	let val = dice[i].value;
	let filename = `./images/die_small_${val}.png`;
	IMAGES[i].src=filename;
    }
}

function printInfo() {
    document.getElementById('game-info').innerHTML = `Round: ${round}, Remaining rolls: ${rollsLeft}`;
}

function initializeRound() {
    dice.map(die => {
	die.value = null;
	die.rollable = true;
    });
    round += 1;
    ROLL.disabled = false;
    rollsLeft = ROLLSPERROUND;
    IMAGES.map(img => img.src="./images/die_small_question.png");
    SELECTORS.map(selector => selector.checked = true);
    SCOREBTN.disabled = true;
    printInfo();
}

function addCheck() {
    document.getElementById("yahtzee-checks").innerHTML += check;
}

SELECTORS.map(selector => selector.addEventListener('change', function (event) {
    if (selector.checked) {
	dice[selector.value].rollable = true;
    } else {
	dice[selector.value].rollable = false;
    }
}));

ROLL.addEventListener('click', function(event) {
    rollDice(dice);
    updateImages(dice, IMAGES);
    SCOREBTN.disabled = false;
    rollsLeft -= 1;
    if (rollsLeft < 1) {
	ROLL.disabled = true;
    }
    printInfo();
});

SCOREBTN.addEventListener('click', function(event) {
    let selected = Array.from(SCORESELECT).find(x => x.checked);
    let category_name = selected.value;
    let diceAreYahtzee = isYahtzee(dice);
    let joker = false;
    if (category_name !== "yahtzee" && scorecard.lowerSection.yahtzee > 0) {
	if (scorecard.upperSection.scored < 5 && typeof categorize(category_name) !== 'number') {
	    alert("You must complete the upper section before using a joker.");
	    return null;
	} else {
	    joker = true;
	}
    }
    
    let score = scorecard.score(dice, category_name, joker);
    document.getElementById(category_name).innerHTML = score;
    if (scorecard.upperSection.scored > 5) {
	document.getElementById("total-score-upper").innerHTML = scorecard.upperSection.totalScore;
	document.getElementById("bonus").innerHTML = scorecard.upperSection.bonus;
	document.getElementById("total-upper").innerHTML = scorecard.upperSection.total;
    }
    selected.checked = false;
    selected.disabled = true;

    initializeRound();
});

/* Initialize Page */
initializeRound();

/* Debugging */
function setDiceVals(newVals) {
    for (let i = 0; i < 5; i++) {
	dice[i].value = newVals[i];
    }
    updateImages(dice, IMAGES);
}
