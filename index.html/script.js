document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const gachaBtn = document.getElementById("gachaBtn");
  const diceBtn = document.getElementById("diceBtn");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");

  // Music toggle
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = "Pause Music";
    } else {
      bgMusic.pause();
      musicToggle.textContent = "Play Music";
    }
  });

  // Gacha Machine Game HTML
  const gachaHTML = `
    <p>Your Balance: <span id="balance">1000</span> coins</p>
    <div class="gacha-machine">
      <div class="capsule" id="capsule">?</div>
    </div>
    <button id="rollBtn">Roll (100 coins)</button>
    <p id="result"></p>
  `;

  // Dice Game HTML
  const diceHTML = `
    <div class="dice-container">
      <button id="rollDiceBtn">Roll Dice</button>
      <p class="dice-result" id="diceResult">Roll to start!</p>
    </div>
  `;

  // Initialize Gacha game state
  let balance = 1000;

  // Load Gacha Machine game
  function loadGachaGame() {
    gameArea.innerHTML = gachaHTML;
    balance = 1000;
    const rollBtn = document.getElementById("rollBtn");
    const balanceDisplay = document.getElementById("balance");
    const resultDisplay = document.getElementById("result");
    const capsule = document.getElementById("capsule");

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

    rollBtn.addEventListener("click", () => {
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

      setTimeout(() => {
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

        rollBtn.disabled = false;
      }, 1200);
    });
  }

  // Load Dice Game
  function loadDiceGame() {
    gameArea.innerHTML = diceHTML;

    const rollDiceBtn = document.getElementById("rollDiceBtn");
    const diceResult = document.getElementById("diceResult");

    rollDiceBtn.addEventListener("click", () => {
      rollDiceBtn.disabled = true;
      diceResult.textContent = "Rolling...";
      setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = `You rolled a ${roll}!`;
        rollDiceBtn.disabled = false;
      }, 1000);
    });
  }

  // Default load Gacha game on page load
  loadGachaGame();

  // Buttons to switch games
  gachaBtn.addEventListener("click", loadGachaGame);
  diceBtn.addEventListener("click", loadDiceGame);
});


