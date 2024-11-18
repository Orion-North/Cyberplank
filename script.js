let infectedCrew = 5;
let innocentsPlanked = 0;
let score = 0;
let investigated = false;
let achieved = [];
let currentTrait = null;
let messageQueue = [];
let isDisplayingMessage = false;

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

// Function to get a random trait
function getRandomTrait() {
    return pirateTraits[Math.floor(Math.random() * pirateTraits.length)];
}

// Function to update the game state display
function updateGameState() {
    document.getElementById("infected-remaining").innerText = infectedCrew;
    document.getElementById("innocents-planked").innerText = innocentsPlanked;
    document.getElementById("score").innerText = score;
    updateProgressBars();
    checkAchievements();
}

// Function to update progress bars
function updateProgressBars() {
    const infectedProgress = document.getElementById("infected-progress");
    infectedProgress.style.width = `${(infectedCrew / 5) * 100}%`;
    
    const innocentsProgress = document.getElementById("innocents-progress");
    innocentsProgress.style.width = `${(innocentsPlanked / 3) * 100}%`;
}

// Function to display messages to the player
function showDialog(message) {
    messageQueue.push(message);
    if (!isDisplayingMessage) {
        displayNextMessage();
    }
}

function displayNextMessage() {
    if (messageQueue.length === 0) {
        isDisplayingMessage = false;
        return;
    }
    isDisplayingMessage = true;
    const message = messageQueue.shift();
    const dialog = document.getElementById("crew-dialog");
    dialog.innerText = message;
    dialog.classList.remove("fade-in");
    void dialog.offsetWidth; // Trigger reflow to restart the animation
    dialog.classList.add("fade-in");

    // Display each message for 4 seconds (adjust as needed)
    setTimeout(() => {
        isDisplayingMessage = false;
        displayNextMessage();
    }, 4000);
}

// Function to handle the next crew member
function nextCrewMember() {
    investigated = false; // Reset for the next crew member
    currentTrait = getRandomTrait();
    showDialog(`This crew member is ${currentTrait.description}. What do ye do?`);
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
    showDialog(`Game Over! Your score: ${score}. Reload the page to try again.`);
}

// Function to handle the "Plank" action
function plank() {
    const trait = currentTrait;
    if (trait.isInfected) {
        infectedCrew = Math.max(0, infectedCrew - 1);
        score += 10;
        showDialog(`Ye planked 'em! They were ${trait.description} and a danger to us all.`);
        if (trait.special === "doublePlank") {
            infectedCrew = Math.max(0, infectedCrew - 1);
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
        score += 5;
        showDialog(`Ye spared 'em, and they were ${trait.description}. A good choice!`);
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
    if (investigated) {
        showDialog("Ye have already investigated this crew member.");
        return;
    }
    investigated = true;
    if (currentTrait.isInfected) {
        showDialog(`Ye investigated and discovered they are infected!`);
    } else {
        showDialog(`Ye investigated and found them innocent.`);
    }
}

// Function to check and unlock achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (score >= achievement.score && !achieved.includes(achievement.score)) {
            // Display achievement in the achievements list
            const achievementsList = document.getElementById("achievements-list");
            const achievementItem = document.createElement("li");
            achievementItem.innerText = `🏆 ${achievement.message}`;
            achievementsList.appendChild(achievementItem);
            achieved.push(achievement.score);
            // Show achievement message
            showDialog(`🏆 Achievement Unlocked: ${achievement.message}`);
        }
    });
}

// Make functions globally accessible
window.plank = plank;
window.spare = spare;
window.investigate = investigate;

// Function to start the game
function startGame() {
    updateGameState();
    nextCrewMember();
}

// Start the game when the page loads
window.onload = startGame;
