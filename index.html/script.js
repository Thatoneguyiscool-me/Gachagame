// Game Variables
let cash = 1000.0;
let level = 1;
let xp = 0;
let xpToLevel = 100;
let rollHistory = [];
const animeCharacters = [
  { name: 'Sakura', buff: 0.1 },
  { name: 'Naruto', buff: 1 },
  { name: 'Sasuke', buff: 2 },
  { name: 'LUffy', buff: 3  },
  { name: 'Kakshi', buff: 4 },
];
let unlockedCharacters = [];

// Costs
const rollCost = 20;
const diceCost = 10;

// DOM Elements
const slotsEl = document.getElementById('slots');
const rollBtn = document.getElementById('rollBtn');
const multiRollBtn = document.getElementById('multiRollBtn');
const cashEl = document.getElementById('cash');
const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const buffCountEl = document.getElementById('buffCount');
const rollHistoryEl = document.getElementById('rollHistory');
const messageEl = document.getElementById('message');
const charactersListEl = document.getElementById('charactersList');
const diceBtn = document.getElementById('diceBtn');
const diceResult = document.getElementById('diceResult');
const buyXPBoostBtn = document.getElementById('buyXPBoostBtn');
const buyCashBonusBtn = document.getElementById('buyCashBonusBtn');

// Helpers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateDisplays() {
  cashEl.textContent = cash.toFixed(2);
  levelEl.textContent = level;
  xpEl.textContent = `${xp}/${xpToLevel}`;
  buffCountEl.textContent = `${unlockedCharacters.length} (+${(unlockedCharacters.length * 10)}%)`;
  updateButtons();
}

function updateButtons() {
  rollBtn.disabled = cash < rollCost;
  multiRollBtn.disabled = cash < rollCost * 10;
  diceBtn.disabled = cash < diceCost;
  buyXPBoostBtn.disabled = cash < 100;
  buyCashBonusBtn.disabled = cash < 150;
}

function displayMessage(msg) {
  messageEl.textContent = msg;
}

function updateSlots(nums) {
  slotsEl.textContent = nums.join(' ');
}

function addXP(amount) {
  xp += amount;
  while (xp >= xpToLevel) {
    xp -= xpToLevel;
    level++;
    displayMessage(`Level Up! You reached level ${level}!`);
  }
}

function getTotalBuffMultiplier() {
  let characterBuff = unlockedCharacters.length * 0.1; // 10% per char
  let levelBuff = level * 0.1; // 10% per level
  return (1 + characterBuff) * (1 + levelBuff);
}

function unlockCharacterRandom() {
  if (unlockedCharacters.length >= animeCharacters.length) return;
  let locked = animeCharacters.filter(c => !unlockedCharacters.includes(c));
  if (locked.length === 0) return;
  let choice = locked[getRandomInt(0, locked.length - 1)];
  unlockedCharacters.push(choice);
  updateCharactersList();
  displayMessage(`You unlocked ${choice.name}! Buff +10% cash earnings.`);
}

function updateCharactersList() {
  if (unlockedCharacters.length === 0) {
    charactersListEl.textContent = 'Unlocked Characters: None';
  } else {
    charactersListEl.textContent = 'Unlocked Characters: ' + unlockedCharacters.map(c => c.name).join(', ');
  }
}

function rollGacha() {
  if (cash < rollCost) {
    displayMessage(`Not enough cash to roll! Need $${rollCost}`);
    return;
  }
  cash -= rollCost;
  const nums = [getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)];
  updateSlots(nums);
  rollHistory.push(nums.join(' '));
  if (rollHistory.length > 10) rollHistory.shift();

  const baseCash = 10;
  const earned = baseCash * getTotalBuffMultiplier();
  cash += earned;

  addXP(10);

  if (nums[0] === nums[1] && nums[1] === nums[2]) {
    unlockCharacterRandom();
  }

  updateDisplays();
  updateRollHistory();
  displayMessage(`Rolled and spent $${rollCost}. Earned $${earned.toFixed(2)}!`);
}

function multiRoll(count = 10) {
  const totalCost = rollCost * count;
  if (cash < totalCost) {
    displayMessage(`Not enough cash for ${count} rolls! Need $${totalCost}`);
    return;
  }
  cash -= totalCost;

  for (let i = 0; i < count; i++) {
    const nums = [getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)];
    rollHistory.push(nums.join(' '));
    if (rollHistory.length > 10) rollHistory.shift();

    const baseCash = 10;
    const earned = baseCash * getTotalBuffMultiplier();
    cash += earned;

    addXP(10);

    if (nums[0] === nums[1] && nums[1] === nums[2]) {
      unlockCharacterRandom();
    }
  }

  updateSlots(['-', '-', '-']);
  updateDisplays();
  updateRollHistory();
  displayMessage(`Completed ${count} rolls, spent $${totalCost}!`);
}

function updateRollHistory() {
  rollHistoryEl.innerHTML = rollHistory.map(r => `Rolled: ${r}`).reverse().join('<br>');
}

function playDice() {
  if (cash < diceCost) {
    displayMessage(`Not enough cash to play dice! Need $${diceCost}`);
    return;
  }
  cash -= diceCost;

  const roll = getRandomInt(1, 6);
  diceResult.textContent = `Dice rolled: ${roll}`;

  let earned = 0;
  switch (roll) {
    case 6: earned = 50; break;
    case 5: earned = 20; break;
    case 4: earned = 15; break;
    case 3: earned = 10; break;
    case 2: earned = 5; break;
    case 1: earned = 1; break;
  }

  earned *= getTotalBuffMultiplier();
  cash += earned;

  updateDisplays();
  displayMessage(`Spent $${diceCost} to play dice. You earned $${earned.toFixed(2)}!`);
}

// Store Button Handlers
buyXPBoostBtn.addEventListener('click', () => {
  if (cash < 100) {
    displayMessage('Not enough cash to buy XP Boost!');
    return;
  }
  cash -= 100;
  addXP(50);
  updateDisplays();
  displayMessage('Bought XP Boost (+50 XP)!');
});

buyCashBonusBtn.addEventListener('click', () => {
  if (cash < 150) {
    displayMessage('Not enough cash to buy Cash Bonus!');
    return;
  }
  cash -= 150;
  cash += 100; // instant cash bonus
  updateDisplays();
  displayMessage('Bought Cash Bonus (+$100)!');
});

// Button Event Listeners
rollBtn.addEventListener('click', rollGacha);
multiRollBtn.addEventListener('click', () => multiRoll(10));
diceBtn.addEventListener('click', playDice);

// Initial UI Setup
updateDisplays();
updateRollHistory();
updateCharactersList();
