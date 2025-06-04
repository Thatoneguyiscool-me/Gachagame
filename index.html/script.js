document.addEventListener('DOMContentLoaded', () => {
  // === ELEMENTS ===
  const rollBtn = document.getElementById('rollButton');
  const multiRollBtn = document.getElementById('multiRollButton');
  const storeBtn = document.getElementById('storeButton');
  const diceBtn = document.getElementById('diceButton');

  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');

  const levelDisplay = document.getElementById('levelDisplay');
  const achievementsDisplay = document.getElementById('achievementsDisplay');
  const rollHistoryContainer = document.getElementById('rollHistory');

  const music = document.getElementById('backgroundMusic');

  // === GAME STATE ===
  let playerLevel = 1;
  let playerXP = 0;
  let achievements = new Set();
  let rollHistory = [];

  // === CONSTANTS ===
  const XP_PER_ROLL = 10;
  const LEVEL_UP_XP = 100;

  // === FUNCTIONS ===

  // Utility: get random number between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Roll a single gacha (3 slot numbers)
  function rollGacha() {
    const nums = [getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)];
    updateSlots(nums);
    addRollXP();
    saveRollHistory(nums);
    updateLevelAndAchievements();
    playMusic();
  }

  // Multi-roll (e.g. 10 times)
  function multiRoll(count = 10) {
    for (let i = 0; i < count; i++) {
      rollGacha();
    }
    alert(`You did ${count} rolls!`);
  }

  // Update slot displays
  function updateSlots(nums) {
    slot1.textContent = nums[0];
    slot2.textContent = nums[1];
    slot3.textContent = nums[2];
  }

  // Add XP for rolling
  function addRollXP() {
    playerXP += XP_PER_ROLL;
    // Level up if XP hits threshold
    while (playerXP >= LEVEL_UP_XP) {
      playerXP -= LEVEL_UP_XP;
      playerLevel++;
      alert(`Level up! You reached level ${playerLevel}!`);
    }
  }

  // Save roll history and update UI
  function saveRollHistory(nums) {
    const rollString = nums.join(' | ');
    rollHistory.push(rollString);

    // Limit history to last 10 rolls
    if (rollHistory.length > 10) rollHistory.shift();

    updateRollHistoryUI();
  }

  // Update roll history UI
  function updateRollHistoryUI() {
    if (!rollHistoryContainer) return;

    rollHistoryContainer.innerHTML = ''; // clear

    rollHistory.forEach((roll, index) => {
      const div = document.createElement('div');
      div.textContent = `Roll ${index + 1}: ${roll}`;
      rollHistoryContainer.appendChild(div);
    });
  }

  // Update level and achievements displays
  function updateLevelAndAchievements() {
    if (levelDisplay) {
      levelDisplay.textContent = `Level: ${playerLevel} (XP: ${playerXP})`;
    }

    if (!achievementsDisplay) return;

    // Simple achievement milestones
    if (playerLevel >= 100 && !achievements.has('God')) {
      achievements.add('God');
      achievementsDisplay.textContent = 'Achievement: God (Level 100)';
      alert('Achievement unlocked: God!');
    } else if (playerLevel >= 50 && !achievements.has('Pro')) {
      achievements.add('Pro');
      achievementsDisplay.textContent = 'Achievement: Pro (Level 50)';
      alert('Achievement unlocked: Pro!');
    } else if (playerLevel >= 10 && !achievements.has('Basic')) {
      achievements.add('Basic');
      achievementsDisplay.textContent = 'Achievement: Basic (Level 10)';
      alert('Achievement unlocked: Basic!');
    } else if (!achievements.has('Rookie')) {
      achievements.add('Rookie');
      achievementsDisplay.textContent = 'Achievement: Rookie (Level 1)';
    }
  }

  // Play background music or roll sound
  function playMusic() {
    if (music) {
      music.currentTime = 0;
      music.play().catch(() => {
        // Autoplay might be blocked by browser
        console.log('Music playback blocked.');
      });
    }
  }

  // Open store UI (placeholder)
  function openStore() {
    alert('Store opened! Implement your store UI here.');
  }

  // Dice roll mini-game logic
  function rollDice() {
    const diceRoll = getRandomInt(1, 6);
    alert(`You rolled a ${diceRoll}! Implement dice game logic here.`);
  }

  // === ATTACH EVENT LISTENERS ===
  if (rollBtn) rollBtn.addEventListener('click', rollGacha);
  if (multiRollBtn) multiRollBtn.addEventListener('click', () => multiRoll(10));
  if (storeBtn) storeBtn.addEventListener('click', openStore);
  if (diceBtn) diceBtn.addEventListener('click', rollDice);

  // Initialize display
  updateLevelAndAchievements();
  updateRollHistoryUI();
  updateSlots(['-', '-', '-']);
});
