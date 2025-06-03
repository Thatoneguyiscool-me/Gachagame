document.addEventListener("DOMContentLoaded", () => {
  const rollBtn = document.getElementById("rollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");
  const dailyBonusBtn = document.getElementById("dailyBonusBtn");
  const dailyBonusMsg = document.getElementById("dailyBonusMsg");
  const rollHistoryList = document.getElementById("rollHistory");
  const bonusHistoryList = document.getElementById("bonusHistory");

  // Audio (replace with your actual audio files or comment out)
  const rollSound = new Audio("roll.mp3");
  const winSound = new Audio("win.mp3");
  const bonusSound = new Audio("bonus.mp3");

  // Initialize or load balance
  let balance = parseInt(localStorage.getItem("gachaBalance")) || 1000;

  function updateBalance() {
    balanceDisplay.textContent = balance;
    localStorage.setItem("gachaBalance", balance);
  }

  // Inventory and collectibles (not displayed here but stored)
  const collectibles = [
    { name: "Slime", rarity: "Common", color: "#4caf50" },
    { name: "Fire Spirit", rarity: "Rare", color: "#2196f3" },
    { name: "Golden Dragon", rarity: "Legendary", color: "#ffc107" },
    { name: "Celestial Phoenix", rarity: "SSR God Pull", color: "#f44336" },
  ];

  let inventory = JSON.parse(localStorage.getItem("gachaInventory")) || [];
  function saveInventory() {
    localStorage.setItem("gachaInventory", JSON.stringify(inventory));
  }

  // Rewards & chances
  const rewards = [
    { amount: 0, color: "#666", label: "No Prize 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
    { amount: 1000, color: "#f44336", label: "SSR God Pull 🌈" },
  ];
  const chances = [30, 25, 20, 15, 10]; // must sum 100

  // Roll history (max 10)
  let rollHistory = JSON.parse(localStorage.getItem("rollHistory")) || [];
  function saveRollHistory() {
    localStorage.setItem("rollHistory", JSON.stringify(rollHistory));
  }
  function renderRollHistory() {
    if (!rollHistoryList) return;
    rollHistoryList.innerHTML = rollHistory
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  function addToRollHistory(text) {
    rollHistory.unshift(text);
    if (rollHistory.length > 10) rollHistory.pop();
    saveRollHistory();
    renderRollHistory();
  }

  // Daily bonus history (max 5)
  let bonusHistory = JSON.parse(localStorage.getItem("bonusHistory")) || [];
  function saveBonusHistory() {
    localStorage.setItem("bonusHistory", JSON.stringify(bonusHistory));
  }
  function renderBonusHistory() {
    if (!bonusHistoryList) return;
    bonusHistoryList.innerHTML = bonusHistory
      .map((entry) => `<li>${entry}</li>`)
      .join("");
  }
  function addToBonusHistory(text) {
    bonusHistory.unshift(text);
    if (bonusHistory.length > 5) bonusHistory.pop();
    saveBonusHistory();
    renderBonusHistory();
  }

  // Daily bonus cooldown check
  function canClaimDailyBonus() {
    const lastClaim = localStorage.getItem("lastDailyBonus");
    if (!lastClaim) return true;
    const now = Date.now();
    return now - lastClaim > 24 * 60 * 60 * 1000; // 24h
  }

  // Claim daily bonus handler
  function claimDailyBonus() {
    if (!dailyBonusBtn) return;

    if (canClaimDailyBonus()) {
      const bonusAmount = 500;
      balance += bonusAmount;
      updateBalance();
      dailyBonusMsg.textContent = `You claimed ${bonusAmount} coins daily bonus! 🎉`;
      localStorage.setItem("lastDailyBonus", Date.now());
      dailyBonusBtn.disabled = true;

      addToBonusHistory(
        `${new Date().toLocaleDateString()} - Claimed ${bonusAmount} coins`
      );

      // Play bonus sound if available
      if (bonusSound) bonusSound.play();

      // Flash animation for daily bonus message
      dailyBonusMsg.classList.add("flash");
      setTimeout(() => dailyBonusMsg.classList.remove("flash"), 2000);
    } else {
      dailyBonusMsg.textContent =
        "Daily bonus already claimed. Come back tomorrow!";
      dailyBonusBtn.disabled = true;
    }
  }

  if (dailyBonusBtn) {
    dailyBonusBtn.addEventListener("click", claimDailyBonus);
    if (!canClaimDailyBonus()) {
      dailyBonusBtn.disabled = true;
      dailyBonusMsg.textContent =
        "Daily bonus already claimed. Come back tomorrow!";
    }
  }

  // Initial updates
  updateBalance();
  renderRollHistory();
  renderBonusHistory();

  rollBtn.addEventListener("click", () => {
    if (balance < 100) {
      resultDisplay.textContent =
        "Not enough coins to roll! You need 100 coins.";
      return;
    }

    // Play roll sound
    if (rollSound) rollSound.play();

    rollBtn.disabled = true;
    rollBtn.classList.add("shake");
    resultDisplay.textContent = "";
    capsule.textContent = "?";
    capsule.style.backgroundColor = "#ff00ff";
    capsule.classList.add("spin");

    balance -= 100;
    updateBalance();

    setTimeout(() => {
      capsule.classList.remove("spin");
      rollBtn.classList.remove("shake");

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

      balance += reward.amount;
      updateBalance();

      capsule.style.backgroundColor = reward.color;
      capsule.textContent = reward.amount > 0 ? reward.amount : "💨";

      if (reward.amount > 0) {
        resultDisplay.textContent = `You won ${reward.amount} coins! (${reward.label}) 🎉`;

        if (winSound) winSound.play();

        capsule.classList.add("flash");
        setTimeout(() => capsule.classList.remove("flash"), 3000);

        // Add collectible for rewards > 0
        if (rewardIndex > 0) {
          let collectible = collectibles[rewardIndex - 1];
          inventory.push(collectible);
          saveInventory();
          resultDisplay.textContent += ` You got a ${collectible.rarity} collectible: ${collectible.name}!`;
        }
      } else {
        resultDisplay.textContent = `No luck this time! (${reward.label}) 😢`;
      }

      addToRollHistory(
        reward.amount > 0
          ? `Won ${reward.amount} coins (${reward.label})`
          : `No prize (${reward.label})`
      );

      rollBtn.disabled = false;
    }, 1200);
  });
});
