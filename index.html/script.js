document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const playGachaBtn = document.getElementById("playGachaBtn");
  const playDiceBtn = document.getElementById("playDiceBtn");

  let characterBuff = 1;
  let level = 1;

  const characters = {
    "None": 1,
    "Goku": 1.5,
    "Naruto": 1.3,
    "Luffy": 1.2,
    "Saitama": 2
  };

  const gachaHTML = `
    <div class="machine-container">
      <h2>🎰 Gacha Machine 🎰</h2>
      <div class="character-select">
        <label>Select Anime Character:</label>
        <select id="characterSelect">
          <option>None</option>
          <option>Goku</option>
          <option>Naruto</option>
          <option>Luffy</option>
          <option>Saitama</option>
        </select>
      </div>
      <p>Balance: <span id="balance">1000</span> coins | Level: <span id="playerLevel">1</span></p>
      <div class="slots">
        <div class="slot" id="slot1">?</div>
        <div class="slot" id="slot2">?</div>
        <div class="slot" id="slot3">?</div>
      </div>
      <button id="rollBtn">Roll (100 coins)</button>
      <p id="result"></p>
      <div class="achievement" id="achievement"></div>
    </div>
  `;

  const diceHTML = `
    <div class="dice-container">
      <h2>🎲 Dice Game 🎲</h2>
      <p>Your Roll: <span id="diceResult">-</span></p>
      <button id="rollDiceBtn">Roll Dice</button>
    </div>
  `;

  function setupGacha() {
    let balance = 1000;
    let rolls = 0;

    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");
    const slot3 = document.getElementById("slot3");
    const rollBtn = document.getElementById("rollBtn");
    const balanceDisplay = document.getElementById("balance");
    const resultDisplay = document.getElementById("result");
    const levelDisplay = document.getElementById("playerLevel");
    const achievementDisplay = document.getElementById("achievement");
    const charSelect = document.getElementById("characterSelect");

    charSelect.addEventListener("change", () => {
      characterBuff = characters[charSelect.value];
    });

    function updateBalance() {
      balanceDisplay.textContent = Math.floor(balance);
    }

    function updateLevel() {
      if (balance >= 1000000) {
        level = 5;
        achievementDisplay.textContent = "🏆 GOD ACHIEVEMENT UNLOCKED! Minigames unlocked!";
      } else if (balance >= 100000) {
        level = 4;
        achievementDisplay.textContent = "🏅 PRO ACHIEVEMENT UNLOCKED!";
      } else if (balance >= 10000) {
        level = 3;
        achievementDisplay.textContent = "🎖️ BASIC ACHIEVEMENT UNLOCKED!";
      } else if (balance >= 1000) {
        level = 2;
        achievementDisplay.textContent = "🔰 ROOKIE ACHIEVEMENT UNLOCKED!";
      } else {
        level = 1;
        achievementDisplay.textContent = "";
      }
      levelDisplay.textContent = level;
    }

    rollBtn.addEventListener("click", () => {
      if (balance < 100) {
        resultDisplay.textContent = "Not enough coins!";
        return;
      }

      balance -= 100;
      updateBalance();

      slot1.textContent = slot2.textContent = slot3.textContent = "🎲";
      resultDisplay.textContent = "Rolling...";

      setTimeout(() => {
        const values = [
          Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 5)
        ];

        const symbols = ["💨", "💎", "🧿", "🟡", "🌈"];
        slot1.textContent = symbols[values[0]];
        slot2.textContent = symbols[values[1]];
        slot3.textContent = symbols[values[2]];

        const counts = {};
        values.forEach(v => counts[v] = (counts[v] || 0) + 1);

        let reward = 0;
        if (counts[4] === 3) reward = 1000;
        else if (counts[3] >= 2) reward = 500;
        else if (counts[2] >= 2) reward = 250;
        else if (counts[1] >= 2) reward = 100;
        else reward = 0;

        reward = Math.floor(reward * characterBuff);
        balance += reward;
        updateBalance();

        if (reward > 0) {
          resultDisplay.textContent = `You won ${reward} coins! 🎉`;
        } else {
          resultDisplay.textContent = "No match this time 😢";
        }

        rolls++;
        if (rolls % 10 === 0) {
          balance += 200; // bonus every 10 rolls
          resultDisplay.textContent += " (Bonus +200)";
          updateBalance();
        }

        updateLevel();
      }, 1000);
    });

    updateBalance();
    updateLevel();
  }

  function setupDice() {
    const diceResult = document.getElementById("diceResult");
    const rollDiceBtn = document.getElementById("rollDiceBtn");

    rollDiceBtn.addEventListener("click", () => {
      diceResult.textContent = Math.floor(Math.random() * 6) + 1;
    });
  }

  gameArea.innerHTML = gachaHTML;
  setupGacha();

  playGachaBtn.addEventListener("click", () => {
    gameArea.innerHTML = gachaHTML;
    setupGacha();
  });

  playDiceBtn.addEventListener("click", () => {
    gameArea.innerHTML = diceHTML;
    setupDice();
  });
});
