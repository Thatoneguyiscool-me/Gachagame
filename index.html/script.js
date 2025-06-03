document.addEventListener("DOMContentLoaded", function() {
  const rollBtn = document.getElementById("rollBtn");
  const balanceDisplay = document.getElementById("balance");
  const resultDisplay = document.getElementById("result");
  const capsule = document.getElementById("capsule");
  const historyList = document.getElementById("history-list");

  let balance = 1000;
  let rollHistory = [];

  // Update balance text on the page
  function updateBalance() {
    balanceDisplay.textContent = balance;
  }

  // Show starting balance immediately
  updateBalance();

  // Rewards definitions
  const rewards = [
    { amount: 0, color: "#666", label: "No Prize 💨" },
    { amount: 50, color: "#4caf50", label: "Common 💎" },
    { amount: 100, color: "#2196f3", label: "Rare 🧿" },
    { amount: 250, color: "#ffc107", label: "Legendary 🟡" },

    
