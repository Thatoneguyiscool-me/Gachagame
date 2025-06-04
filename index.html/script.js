// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  const rollBtn = document.getElementById("rollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");
  const historyList = document.getElementById("history-list");
  const multiRollBtn = document.getElementById("multiRollBtn");
  const levelDisplay = document.getElementById("level");
  const characterDisplay = document.getElementById("characterBoost");
  const achievementsDisplay = document.getElementById("achievements");

  let balance = 1000;
  let level = 1;
  let rollHistory = [];
  let totalRolls = 0;
  let characterBoost = 1; // Multiplies rewards
  let unlockedAchievements = [];

  const animeCharacters = [
    { name: "Naruto", boost: 1.1 },
    { name: "Goku", boost: 1.25 },
    { name: "Luffy", boost: 1.5 },
    { name: "Saitama", boost: 2.0 },
  ];

  function updateBalance() {
    balanceDisplay.textContent = balance;
  }

  function updateLevel() {
    level = Math.floor(balance / 1000) + 1;
    levelDisplay.textContent = `Level: ${level}`;
  }

  function checkAchievements() {
    if (balance >= 1000000 && !unlockedAchievements.includes("God")) {
      unlockedAchievements.push("God");
      achievementsDisplay.innerHTML += `<li>GOD Achievement Unlocked! 🎮 Minigames unlocked!</li>`;
    } else if (balance >= 100000 && !unlockedAchievements.includes("Pro")) {
      unlockedAchievements.push("Pro");
      achievementsDisplay.innerHTML += `<li>Pro Achievement Unlocked! 🔥</li>`;
    } else if (balance >= 10000 && !unlockedAchievements.includes("Basic")) {
      unlockedAchievements.push("Basic");
      achievementsDisplay.innerHTML += `<li>Basic Achievement Unlocked! 🎖️</li>`;
    } else if (balance >= 1000 && !unlockedAchievements.includes("Rookie")) {
      unlockedAchievements.push("Rookie");
      achievementsDisplay.innerHTML += `<li>Rookie Achievement Unlocked! 🥉</li>`;
    }
  }

  function assignCharacter() {
    if (balance >= 10000 && characterBoost === 1) {
      const char = animeCharacters[Math.floor(Math.random() * animeCharacters.length)];
      characterBoost = char.boost;
      characterDisplay.textContent = `Anime Boost: ${char.name} (+${(characterBoost - 1) * 100}%)`;
    }
  }

  const rewards = [
    { amount: 0, color: "#666", label: "No Prize 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
    { amount: 1000, color: "#f44336", label: "SSR God Pull 🌈" }
  ];

  const chances = [30, 25, 20, 15, 10];

  function rollOnce() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    let rewardIndex = 0;
    for (let i = 0; i < chances.length; i++) {
      cumulative += chances[i];
      if (roll < cumulative) {
        rewardIndex = i;
        break;
      }
    }
    const reward = rewards[rewardIndex];
    const boostedAmount = Math.floor(reward.amount * characterBoost);
    balance += boostedAmount;
    updateBalance();
    updateLevel();
    checkAchievements();
    assignCharacter();
    rollHistory.unshift(`${reward.label} (+${boostedAmount} coins)`);
    if (rollHistory.length > 10) rollHistory.pop();
    historyList.innerHTML = "";
    rollHistory.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      historyList.appendChild(li);
    });
    return reward;
  }

  function doRolls(count) {
    if (balance < 100 * count) {
      resultDisplay.textContent = `Not enough coins for ${count} rolls.`;
      return;
    }

    rollBtn.disabled = true;
    multiRollBtn.disabled = true;
    resultDisplay.textContent = "Rolling...";

    balance -= 100 * count;
    updateBalance();

    setTimeout(() => {
      const results = [];
      for (let i = 0; i < count; i++) {
        const reward = rollOnce();
        results.push(reward.label);
      }
      resultDisplay.textContent = `Multi-Roll Results: ${results.join(", ")}`;
      rollBtn.disabled = false;
      multiRollBtn.disabled = false;
    }, 1200);
  }

  rollBtn.addEventListener("click", () => doRolls(1));
  multiRollBtn.addEventListener("click", () => doRolls(10));

  // Initial UI update
  updateBalance();
  updateLevel();
});
