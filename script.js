// script.js

let infectedCrew = 5;
let innocentsPlanked = 0;
let score = 0;

// Pirate traits with hints and optional special properties
const pirateTraits = [
    { description: "muttering about 'the plague' under their breath", isInfected: true },
    { description: "with a nasty cough and pale complexion", isInfected: true },
    { description: "always scratching at their arms", isInfected: true },
    { description: "singing shanties and sharing grog", isInfected: false },
    { description: "known for their loyalty to the captain", isInfected: false },
    { description: "carrying the captain's orders in their pocket", isInfected: false },
    // Special traits
    { description: "a mysterious figure cloaked in shadows", isInfected: true, special: "doublePlank" },
    { description: "a hearty sailor with a booming laugh", isInfected: false, special: "extraLife" }
];

const achievements = [
    { score: 20, message: "First Blood! You planked your first infected crew member." },
    { score: 50, message: "Sharp Shooter! You've planked 5 infected crew members." },
    { score: 100, message: "Master of the Seas! You've achieved a high score!" }
];

let achieved = [];
let currentTrait = null;

// Function to get a random trait
function getRandomTrait() {
    return pirateTraits[Math.floor(Math.random() * pirateTraits.length)];
}

// Function to update the game state display
function updateGameState() {
    document.getElementById("infected-remaining").innerText = infectedCrew;
    document.getElementById("innocents-planked").innerText = innocentsPlanked;
    document.getElementById("score").innerText = score;
    checkAchievements();
}

// Function to display messages to the player
function showDialog(message) {
    const dialog = document.getElementById("crew-dialog");
    dialog.innerText = message;
    dialog.classList.add("fade-in");
    setTimeout(() => dialog.classList.remove("fade-in"), 1000);
}

// Function to handle the next crew member
function nextCrewMember() {
    currentTrait = getRandomTrait();
    setTimeout(() => {
        showDialog(`This crew member is ${currentTrait.description}. What do ye do?`);
    }, 500);
}

// Function to check if the game is over
function checkGameOver() {
    if (infectedCrew === 0) {
        showDialog("Victory! Ye rid the ship of all infected scallywags!");
        endGame();
    } else if (innocentsPlanked >= 3) {
        showDialog("Defeat! Too many innocents be lost to the deep.");
        endGame();
    }
}

// Function to end the game
function endGame() {
    document.getElementById("choices").style.display = "none";
    setTimeout(() => {
        alert(`Game Over! Your score: ${score}. Reload the page to try again.`);
    }, 2000);
}

// Function to handle the "Plank" action
function plank() {
    const trait = currentTrait;
    if (trait.isInfected) {
        infectedCrew--;
        score += 10;
        showDialog(`Ye planked 'em! They were ${trait.description} and a danger to us all.`);
        if (trait.special === "doublePlank") {
            infectedCrew--;
            score += 10;
            showDialog(`Special Trait Activated! Ye planked 'em again due to their mysterious nature.`);
        }
    } else {
        innocentsPlanked++;
        score -= 5;
        showDialog(`Ye planked 'em, but they were innocent! They were ${trait.description}.`);
    }
    updateGameState();
    checkGameOver();
    nextCrewMember();
}

// Function to handle the "Spare" action
function spare() {
    const trait = currentTrait;
    if (trait.isInfected) {
        showDialog(`Ye spared 'em, but they were ${trait.description} and likely infected!`);
        score -= 10;
    } else {
        showDialog(`Ye spared 'em, and they were ${trait.description}. A good choice!`);
        score += 5;
        if (trait.special === "extraLife") {
            innocentsPlanked = Math.max(0, innocentsPlanked - 1);
            showDialog(`Special Trait Activated! Ye saved an extra innocent crew member.`);
        }
    }
    updateGameState();
    checkGameOver();
    nextCrewMember();
}

// Function to handle the "Investigate" action
function investigate() {
    const trait = currentTrait;
    if (trait.isInfected) {
        showDialog(`Ye investigated and discovered they are infected!`);
        score += 5;
    } else {
        showDialog(`Ye investigated and found them innocent.`);
        score += 2;
    }
    updateGameState();
}

// Function to check and unlock achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (score >= achievement.score && !achieved.includes(achievement.score)) {
            alert(`Achievement Unlocked: ${achievement.message}`);
            achieved.push(achievement.score);
        }
    });
}

// Function to start the game
function startGame() {
    updateGameState();
    nextCrewMember();
}

// Start the game when the page loads
window.onload = startGame;