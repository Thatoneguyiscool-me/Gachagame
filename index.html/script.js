document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const gachaBtn = document.getElementById("playGachaBtn");
  const diceBtn = document.getElementById("playDiceBtn");

  // Gacha Game HTML
  const gachaHTML = `
    <h2>🎰 Gacha Machine</h2>
    <p>Your Balance: <span id="balance">1000</span> coins</p>
    <div class="gacha-machine">
      <div class="capsule" id="capsule">?</div>
    </div>
    <button id="rollBtn">Roll (100 coins)</button>
    <p id="result"></p>
  `;

  // Dice Game HTML
  const diceHTML = `
    <h2>🎲 Roll Dice</h2>
    <p>Your Dice Roll: <span id="diceResult">-</span></p>
    <button id="rollDiceBtn">Roll Dice</button>
  `;

  gachaBtn.addEventListener("click", () => {
    gameArea.innerHTML = gachaHTML;
    setupGacha();
  });

  diceBtn.addEventListener("click", () => {
    gameArea.innerHTML = diceHTML;
    setupDice();
  });

  function setupGacha() {
    let balance = 1000;
    const balanceDisplay = document.getElementById("balance");
    const capsule = document.getElementById("capsule");
    const rollBtn = document.getElementById("rollBtn");
    const resultDisplay = document.getElementById("result");

    const rewards = [
      { amount: 0, color: "#666", label: "No Prize 💨" },
      { amount: 50, color: "#4caf50", label: "Common 💎" },
      { amount: 100, color: "#2196f3", label: "Rare 🔵" },
      { amount: 250, color: "#ffc107", label: "Legendary 🟡" },
      { amount: 1000, color: "#f44336", label: "SSR God Pull 🌈" }
    ];

    const chances = [30, 25, 20, 15, 10]; // decreasing odds

    function updateBalance() {
      balanceDisplay.textContent = balance;
    }

    rollBtn.addEventListener("click", () => {
      if (balance < 100) {
        resultDisplay.textContent = "Not enough coins to roll!";
        return;
      }

      rollBtn.disabled = true;
      resultDisplay.textContent = "";
      capsule.textContent = "?";
      capsule.classList.add("spin");
      balance -= 100;
      updateBalance();

      setTimeout(() => {
        capsule.classList.remove("spin");

        let roll = Math.random() * 100;
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
        resultDisplay.textContent = reward.amount > 0
          ? `You won ${reward.amount} coins! (${reward.label})`
          : `No luck this time! (${reward.label})`;

        rollBtn.disabled = false;
      }, 1200);
    });
  }

  function setupDice() {
    const resultSpan = document.getElementById("diceResult");
    const rollBtn = document.getElementById("rollDiceBtn");

    rollBtn.addEventListener("click", () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      resultSpan.textContent = roll;
    });
  }
});
