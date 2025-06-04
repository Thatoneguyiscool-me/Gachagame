<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JJ's Casino</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="menu">
    <h1>🎰 Welcome to JJ's Casino 🎲</h1>
    <p>Select a game to play:</p>
    <button onclick="startGame('gacha')">Play Gacha Machine</button>
    <button onclick="startGame('dice')">Play Roll Dice</button>
  </div>

  <div id="gachaGame" class="game hidden">
    <h2>🎰 Gacha Machine 🎰</h2>
    <p>Your Balance: <span id="balance">1000</span> coins</p>
    <div class="slots">
      <div class="slot" id="slot1">?</div>
      <div class="slot" id="slot2">?</div>
      <div class="slot" id="slot3">?</div>
    </div>
    <button id="rollBtn">Roll (100 coins)</button>
    <button id="multiRollBtn">Multi-Roll (1000 coins)</button>
    <p id="result"></p>
    <p id="levelDisplay"></p>
    <p id="achievementDisplay"></p>
    <p id="characterBoostDisplay"></p>
    <div id="historyPanel"></div>
    <button id="gachaFullscreenBtn">🖥️ Fullscreen</button>
    <button onclick="returnToMenu()">🔙 Back to Menu</button>
  </div>

  <div id="diceGame" class="game hidden">
    <h2>🎲 Dice Game 🎲</h2>
    <p>Roll a 6-sided die!</p>
    <button onclick="rollDice()">Roll Dice</button>
    <p id="diceResult">🎲</p>
    <button id="diceFullscreenBtn">🖥️ Fullscreen</button>
    <button onclick="returnToMenu()">🔙 Back to Menu</button>
  </div>

  <script src="script.js"></script>
</body>
</html>

   
    
