// --- Game State Variables ---
let cash = 1000;
let level = 1;
let xp = 0;
let xpToLevel = 1000; // XP required increases by 1000 every level
let rollHistory = [];

const animeCharacters = [

 { name: "Sakura Haruno", anime: "Naruto", buff: 0.05, cost: 500, unlocked: false },
 { name: "Naruto Uzumaki", anime: "Naruto", buff: 0.1, cost: 2000, unlocked: false },
 { name: "Yoichi Isagi", anime: "Blue Lock", buff: 0.15, cost: 5000, unlocked: false },
{ name: "Nika D. Sun God", anime: "One Piece", buff: 100, cost: 10000, unlocked: false }


];
let unlockedCharacters = [];

// --- DOM Elements ---
const cashEl = document.getElementById('cash');
const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const buffCountEl = document.getElementById('buffCount');
const charactersListEl = document.getElementById('charactersList');
const slotsEl = document.getElementById('slots');
const rollBtn = document.getElementById('rollBtn');
const multiRollBtn = document.getElementById('multiRollBtn');
const diceBtn = document.getElementById('diceBtn');
const diceResultEl = document.getElementById('diceResult');
const buyXPBoostBtn = document.getElementById('buyXPBoostBtn');
const buyCashBonusBtn = document.getElementById('buyCashBonusBtn');
const rollHistoryEl = document.getElementById('rollHistory');
const messageEl = document.getElementById('message');

// --- Utility Functions ---
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateUI() {
  cashEl.textContent = cash.toFixed(2);
  levelEl.textContent = level;
  xpEl.textContent = `${xp}/${xpToLevel}`;
  buffCountEl.textContent = `${unlockedCharacters.length} (+${unlockedCharacters.length * 10}%)`;
  charactersListEl.textContent = unlockedCharacters.length > 0
    ? 'Unlocked Characters: ' + unlockedCharacters.map(c => c.name).join(', ')
    : 'Unlocked Characters: None';
  rollBtn.disabled = cash < getRollCost();
  multiRollBtn.disabled = cash < getRollCost() * 10;
  diceBtn.disabled = cash < getDiceCost();
  buyXPBoostBtn.disabled = cash < 100;
  buyCashBonusBtn.disabled = cash < 150;
}

function getRollCost() {
  return 50 + (level - 1) * 25; // Increases more drastically per level
}

function getDiceCost() {
  return 20 + (level - 1) * 10;
}

function addXP(amount) {
  xp += amount;
  while (xp >= xpToLevel) {
    xp -= xpToLevel;
    level++;
    xpToLevel += 1000; // Each level needs 1000 more XP than the last
    showMessage(`🎉 You reached level ${level}!`);
  }
}

function getBuffMultiplier() {
  const charBuff = unlockedCharacters.length * 0.1;
  const levelBuff = level * 0.1;
  return (1 + charBuff) * (1 + levelBuff);
}

function showMessage(msg) {
  messageEl.textContent = msg;
}

function updateRollHistory() {
  rollHistoryEl.innerHTML = rollHistory.slice(-10).reverse().map(r => `🎰 ${r}`).join('<br>');
}

function unlockRandomCharacter() {
  const locked = animeCharacters.filter(c => !unlockedCharacters.includes(c));
  if (locked.length === 0) return;
  const randomChar = locked[getRandomInt(0, locked.length - 1)];
  unlockedCharacters.push(randomChar);
  showMessage(`⭐ You unlocked ${randomChar.name}! (+10% cash buff)`);
}

// --- Gacha Functions ---
function rollGacha() {
  const cost = getRollCost();
  if (cash < cost) return showMessage("Not enough cash!");

  cash -= cost;
  const roll = [getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)];
  slotsEl.textContent = roll.join(' ');
  rollHistory.push(roll.join(' '));

  let reward = 10 * getBuffMultiplier();
  if (roll[0] === roll[1] && roll[1] === roll[2]) {
    reward += 50;
    unlockRandomCharacter();
  }

  cash += reward;
  addXP(10);
  updateUI();
  updateRollHistory();
  showMessage(`You earned $${reward.toFixed(2)}!`);
}

function multiRoll() {
  const cost = getRollCost() * 10;
  if (cash < cost) return showMessage("Not enough cash for 10 rolls!");

  cash -= cost;
  let totalReward = 0;

  for (let i = 0; i < 10; i++) {
    const roll = [getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)];
    rollHistory.push(roll.join(' '));
    let reward = 10 * getBuffMultiplier();
    if (roll[0] === roll[1] && roll[1] === roll[2]) {
      reward += 50;
      unlockRandomCharacter();
    }
    cash += reward;
    totalReward += reward;
    addXP(10);
  }

  slotsEl.textContent = '- - -';
  updateUI();
  updateRollHistory();
  showMessage(`10x Rolls: You earned $${totalReward.toFixed(2)}!`);
}

// --- Dice Minigame ---
function playDice() {
  const cost = getDiceCost();
  if (cash < cost) return showMessage("Not enough cash!");
  cash -= cost;

  const roll = getRandomInt(1, 6);
  diceResultEl.textContent = `🎲 You rolled a ${roll}`;

  let reward = 0;
  switch (roll) {
    case 6: reward = 50; break;
    case 5: reward = 25; break;
    case 4: reward = 15; break;
    case 3: reward = 10; break;
    case 2: reward = 5; break;
    case 1: reward = 1; break;
  }
  reward *= getBuffMultiplier();
  cash += reward;
  updateUI();
  showMessage(`Dice game: You earned $${reward.toFixed(2)}!`);
}

// --- Store Buttons ---
buyXPBoostBtn.addEventListener('click', () => {
  if (cash < 100) return showMessage("Not enough cash!");
  cash -= 100;
  addXP(50);
  updateUI();
  showMessage("+50 XP Boost Purchased!");
});

buyCashBonusBtn.addEventListener('click', () => {
  if (cash < 150) return showMessage("Not enough cash!");
  cash -= 150;
  cash += 100;
  updateUI();
  showMessage("+$100 Cash Bonus Purchased!");
});

// --- Event Listeners ---
rollBtn.addEventListener('click', rollGacha);
multiRollBtn.addEventListener('click', multiRoll);
diceBtn.addEventListener('click', playDice);

// --- Initial Setup ---
updateUI();
updateRollHistory();
