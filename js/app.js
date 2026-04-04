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
// Category Module
// ============================================================================

const DEFAULT_CATEGORIES = ["Food", "Transport", "Fun"];
const CUSTOM_CATEGORIES_KEY = "customCategories";

/**
 * Load custom categories from Local Storage
 * @returns {Array} Array of custom category names, or empty array if none exist
 */
function loadCustomCategories() {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return [];
  }

  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error loading custom categories from Local Storage:", e);
    return [];
  }
}

/**
 * Save custom categories to Local Storage
 * @param {Array} categories - Array of custom category names to save
 */
function saveCustomCategories(categories) {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return;
  }

  try {
    const data = JSON.stringify(categories);
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, data);
  } catch (e) {
    console.error("Error saving custom categories to Local Storage:", e);
    if (e.name === "QuotaExceededError") {
      alert("Storage full - unable to save custom category");
    }
  }
}

/**
 * Get all categories (default + custom)
 * @returns {Array} Array of all category names
 */
function getAllCategories() {
  const customCategories = loadCustomCategories();
  return [...DEFAULT_CATEGORIES, ...customCategories];
}

/**
 * Check if a category is a default category
 * @param {string} categoryName - Category name to check
 * @returns {boolean} True if category is a default category
 */
function isDefaultCategory(categoryName) {
  return DEFAULT_CATEGORIES.includes(categoryName);
}

/**
 * Validate category name (non-empty and unique)
 * @param {string} categoryName - Category name to validate
 * @returns {Object} Validation result with valid flag and optional error message
 */
function validateCategoryName(categoryName) {
  // Check for empty or whitespace-only name
  if (!categoryName || !categoryName.trim()) {
    return { valid: false, error: "Category name cannot be empty" };
  }

  const trimmedName = categoryName.trim();

  // Check for duplicate name
  const allCategories = getAllCategories();
  if (allCategories.includes(trimmedName)) {
    return { valid: false, error: "Category already exists" };
  }

  return { valid: true };
}

/**
 * Add a new custom category
 * @param {string} categoryName - Name of the category to add
 * @returns {Object} Result with success flag and optional error message
 */
function addCustomCategory(categoryName) {
  // Validate category name
  const validation = validateCategoryName(categoryName);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const trimmedName = categoryName.trim();

  // Load current custom categories
  const customCategories = loadCustomCategories();

  // Add new category
  customCategories.push(trimmedName);

  // Save to Local Storage
  saveCustomCategories(customCategories);

  return { success: true };
}

/**
 * Delete a custom category
 * @param {string} categoryName - Name of the category to delete
 * @returns {Object} Result with success flag and optional error message
 */
function deleteCustomCategory(categoryName) {
  // Prevent deletion of default categories
  if (isDefaultCategory(categoryName)) {
    return { success: false, error: "Cannot delete default categories" };
  }

  // Load current custom categories
  const customCategories = loadCustomCategories();

  // Find and remove the category
  const index = customCategories.indexOf(categoryName);
  if (index === -1) {
    return { success: false, error: "Category not found" };
  }

  customCategories.splice(index, 1);

  // Save to Local Storage
  saveCustomCategories(customCategories);

  return { success: true };
}

/**
 * Reassign transactions from deleted category to a new category
 * @param {string} deletedCategory - Category being deleted
 * @param {string} newCategory - Category to reassign transactions to
 */
function reassignTransactions(deletedCategory, newCategory) {
  // Update all transactions with the deleted category
  transactions.forEach((transaction) => {
    if (transaction.category === deletedCategory) {
      transaction.category = newCategory;
    }
  });

  // Save updated transactions to Local Storage
  saveTransactions(transactions);
}

// ============================================================================
// Transaction Model
// ============================================================================

const CATEGORIES = ["Food", "Transport", "Fun"];

// Sort modes for transaction list
const SORT_MODES = {
  NONE: "none",
  AMOUNT_ASC: "amount-asc",
  AMOUNT_DESC: "amount-desc",
  CATEGORY: "category",
};

