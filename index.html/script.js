// Wait until DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  // ======== Elements ========
  const menu = document.getElementById("menu");
  const gachaGame = document.getElementById("gachaGame");
  const diceGame = document.getElementById("diceGame");

  // Gacha elements
  const balanceDisplay = document.getElementById("balance");
  const rollBtn = document.getElementById("rollBtn");
  const multiRollBtn = document.getElementById("multiRollBtn");
  const resultDisplay = document.getElementById("result");
  const levelDisplay = document.getElementById("levelDisplay");
  const achievementDisplay = document.getElementById("achievementDisplay");
  const characterBoostDisplay = document.getElementById("characterBoostDisplay");
  const historyPanel = document.getElementById("historyPanel");
  const slots = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3")
  ];
  const gachaFullscreenBtn = document.getElementById("gachaFullscreenBtn");

  // Dice elements
  const diceRollBtn = document.getElementById("diceRollBtn");
  const diceResult = document.getElementById("diceResult");
  const diceFullscreenBtn = document.getElementById("diceFullscreenBtn");

  // Game state variables
  let balance = 1000;
  let level = 1;
  let experience = 0;
  let achievements = new Set();
  let characterBoost = 1; // multiplier for coin gains
  let rollHistory = [];

  // Character list for boosts
  const characters = [
    { name: "Hikaru", boost: 1.05 },
    { name: "Miyu", boost: 1.10 },
    { name: "Takashi", boost: 1.15 },
    { name: "Yuki", boost: 1.20 },
    { name: "Sora", boost: 1.30 }
  ];

  // Rewards with emoji for slots
  const rewards = [
    { amount: 0, label: "No Prize 💨", emoji: "💨" },
    { amount: 50, label: "Common 💎", emoji: "💎" },
    { amount: 100, label: "Rare 🧿", emoji: "🧿" },
    { amount: 250, label: "Legendary 🟡", emoji: "🟡" },
    { amount: 1000, label: "SSR God Pull 🌈", emoji: "🌈" }
  ];

  // Slots emojis for display (randomly chosen from rewards emojis)
  function getRandomReward() {
    let totalChance = 100;
    const chances = [30, 25, 20, 15, 10]; // sum to 100

    const roll = Math.random() * totalChance;
    let cumulative = 0;
    for (let i = 0; i < chances.length; i++) {
      cumulative += chances[i];
      if (roll < cumulative) return rewards[i];
    }
    return rewards[0]; // fallback
  }

  // Update UI balance
  function updateBalance() {
    balanceDisplay.textContent = Math.floor(balance);
  }

  // Update level display
  function updateLevel() {
    levelDisplay.textContent = `Level: ${level} (EXP: ${experience})`;
  }

  // Update achievement display
  function updateAchievements() {
    if (achievements.size === 0) {
      achievementDisplay.textContent = "Achievements: None yet";
    } else {
      achievementDisplay.textContent = `Achievements: ${[...achievements].join(", ")}`;
    }
  }

  // Update character boost display
  function updateCharacterBoost() {
    characterBoostDisplay.textContent = `Current Character Boost: x${characterBoost.toFixed(2)}`;
  }

  // Add roll to history panel (max 10 entries)
  function addToHistory(text) {
    rollHistory.unshift(text);
    if (rollHistory.length > 10) rollHistory.pop();
    historyPanel.innerHTML = rollHistory.map(entry => `<div>${entry}</div>`).join("");
  }

  // Check and grant achievements based on balance
  function checkAchievements() {
    if (balance >= 1_000_000 && !achievements.has("God Achievement")) {
      achievements.add("God Achievement");
      addToHistory("🔥 Achievement unlocked: God Achievement! Minigames unlocked!");
      alert("🔥 God Achievement unlocked! You now unlocked Minigames!");
    } else if (balance >= 100_000 && !achievements.has("Pro Achievement")) {
      achievements.add("Pro Achievement");
      addToHistory("⭐ Achievement unlocked: Pro Achievement!");
    } else if (balance >= 10_000 && !achievements.has("Basic Achievement")) {
      achievements.add("Basic Achievement");
      addToHistory("✨ Achievement unlocked: Basic Achievement!");
    } else if (balance >= 1_000 && !achievements.has("Rookie Achievement")) {
      achievements.add("Rookie Achievement");
      addToHistory("🎉 Achievement unlocked: Rookie Achievement!");
    }
  }

  // Gain EXP and level up if needed
  function gainExp(amount) {
    experience += amount;
    const expToLevelUp = level * 1000;
    if (experience >= expToLevelUp) {
      level++;
      experience -= expToLevelUp;
      addToHistory(`⬆️ You leveled up! Now level ${level}.`);
      // Every 5 levels, give a random character boost
      if (level % 5 === 0) {
        let char = characters[Math.floor(Math.random() * characters.length)];
        characterBoost *= char.boost;
        addToHistory(`🌟 You got character ${char.name} boosting rewards x${char.boost.toFixed(2)}!`);
      }
    }
  }

  // Animate slots spinning, then show rewards
  function animateSlots(rewardsResult, callback) {
    const spinDuration = 1500;
    const intervalTime = 100;

    let elapsed = 0;
    let intervalId = setInterval(() => {
      slots.forEach(slot => {
        let randomEmoji = rewards[Math.floor(Math.random() * rewards.length)].emoji;
        slot.textContent = randomEmoji;
      });
      elapsed += intervalTime;
      if (elapsed >= spinDuration) {
        clearInterval(intervalId);
        // Show actual results
        for (let i = 0; i < 3; i++) {
          slots[i].textContent = rewardsResult[i].emoji;
        }
        if (callback) callback();
      }
    }, intervalTime);
  }

  // Single roll function
  function singleRoll() {
    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins to roll (need 100).";
      return;
    }
    balance -= 100;

    // Roll three times and pick best reward as main
    const rollResults = [getRandomReward(), getRandomReward(), getRandomReward()];

    animateSlots(rollResults, () => {
      // Calculate total reward with boost
      let bestReward = rollResults.reduce((max, r) => (r.amount > max.amount ? r : max), rollResults[0]);
      let rewardAmount = bestReward.amount * characterBoost;
      balance += rewardAmount;

      updateBalance();

      // Gain EXP by reward amount / 10 (rounded)
      gainExp(Math.floor(rewardAmount / 10));

      // Show results
      if (rewardAmount > 0) {
        resultDisplay.textContent = `You won ${Math.floor(rewardAmount)} coins! (${bestReward.label}) 🎉`;
        addToHistory(`Single Roll: Won ${Math.floor(rewardAmount)} coins (${bestReward.label})`);
      } else {
        resultDisplay.textContent = `No luck this time! (${bestReward.label}) 😢`;
        addToHistory(`Single Roll: No prize`);
      }

      checkAchievements();
      updateLevel();
      updateAchievements();
      updateCharacterBoost();

      rollBtn.disabled = false;
      multiRollBtn.disabled = false;
    });

    rollBtn.disabled = true;
    multiRollBtn.disabled = true;
  }

  // Multi-roll function (10 rolls at once, costs 1000)
  function multiRoll() {
    if (balance < 1000) {
      resultDisplay.textContent = "Not enough coins for multi-roll (need 1000).";
      return;
    }
    balance -= 1000;

    // Roll 10 times
    const allResults = [];
    for (let i = 0; i < 10; i++) {
      allResults.push(getRandomReward());
    }

    // Show the last 3 roll emojis as slots for fun
    const lastThree = allResults.slice(-3);

    animateSlots(lastThree, () => {
      // Sum rewards with boosts
      let totalReward = allResults.reduce((sum, r) => sum + r.amount, 0);
      totalReward *= characterBoost;
      balance += totalReward;

      updateBalance();

      gainExp(Math.floor(totalReward / 10));

      if (totalReward > 0) {
        resultDisplay.textContent = `Multi-Roll won ${Math.floor(totalReward)} coins! 🎉`;
        addToHistory(`Multi Roll: Won ${Math.floor(totalReward)} coins`);
      } else {
        resultDisplay.textContent = "Multi-Roll no luck 😢";
        addToHistory("Multi Roll: No prize");
      }

      checkAchievements();
      updateLevel();
      updateAchievements();
      updateCharacterBoost();

      rollBtn.disabled = false;
      multiRollBtn.disabled = false;
    });

    rollBtn.disabled = true;
    multiRollBtn.disabled = true;
  }

  // Dice game roll function
  function rollDice() {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `🎲 ${diceRoll}`;
  }

  // Show game based on menu choice
  window.startGame = function(game) {
    menu.classList.add("hidden");
    if (game === "gacha") {
      gachaGame.classList.remove("hidden");
      updateBalance();
      updateLevel();
      updateAchievements();
      updateCharacterBoost();
    } else if (game === "dice") {
      diceGame.classList.remove("hidden");
      diceResult.textContent = "🎲";
    }
  };

  // Return to menu function
  window.returnToMenu = function() {
    gachaGame.classList.add("hidden");
    diceGame.classList.add("hidden");
    menu.classList.remove("hidden");
    resultDisplay.textContent = "";
    diceResult.textContent = "🎲";
  };

  // Fullscreen toggle helpers
  function toggleFullscreen(elem) {
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  gachaFullscreenBtn.addEventListener("click", () => toggleFullscreen(gachaGame));
  diceFullscreenBtn.addEventListener("click", () => toggleFullscreen(diceGame));

  // Event listeners
  rollBtn.addEventListener("click", singleRoll);
  multiRollBtn.addEventListener("click", multiRoll);
  diceRollBtn.addEventListener("click", rollDice);
});
