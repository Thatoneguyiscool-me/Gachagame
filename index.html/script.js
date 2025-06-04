document.addEventListener("DOMContentLoaded", () => {

  // --- SWITCH GAME VIEWS ---

  const btnShowGacha = document.getElementById("btnShowGacha");
  const btnShowDice = document.getElementById("btnShowDice");
  const gachaGame = document.getElementById("gachaGame");
  const diceGame = document.getElementById("diceGame");

  btnShowGacha.addEventListener("click", () => {
    gachaGame.classList.remove("hidden");
    diceGame.classList.add("hidden");
  });

  btnShowDice.addEventListener("click", () => {
    diceGame.classList.remove("hidden");
    gachaGame.classList.add("hidden");
  });

  // --- GACHA MACHINE ---

  const rollBtn = document.getElementById("rollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");

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
  const chances = [30, 25, 20, 15, 10]; // percentages

  rollBtn.addEventListener("click", () => {
    if (balance < 100) {
      resultDisplay.textContent = "Not enough coins to roll! You need 100 coins.";
      return;
    }

    rollBtn.disabled = true;
    resultDisplay.textContent = "";
    capsule.textContent = "?";
    capsule.style.backgroundColor = "#ff00ff";
    capsule.classList.add("spin");

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

  // --- DICE GAME ---

  const diceRollBtn = document.getElementById("diceRollBtn");
  const diceResult = document.getElementById("diceResult");
  const diceMessage = document.getElementById("diceMessage");

  diceRollBtn.addEventListener("click", () => {
    diceRollBtn.disabled = true;
    diceMessage.textContent = "";
    diceResult.textContent = "🎲";

    setTimeout(() => {
      // Roll a dice number 1-6
      const roll = Math.floor(Math.random() * 6) + 1;

      // Show dice emoji for the number
      const diceEmojis = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      diceResult.textContent = diceEmojis[roll];

      diceMessage.textContent = `You rolled a ${roll}!`;

      diceRollBtn.disabled = false;
    }, 800);
  });

});



    
   



