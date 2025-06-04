const rollCost = 20;
const diceCost = 10;

function rollGacha() {
  if (cash < rollCost) {
    displayMessage(`Not enough cash to roll! Need $${rollCost}`);
    return;
  }
  cash -= rollCost;

  const nums = [getRandomInt(1,9), getRandomInt(1,9), getRandomInt(1,9)];
  updateSlots(nums);
  rollHistory.push(nums);
  if (rollHistory.length > 10) rollHistory.shift();

  const baseCash = 10;
  const totalMultiplier = getTotalBuffMultiplier();
  const earned = baseCash * totalMultiplier;
  cash += earned;

  addXP(10);

  if (nums[0] === nums[1] && nums[1] === nums[2]) {
    unlockCharacterRandom();
  }

  updateDisplays();
  displayMessage(`Rolled and spent $${rollCost}. Earned $${earned.toFixed(2)} from the roll!`);
}

function multiRoll(count = 10) {
  const totalCost = rollCost * count;
  if (cash < totalCost) {
    displayMessage(`Not enough cash for ${count} rolls! Need $${totalCost}`);
    return;
  }
  cash -= totalCost;

  for (let i = 0; i < count; i++) {
    const nums = [getRandomInt(1,9), getRandomInt(1,9), getRandomInt(1,9)];
    updateSlots(nums);
    rollHistory.push(nums);
    if (rollHistory.length > 10) rollHistory.shift();

    const baseCash = 10;
    const totalMultiplier = getTotalBuffMultiplier();
    const earned = baseCash * totalMultiplier;
    cash += earned;

    addXP(10);

    if (nums[0] === nums[1] && nums[1] === nums[2]) {
      unlockCharacterRandom();
    }
  }

  updateDisplays();
  displayMessage(`Completed ${count} rolls, spent $${totalCost}!`);
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

  const totalMultiplier = getTotalBuffMultiplier();
  earned *= totalMultiplier;
  cash += earned;

  updateDisplays();
  displayMessage(`Spent $${diceCost} to play dice. You earned $${earned.toFixed(2)}!`);
}
