let money = 10000;
let xp = 0;
let level = 1;
let xpToNextLevel = 1000;
let selectedBuff = 1;

const characters = [
  { name: "Sakura Haruno", anime: "Naruto", buff: 0.05, cost: 500, unlocked: false },
  { name: "Naruto Uzumaki", anime: "Naruto", buff: 0.1, cost: 2000, unlocked: false },
  { name: "Yoichi Isagi", anime: "Blue Lock", buff: 0.15, cost: 5000, unlocked: false },
  { name: "Nika D. Sun God", anime: "One Piece", buff: 1.0, cost: 10000, unlocked: false }
];

const slots = document.querySelectorAll(".slot");
const resultText = document.getElementById("result");
const moneyText = document.getElementById("money");
const levelText = document.getElementById("level");
const xpText = document.getElementById("xp");
const store = document.getElementById("character-store");
const diceResult = document.getElementById("dice-result");

function updateUI() {
  moneyText.textContent = `Money: $${money}`;
  levelText.textContent = `Level: ${level}`;
  xpText.textContent = `XP: ${xp}/${xpToNextLevel}`;
}

function getRollCost() {
  return 100 * level;
}

function getXPPerWin() {
  return 500 * level;
}

function spinSlots() {
  const rollCost = getRollCost();
  if (money < rollCost) {
    resultText.textContent = "Not enough money!";
    return;
  }

  money -= rollCost;

  const values = [];
  for (let i = 0; i < slots.length; i++) {
    const val = Math.floor(Math.random() * 5) + 1;
    slots[i].textContent = val;
    values.push(val);
  }

  if (values.every(val => val === values[0])) {
    const reward = Math.floor(rollCost * 5 * selectedBuff);
    resultText.textContent = `Jackpot! You won $${reward}`;
    money += reward;
    xp += getXPPerWin();
    checkLevelUp();
  } else {
    resultText.textContent = "Try again!";
  }

  updateUI();
}

function checkLevelUp() {
  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.1);
  }
}

function createCharacterStore() {
  store.innerHTML = "";
  characters.forEach((char, index) => {
    const charElem = document.createElement("div");
    charElem.classList.add("character");
    charElem.innerText = `${char.name} (${char.anime}) - Buff: +${(char.buff * 100).toFixed(0)}% - Cost: $${char.cost}`;
    const button = document.createElement("button");
    button.innerText = char.unlocked ? "Use" : "Buy";
    button.onclick = () => {
      if (!char.unlocked) {
        if (money >= char.cost) {
          money -= char.cost;
          char.unlocked = true;
          selectedBuff = 1 + char.buff;
        } else {
          alert("Not enough money!");
        }
      } else {
        selectedBuff = 1 + char.buff;
      }
      createCharacterStore();
      updateUI();
    };
    charElem.appendChild(button);
    store.appendChild(charElem);
  });
}

function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  let reward = 0;
  switch (dice) {
    case 6: reward = 600 * selectedBuff; break;
    case 5: reward = 300 * selectedBuff; break;
    case 4: reward = 200 * selectedBuff; break;
    case 3: reward = 100 * selectedBuff; break;
    case 2: reward = 50 * selectedBuff; break;
    case 1: reward = 0; break;
  }
  money += Math.floor(reward);
  diceResult.textContent = `You rolled a ${dice} and earned $${Math.floor(reward)}`;
  updateUI();
}

// MUSIC
const music = new Audio("bg-music.mp3");
music.loop = true;
document.addEventListener("click", () => {
  if (music.paused) {
    music.play();
  }
}, { once: true });

// Initialize
createCharacterStore();
updateUI();