// Current sort mode state
let currentSortMode = SORT_MODES.NONE;

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
  const allCategories = getAllCategories();
  if (!allCategories.includes(category)) {
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
    // Return empty object for all categories
    const allCategories = getAllCategories();
    const totals = {};
    allCategories.forEach((cat) => {
      totals[cat] = 0;
    });
    return totals;
  }

  // Initialize totals for all categories
  const allCategories = getAllCategories();
  const totals = {};
  allCategories.forEach((cat) => {
    totals[cat] = 0;
  });

  transactions.forEach((transaction) => {
    if (transaction.category && totals.hasOwnProperty(transaction.category)) {
      totals[transaction.category] += transaction.amount || 0;
    }
  });

  return totals;
}

/**
 * Sort transactions by amount
 * @param {Array} transactions - Array of transaction objects
 * @param {boolean} ascending - True for ascending, false for descending
 * @returns {Array} Sorted array of transactions
 */
function sortByAmount(transactions, ascending = true) {
  return [...transactions].sort((a, b) => {
    if (ascending) {
      return a.amount - b.amount;
    } else {
      return b.amount - a.amount;
    }
  });
}

/**
 * Sort transactions by category alphabetically
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Sorted array of transactions
 */
function sortByCategory(transactions) {
  return [...transactions].sort((a, b) => {
    return a.category.localeCompare(b.category);
  });
}

/**
 * Apply current sort order to transaction list
 * @param {Array} transactions - Array of transaction objects
 * @param {string} sortMode - Sort mode to apply
 * @returns {Array} Sorted array of transactions
 */
function applySortOrder(transactions, sortMode) {
  switch (sortMode) {
    case SORT_MODES.AMOUNT_ASC:
      return sortByAmount(transactions, true);
    case SORT_MODES.AMOUNT_DESC:
      return sortByAmount(transactions, false);
    case SORT_MODES.CATEGORY:
      return sortByCategory(transactions);
    case SORT_MODES.NONE:
    default:
      return [...transactions];
  }
}

// ============================================================================
// Theme Module
// ============================================================================

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const THEME_STORAGE_KEY = "theme";

// Current theme state
let currentTheme = THEMES.LIGHT;

/**
 * Load theme preference from Local Storage
 * @returns {string|null} Theme preference or null if none exists
 */
function loadThemePreference() {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return null;
  }

  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme;
  } catch (e) {
    console.error("Error loading theme preference from Local Storage:", e);
    return null;
  }
}

/**
 * Save theme preference to Local Storage
 * @param {string} theme - Theme to save (light or dark)
 */
function saveThemePreference(theme) {
  if (!isStorageAvailable()) {
    console.error("Local Storage is not available");
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.error("Error saving theme preference to Local Storage:", e);
  }
}

/**
 * Get current theme
 * @returns {string} Current theme (light or dark)
 */
function getCurrentTheme() {
  return currentTheme;
}

/**
 * Set theme and apply CSS class
 * @param {string} theme - Theme to apply (light or dark)
 */
function setTheme(theme) {
  // Validate theme
  if (theme !== THEMES.LIGHT && theme !== THEMES.DARK) {
    console.error("Invalid theme:", theme);
    return;
  }

  // Update current theme state
  currentTheme = theme;

  // Apply theme class to body
  document.body.classList.remove(THEMES.LIGHT, THEMES.DARK);
  document.body.classList.add(theme);

  // Save preference to Local Storage
  saveThemePreference(theme);
}

/**
 * Initialize theme on startup
 */
