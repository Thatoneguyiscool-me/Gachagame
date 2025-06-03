document.addEventListener("DOMContentLoaded", function() {

  const rollBtn = document.getElementById("rollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");

  const historyList = document.getElementById("history-list");
  const rollHistory = [];

  let balance = 1000;

  function updateBalance() {
    balanceDisplay.textContent = balance;
  }

  updateBalance();

  const rewards = [
    { amount: 0, color: "#666", label: "No Prize 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
    { amount: 1000, color: "#f44336", label: "SSR God Pull 🌈" }
  ];

  const chances = [30, 25, 20, 15, 10];

  rollBtn.addEventListener("click", function() {
    rollBtn.disabled = true;
    resultDisplay.textContent = "";
    capsule.textContent = "?";
    capsule.style.backgroundColor = "#ff00ff";
    capsule.classList.add("spin");

    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins to roll! You need 100 coins.";
      rollBtn.disabled = false;
      capsule.classList.remove("spin");
      return;
    }

    balance -= 100;
    updateBalance();

    setTimeout(function() {
      capsule.classList.remove("spin");

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
      } else {
        resultDisplay.textContent = `No luck this time! (${reward.label}) 😢`;
      }

      // Update roll history
      rollHistory.unshift(`${reward.label} (+${reward.amount} coins)`);
      if (rollHistory.length > 10) rollHistory.pop();

      historyList.innerHTML = "";
      rollHistory.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = entry;
        historyList.appendChild(li);
      });

      rollBtn.disabled = false;
    }, 1200);
  });

});




