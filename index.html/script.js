// Show selected game
function showGame(game) {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("gachaGame").classList.add("hidden");
  document.getElementById("diceGame").classList.add("hidden");

  if (game === "gacha") document.getElementById("gachaGame").classList.remove("hidden");
  else if (game === "dice") document.getElementById("diceGame").classList.remove("hidden");
}

// Return to main menu
function returnToMenu() {
  document.getElementById("mainMenu").classList.remove("hidden");
  document.getElementById("gachaGame").classList.add("hidden");
  document.getElementById("diceGame").classList.add("hidden");
}

function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  document.getElementById("diceResult").textContent = `🎲 ${result}`;
}

// Gacha Game Logic
document.addEventListener("DOMContentLoaded", () => {
  const rollBtn = document.getElementById("rollBtn");
  const multiRollBtn = document.getElementById("multiRollBtn");
  const slot1 = document.getElementById("slot1");
  const slot2 = document.getElementById("slot2");
  const slot3 = document.getElementById("slot3");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const levelDisplay = document.getElementById("levelDisplay");
  const achievementDisplay = document.getElementById("achievementDisplay");
  const characterBoostDisplay = document.getElementById("characterBoostDisplay");
  const historyPanel = document.getElementById("historyPanel");

  let balance = 1000;
  let level = 1;
  let totalEarned = 0;
  let characterUnlocked = false;

  const rewards = [0, 50, 100, 250, 500, 1000];
  const chances = [30, 25, 20, 15, 7, 3];

  function updateDisplay() {
    balanceDisplay.textContent = balance;
    levelDisplay.textContent = `Level: ${level}`;
    achievementDisplay.textContent = getAchievement();
    characterBoostDisplay.textContent = characterUnlocked ? "🎌 Anime Character Boost: +10% coins!" : "";
  }

  function getAchievement() {
    if (totalEarned >= 1_000_000) return "🏆 God Achievement Unlocked!";
    if (totalEarned >= 100_000) return "🔥 Pro Achievement Unlocked!";
    if (totalEarned >= 10_000) return "⭐ Basic Achievement Unlocked!";
    if (totalEarned >= 1000) return "🎉 Rookie Achievement Unlocked!";
    return "";
  }

  function rollOnce() {
    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins!";
      return;
    }

    balance -= 100;
    const reward = getReward();
    const boost = characterUnlocked ? Math.floor(reward * 0.1) : 0;
    const total = reward + boost;

    totalEarned += total;
    balance += total;

    // Randomize slot numbers
    slot1.textContent = Math.floor(Math.random() * 9) + 1;
    slot2.textContent = Math.floor(Math.random() * 9) + 1;
    slot3.textContent = Math.floor(Math.random() * 9) + 1;

    resultDisplay.textContent = reward > 0 ? `You won ${total} coins!` : "No luck this time!";
    historyPanel.innerHTML += `<p>Rolled: Won ${total} coins</p>`;

    // Level up logic
    if (totalEarned > level * 5000) level++;

    // Unlock anime character
    if (totalEarned >= 10_000) characterUnlocked = true;

    updateDisplay();
  }

  function multiRoll() {
    if (balance < 1000) {
      resultDisplay.textContent = "Not enough coins for multi-roll!";
      return;
    }
    for (let i = 0; i < 10; i++) rollOnce();
  }

  function getReward() {
    let roll = Math.random() * 100;
    let sum = 0;
    for (let i = 0; i < chances.length; i++) {
      sum += chances[i];
      if (roll < sum) return rewards[i];
    }
    return 0;
  }

  rollBtn.addEventListener("click", rollOnce);
  multiRollBtn.addEventListener("click", multiRoll);

  updateDisplay();
});