function initializeTheme() {
  // Load saved theme preference
  const savedTheme = loadThemePreference();

  // Apply saved theme or default to light mode
  if (
    savedTheme &&
    (savedTheme === THEMES.LIGHT || savedTheme === THEMES.DARK)
  ) {
    setTheme(savedTheme);
  } else {
    setTheme(THEMES.LIGHT);
  }
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
  const allCategories = getAllCategories();

  // Generate colors for all categories
  const colors = generateCategoryColors(allCategories.length);

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: allCategories,
      datasets: [
        {
          data: new Array(allCategories.length).fill(0),
          backgroundColor: colors,
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
 * Generate colors for categories
 * @param {number} count - Number of colors to generate
 * @returns {Array} Array of color strings
 */
function generateCategoryColors(count) {
  const baseColors = [
    "#FF6384", // Food - pink/red
    "#36A2EB", // Transport - blue
    "#FFCE56", // Fun - yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
    "#FF6384", // Pink (repeat)
    "#C9CBCF", // Gray
  ];

  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
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
  const allCategories = getAllCategories();

  // Update chart labels and data
  chartInstance.data.labels = allCategories;
  chartInstance.data.datasets[0].data = allCategories.map(
    (cat) => categoryTotals[cat] || 0,
  );
  chartInstance.data.datasets[0].backgroundColor = generateCategoryColors(
    allCategories.length,
  );

  // Refresh the chart
  chartInstance.update();
}

/**
 * Update chart colors based on current theme
 * @param {string} theme - Current theme (light or dark)
 */
function updateChartTheme(theme) {
  if (!chartInstance) {
    console.warn("Chart instance not initialized");
    return;
  }

  // Update border color based on theme
  const borderColor = theme === THEMES.DARK ? "#1a1a1a" : "#fff";
  chartInstance.data.datasets[0].borderColor = borderColor;

  // Update legend text color
  if (chartInstance.options.plugins && chartInstance.options.plugins.legend) {
    const textColor = theme === THEMES.DARK ? "#e0e0e0" : "#333";
    chartInstance.options.plugins.legend.labels.color = textColor;
  }

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

  // Apply current sort order
  const sortedTransactions = applySortOrder(transactions, currentSortMode);

  // Render each transaction
  sortedTransactions.forEach((transaction) => {
    const transactionElement = document.createElement("div");
    transactionElement.className = "transaction-item";
    transactionElement.dataset.id = transaction.id;

    transactionElement.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-name">${transaction.itemName}</div>
        <div class="transaction-details">
          <span class="transaction-amount">${transaction.amount.toFixed(2)}</span>
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

  // Update sort indicator to maintain current sort
  updateSortIndicator(currentSortMode);
}

/**
 * Update the category dropdown with all categories
 */
function updateCategoryDropdown() {
  const categorySelect = document.getElementById("category");
  if (!categorySelect) {
    return;
  }

  const allCategories = getAllCategories();
  const currentValue = categorySelect.value;

  // Clear existing options except the first placeholder
  categorySelect.innerHTML = '<option value="">Select a category</option>';

  // Add all categories as options
  allCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore previous selection if still valid
  if (currentValue && allCategories.includes(currentValue)) {
    categorySelect.value = currentValue;
  }
}

/**
 * Render the category management interface
 */
function renderCategoryManagement() {
  const categoryListContainer = document.getElementById("category-list");
  if (!categoryListContainer) {
    return;
  }

  // Clear existing content
  categoryListContainer.innerHTML = "";

  const allCategories = getAllCategories();

  // Render each category
  allCategories.forEach((category) => {
    const categoryElement = document.createElement("div");
    const isDefault = isDefaultCategory(category);

    categoryElement.className = isDefault
      ? "category-item default"
      : "category-item";

    categoryElement.innerHTML = `
      <span class="category-name">${category}</span>
      ${isDefault ? '<span class="category-badge">Default</span>' : ""}
      <button 
        class="btn-delete-category" 
        data-category="${category}"
        ${isDefault ? "disabled" : ""}
      >
        Delete
      </button>
    `;

    categoryListContainer.appendChild(categoryElement);
  });
}

/**
 * Display category error message
 * @param {string} message - Error message to display
 */
function showCategoryError(message) {
  const errorElement = document.getElementById("category-error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("show");

    // Clear error after 3 seconds
    setTimeout(() => {
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    }, 3000);
  }
}

/**
 * Handle adding a new custom category
 */
function handleAddCategory() {
  const categoryInput = document.getElementById("new-category-name");
  if (!categoryInput) {
    return;
  }

  const categoryName = categoryInput.value;

  // Add the category
  const result = addCustomCategory(categoryName);

  if (!result.success) {
    showCategoryError(result.error);
    return;
  }

  // Clear input
  categoryInput.value = "";

  // Update UI
  renderCategoryManagement();
  updateCategoryDropdown();
}

/**
 * Handle deleting a custom category
 * @param {string} categoryName - Name of the category to delete
 */
function handleDeleteCategory(categoryName) {
  // Check if any transactions use this category
  const transactionsWithCategory = transactions.filter(
    (t) => t.category === categoryName,
  );

  if (transactionsWithCategory.length > 0) {
    // Prompt user to select reassignment category
    const allCategories = getAllCategories().filter(
      (cat) => cat !== categoryName,
    );

    const reassignCategory = prompt(
      `This category has ${transactionsWithCategory.length} transaction(s). Select a category to reassign them to:\n\n${allCategories.join(", ")}\n\nEnter category name:`,
    );

    if (!reassignCategory) {
      // User cancelled
      return;
    }

    if (!allCategories.includes(reassignCategory)) {
      showCategoryError("Invalid category selected for reassignment");
      return;
    }

    // Reassign transactions
    reassignTransactions(categoryName, reassignCategory);
  }

  // Delete the category
  const result = deleteCustomCategory(categoryName);

  if (!result.success) {
    showCategoryError(result.error);
    return;
  }

  // Update UI
  renderCategoryManagement();
  updateCategoryDropdown();
  renderTransactions();
  updateChart();
}

/**
 * Handle sort control change
 * @param {string} sortMode - Selected sort mode
 */
function handleSortChange(sortMode) {
  // Update current sort mode
  currentSortMode = sortMode;

  // Re-render transactions with new sort order
  renderTransactions();

  // Update sort indicator
  updateSortIndicator(sortMode);
}

/**
 * Update sort indicator in UI
 * @param {string} sortMode - Current sort mode
 */
function updateSortIndicator(sortMode) {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = sortMode;
  }
}

/**
 * Handle theme toggle
 */
function handleThemeToggle() {
  // Toggle between light and dark
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

  // Apply the new theme
  applyTheme(newTheme);
}

/**
 * Apply theme to UI elements
 * @param {string} theme - Theme to apply (light or dark)
 */
function applyTheme(theme) {
  // Set the theme (updates body class and saves to storage)
  setTheme(theme);

  // Update chart colors
  updateChartTheme(theme);

  // Update theme toggle button text
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.textContent =
      theme === THEMES.DARK ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme first (before loading other UI elements)
  initializeTheme();

  // Load transactions from storage
  transactions = loadTransactions();

  // Render initial transaction list
  renderTransactions();

  // Update initial balance display
  updateBalance();

  // Initialize chart
  initChart();
  updateChart();

  // Apply theme to chart
  updateChartTheme(currentTheme);

  // Render category management interface
  renderCategoryManagement();

  // Update category dropdown with all categories
  updateCategoryDropdown();

  // Update theme toggle button text
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.textContent =
      currentTheme === THEMES.DARK ? "☀️ Light Mode" : "🌙 Dark Mode";
  }

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

  // Set up add category button
  const addCategoryBtn = document.getElementById("add-category-btn");
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", handleAddCategory);
  }

  // Set up event delegation for category delete buttons
  const categoryListContainer = document.getElementById("category-list");
  if (categoryListContainer) {
    categoryListContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("btn-delete-category")) {
        const categoryName = event.target.dataset.category;
        if (categoryName) {
          handleDeleteCategory(categoryName);
        }
      }
    });
  }

  // Allow Enter key to add category
  const categoryInput = document.getElementById("new-category-name");
  if (categoryInput) {
    categoryInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleAddCategory();
      }
    });
  }

  // Set up sort control event listener
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      handleSortChange(event.target.value);
    });
  }

  // Set up theme toggle button event listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", handleThemeToggle);
  }

  // Check storage availability
  if (!isStorageAvailable()) {
    showError("Storage unavailable - data will not be saved");
  }

  console.log("Expense & Budget Visualizer loaded");
});
