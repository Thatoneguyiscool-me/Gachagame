// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const rollBtn = document.getElementById("rollBtn");
  const multiRollBtn = document.getElementById("multiRollBtn");
  const tripleRollBtn = document.getElementById("tripleRollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");
  const historyList = document.getElementById("history-list");
  const levelDisplay = document.getElementById("level");
  const achievementsList = document.getElementById("achievements");
  const boostDisplay = document.getElementById("characterBoost");
  const shopItemsList = document.getElementById("shop-items");

  let balance = 1000;
  let level = 1;
  let totalEarnings = 0;
  let character = null;
  let boostMultiplier = 1;

  const characters = [
    { name: "Naruto", boost: 1.1 },
    { name: "Luffy", boost: 1.2 },
    { name: "Goku", boost: 1.3 },
    { name: "Saitama", boost: 1.5 },
    { name: "Gojo", boost: 2.0 }
  ];

  const rewards = [
    { amount: 0, color: "#666", label: "No Prize 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
    { amount: 1000, color: "#f44336", label: "SSR God Pull 🌈" }
  ];

  const chances = [30, 25, 20, 15, 10];

  const shopItems = [
    { name: "Coin Doubler", cost: 5000, effect: () => boostMultiplier *= 2 },
    { name: "Lucky Charm", cost: 8000, effect: () => chances[4] += 10 },
    { name: "Auto Clicker", cost: 10000, effect: () => balance += 1000 },
  ];

  function updateBalance() {
    balanceDisplay.textContent = balance;
  }

  function updateLevel() {
    levelDisplay.textContent = `Level: ${level}`;
  }

  function updateBoost() {
    if (character) {
      boostDisplay.textContent = `Character Boost: ${character.name} (${character.boost}x)`;
    } else {
      boostDisplay.textContent = "Character Boost: None";
    }
  }

  function checkAchievements() {
    achievementsList.innerHTML = "";
    if (totalEarnings >= 1000) addAchievement("🏅 Rookie Achievement");
    if (totalEarnings >= 10000) addAchievement("🎖️ Basic Achievement");
    if (totalEarnings >= 100000) addAchievement("🥇 Pro Achievement");
    if (totalEarnings >= 1000000) addAchievement("👑 God Achievement - Minigames Unlocked!");
  }

  function addAchievement(text) {
    const li = document.createElement("li");
    li.textContent = text;
    achievementsList.appendChild(li);
  }

  function updateHistory(reward) {
    const li = document.createElement("li");
    li.textContent = `You won ${reward.amount} coins (${reward.label})`;
    historyList.insertBefore(li, historyList.firstChild);
  }

  function spinGacha() {
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
    return rewards[rewardIndex];
  }

  function performRoll(times = 1) {
    let totalReward = 0;
    for (let i = 0; i < times; i++) {
      const reward = spinGacha();
      let boostedAmount = Math.floor(reward.amount * boostMultiplier);
      totalReward += boostedAmount;
      updateHistory(reward);
    }
    balance += totalReward;
    totalEarnings += totalReward;
    updateBalance();
    updateLevel();
    checkAchievements();
    resultDisplay.textContent = `You earned ${totalReward} coins from ${times} roll${times > 1 ? "s" : ""}!`;
  }

  function getNewCharacter() {
    const random = Math.floor(Math.random() * characters.length);
    character = characters[random];
    boostMultiplier = character.boost;
    updateBoost();
  }

  function populateShop() {
    shopItemsList.innerHTML = "";
    shopItems.forEach((item, index) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.textContent = `Buy ${item.name} (${item.cost} coins)`;
      btn.addEventListener("click", () => {
        if (balance >= item.cost) {
          balance -= item.cost;
          item.effect();
          updateBalance();
          resultDisplay.textContent = `You bought ${item.name}!`;
        } else {
          resultDisplay.textContent = "Not enough coins!";
        }
      });
      li.appendChild(btn);
      shopItemsList.appendChild(li);
    });
  }

  rollBtn.addEventListener("click", () => {
    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins to roll!";
      return;
    }
    balance -= 100;
    capsule.classList.add("spin");
    setTimeout(() => {
      capsule.classList.remove("spin");
      performRoll();
    }, 1200);
  });

  multiRollBtn.addEventListener("click", () => {
    if (balance < 1000) {
      resultDisplay.textContent = "Not enough coins for Multi-Roll!";
      return;
    }
    balance -= 1000;
    capsule.classList.add("spin");
    setTimeout(() => {
      capsule.classList.remove("spin");
      performRoll(10);
      if (totalEarnings >= 10000 && !character) {
        getNewCharacter();
      }
    }, 1200);
  });

  tripleRollBtn.addEventListener("click", () => {
    if (balance < 10000) {
      resultDisplay.textContent = "Not enough coins for Triple Roll!";
      return;
    }
    balance -= 10000;
    capsule.classList.add("spin");
    setTimeout(() => {
      capsule.classList.remove("spin");
      performRoll(100);
      if (totalEarnings >= 10000 && !character) {
        getNewCharacter();
      }
    }, 1200);
  });

  // Initial Setup
  updateBalance();
  updateLevel();
  updateBoost();
  checkAchievements();
  populateShop();
});

