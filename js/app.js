// Expense & Budget Visualizer
// Main application file

// ============================================================================
// Storage Module
// ============================================================================

const STORAGE_KEY = "transactions";

/**
 * Check if Local Storage is available
 * @returns {boolean} True if Local Storage is available, false otherwise
 */
function isStorageAvailable() {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Load all transactions from Local Storage
 * @returns {Array} Array of transaction objects, or empty array if none exist
 */
function loadTransactions() {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error loading transactions from Local Storage:", e);
    return [];
  }
}

/**
 * Save all transactions to Local Storage
 * @param {Array} transactions - Array of transaction objects to save
 */
function saveTransactions(transactions) {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return;
  }

  try {
    const data = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    console.error("Error saving transactions to Local Storage:", e);
    if (e.name === "QuotaExceededError") {
      alert("Storage full - unable to save transaction");
    }
  }
}

// ============================================================================
// Transaction Model
// ============================================================================

const CATEGORIES = ["Food", "Transport", "Fun"];

/**
 * Transaction class representing a single expense
 */
class Transaction {
  /**
   * Create a new transaction
   * @param {string} itemName - Name of the expense item
   * @param {number} amount - Cost of the item (positive number)
   * @param {string} category - Category label (Food, Transport, or Fun)
   */
  constructor(itemName, amount, category) {
    this.id =
      Date.now().toString() + Math.random().toString(36).substring(2, 11);
    this.itemName = itemName.trim();
    this.amount = parseFloat(amount);
    this.category = category;
  }
}

/**
 * Validate transaction input from form
 * @param {string} itemName - Item name input value
 * @param {string} amount - Amount input value
 * @param {string} category - Category input value
 * @returns {Object} Validation result with valid flag and optional error message
 */
function validateTransactionInput(itemName, amount, category) {
  // Check for empty fields
  if (
    !itemName ||
    !itemName.trim() ||
    !amount ||
    !amount.trim() ||
    !category ||
    !category.trim()
  ) {
    return { valid: false, error: "All fields are required" };
  }

  // Validate amount is a number
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum)) {
    return { valid: false, error: "Amount must be a positive number" };
  }

  // Validate amount is positive
  if (amountNum <= 0) {
    return { valid: false, error: "Amount must be a positive number" };
  }

  // Validate category is one of the allowed values
  if (!CATEGORIES.includes(category)) {
    return { valid: false, error: "Invalid category selected" };
  }

  return { valid: true };
}

/**
 * Calculate total balance from all transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {number} Total sum of all transaction amounts
 */
function calculateTotal(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return 0;
  }

  return transactions.reduce((total, transaction) => {
    return total + (transaction.amount || 0);
  }, 0);
}

/**
 * Calculate spending totals by category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with category names as keys and totals as values
 */
function calculateCategoryTotals(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { Food: 0, Transport: 0, Fun: 0 };
  }

  const totals = { Food: 0, Transport: 0, Fun: 0 };

  transactions.forEach((transaction) => {
    if (transaction.category && totals.hasOwnProperty(transaction.category)) {
      totals[transaction.category] += transaction.amount || 0;
    }
  });

  return totals;
}

// ============================================================================
// Chart Module
// ============================================================================

let chartInstance = null;

/**
 * Initialize Chart.js pie chart instance
 */
function initChart() {
  const canvas = document.getElementById("spending-chart");
  if (!canvas) {
    console.error("Chart canvas element not found");
    return null;
  }

  const ctx = canvas.getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Transport", "Fun"],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            "#FF6384", // Food - pink/red
            "#36A2EB", // Transport - blue
            "#FFCE56", // Fun - yellow
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: $${value.toFixed(2)}`;
            },
          },
        },
      },
    },
  });

  return chartInstance;
}

/**
 * Update chart with current category totals
 */
function updateChart() {
  if (!chartInstance) {
    console.warn("Chart instance not initialized");
    return;
  }

  const categoryTotals = calculateCategoryTotals(transactions);

  // Update chart data with category totals
  chartInstance.data.datasets[0].data = [
    categoryTotals.Food,
    categoryTotals.Transport,
    categoryTotals.Fun,
  ];

  // Refresh the chart
  chartInstance.update();
}

// ============================================================================
// UI Module
// ============================================================================

// Application state
let transactions = [];

/**
 * Display error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";

    // Clear error after 3 seconds
    setTimeout(() => {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }, 3000);
  }
}

/**
 * Update the balance display with the current total
 */
function updateBalance() {
  const balanceElement = document.getElementById("balance");
  if (!balanceElement) {
    return;
  }

  const total = calculateTotal(transactions);
  balanceElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Clear all form fields
 */
function clearForm() {
  const form = document.getElementById("transaction-form");
  if (form) {
    form.reset();
  }
}

/**
 * Render all transactions to the transaction list
 */
function renderTransactions() {
  const listContainer = document.getElementById("transaction-list");
  if (!listContainer) {
    return;
  }

  // Clear existing content
  listContainer.innerHTML = "";

  // Show empty state if no transactions
  if (transactions.length === 0) {
    listContainer.innerHTML =
      '<p class="empty-state">No transactions yet. Add one to get started!</p>';
    return;
  }

  // Render each transaction
  transactions.forEach((transaction) => {
    const transactionElement = document.createElement("div");
    transactionElement.className = "transaction-item";
    transactionElement.dataset.id = transaction.id;

    transactionElement.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-name">${transaction.itemName}</div>
        <div class="transaction-details">
          <span class="transaction-amount">$${transaction.amount.toFixed(2)}</span>
          <span class="transaction-category">${transaction.category}</span>
        </div>
      </div>
      <button class="btn-delete" data-id="${transaction.id}">Delete</button>
    `;

    listContainer.appendChild(transactionElement);
  });
}

/**
 * Handle transaction deletion
 * @param {string} transactionId - ID of the transaction to delete
 */
function handleDelete(transactionId) {
  // Find and remove transaction from array
  const index = transactions.findIndex((t) => t.id === transactionId);
  if (index === -1) {
    return;
  }

  transactions.splice(index, 1);

  // Update Local Storage
  saveTransactions(transactions);

  // Re-render transaction list
  renderTransactions();

  // Update balance
  updateBalance();

  // Update chart
  updateChart();
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  // Get form values
  const itemNameInput = document.getElementById("item-name");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");

  const itemName = itemNameInput.value;
  const amount = amountInput.value;
  const category = categoryInput.value;

  // Validate input
  const validation = validateTransactionInput(itemName, amount, category);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }

  // Create and add transaction
  const transaction = new Transaction(itemName, parseFloat(amount), category);
  transactions.push(transaction);

  // Save to Local Storage
  saveTransactions(transactions);

  // Clear form
  clearForm();

  // Update UI
  renderTransactions();
  updateBalance();

  // Update chart
  updateChart();
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load transactions from storage
  transactions = loadTransactions();

  // Render initial transaction list
  renderTransactions();

  // Update initial balance display
  updateBalance();

  // Initialize chart
  initChart();
  updateChart();

  // Attach form submit event listener
  const form = document.getElementById("transaction-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Set up event delegation for delete buttons
  const listContainer = document.getElementById("transaction-list");
  if (listContainer) {
    listContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-delete")) {
        const transactionId = event.target.dataset.id;
        if (transactionId) {
          handleDelete(transactionId);
        }
      }
    });
  }

  // Check storage availability
  if (!isStorageAvailable()) {
    showError("Storage unavailable - data will not be saved");
  }

  console.log("Expense & Budget Visualizer loaded");
});
