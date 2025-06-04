document.addEventListener("DOMContentLoaded", () => {
  const balanceDisplay = document.getElementById("balance");
  const capsule = document.getElementById("capsule");
  const rollBtn = document.getElementById("rollBtn");
  const multiRollBtn = document.getElementById("multiRollBtn");
  const resultDisplay = document.getElementById("result");
  const levelDisplay = document.getElementById("level");
  const historyPanel = document.getElementById("history");
  const audio = document.getElementById("bg-music");
  const diceGameBtn = document.getElementById("diceGameBtn");

  let balance = 1000;
  let level = 1;
  let totalEarned = 0;

  const rewards = [
    { amount: 0, color: "#666", label: "Nothing 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
    { amount: 1000, color: "#f44336", label: "SSR 🌈" },
  ];

  const chances = [30, 25, 20, 15, 10];

  function updateBalance() {
    balanceDisplay.textContent = balance;
  }

  function updateLevel() {
    let newLevel = 1;
    if (totalEarned >= 1000000) {
      newLevel = 5;
    } else if (totalEarned >= 100000) {
      newLevel = 4;
    } else if (totalEarned >= 10000) {
      newLevel = 3;
    } else if (totalEarned >= 1000) {
      newLevel = 2;
    }
    level = newLevel;

    const levelNames = ["Beginner", "Rookie", "Basic", "Pro", "God"];
    levelDisplay.textContent = `Level: ${level} - ${levelNames[level - 1]}`;

    if (level === 5) {
      alert("🎉 You've unlocked Minigames!");
    }
  }

  function getReward() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < chances.length; i++) {
      cumulative += chances[i];
      if (roll < cumulative) return rewards[i];
    }
    return rewards[0];
  }

  function showCapsuleReward(reward) {
    capsule.textContent = reward.amount > 0 ? reward.amount : "💨";
    capsule.style.backgroundColor = reward.color;
    resultDisplay.textContent =
      reward.amount > 0
        ? `You won ${reward.amount} coins! (${reward.label})`
        : `No luck! (${reward.label})`;

    const log = document.createElement("li");
    log.textContent = `${new Date().toLocaleTimeString()}: ${reward.label} - ${reward.amount} coins`;
    historyPanel.prepend(log);
  }

  function rollOnce() {
    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins!";
      return;
    }
    balance -= 100;
    const reward = getReward();
    balance += reward.amount;
    totalEarned += reward.amount;
    updateBalance();
    updateLevel();
    showCapsuleReward(reward);
  }

  rollBtn.addEventListener("click", () => {
    capsule.classList.add("spin");
    setTimeout(() => {
      capsule.classList.remove("spin");
      rollOnce();
    }, 1000);
  });

  multiRollBtn.addEventListener("click", () => {
    if (balance < 1000) {
      resultDisplay.textContent = "You need at least 1000 coins for a multi-roll!";
      return;
    }

    capsule.textContent = "🎲";
    capsule.classList.add("spin");
    setTimeout(() => {
      capsule.classList.remove("spin");

      for (let i = 0; i < 10; i++) {
        rollOnce();
      }
    }, 1000);
  });

  diceGameBtn.addEventListener("click", () => {
    alert("🎲 Dice game coming soon!");
  });

  // Start music
  if (audio) {
    audio.volume = 0.5;
    audio.play().catch(() => {
      console.log("User must interact before music can autoplay");
    });
  }

  updateBalance();
  updateLevel();
});
