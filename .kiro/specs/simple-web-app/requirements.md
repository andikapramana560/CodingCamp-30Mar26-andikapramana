# Requirements Document

## Introduction

The Expense & Budget Visualizer is a minimal client-side web application that enables users to track expenses and visualize spending by category. The application runs entirely in the browser using HTML, CSS, and vanilla JavaScript, with all data persisted in browser Local Storage. This MVP focuses on core functionality: adding transactions, viewing a list, displaying total balance, and showing a pie chart of spending distribution.

## Glossary

- **Application**: The Expense & Budget Visualizer web application
- **User**: A person using the Application to track expenses
- **Transaction**: A spending record containing item name, amount, and category
- **Category**: A classification label for transactions (default: Food, Transport, Fun; user-defined custom categories also allowed)
- **Custom_Category**: A user-defined category label created and managed by the User
- **Default_Category**: A pre-defined category label (Food, Transport, Fun) that cannot be deleted
- **Local_Storage**: The browser's Local Storage API used for client-side data persistence
- **Balance**: The total sum of all transaction amounts
- **Chart**: A pie chart visualization showing spending distribution by category
- **Theme**: The visual appearance mode of the Application (Dark Mode or Light Mode)
- **Dark_Mode**: A color scheme with dark backgrounds and light text
- **Light_Mode**: A color scheme with light backgrounds and dark text

## Requirements

### Requirement 1: Transaction Input Form

**User Story:** As a User, I want to add transactions with item name, amount, and category, so that I can track my spending.

#### Acceptance Criteria

1. THE Application SHALL provide an input form with fields for Item Name, Amount, and Category
2. THE Application SHALL provide a Category dropdown with exactly three options (Food, Transport, Fun)
3. WHEN the User submits the form with all fields filled, THE Application SHALL add the transaction to the list
4. WHEN the User submits the form with all fields filled, THE Application SHALL store the transaction in Local_Storage
5. IF the User submits the form with any empty field, THEN THE Application SHALL display a validation error message
6. WHEN the User enters an amount, THE Application SHALL validate that the amount is a positive number
7. WHEN the User successfully adds a transaction, THE Application SHALL clear the form fields

### Requirement 2: Transaction List Display

**User Story:** As a User, I want to view all my transactions in a scrollable list, so that I can see my spending history.

#### Acceptance Criteria

1. THE Application SHALL display all transactions in a scrollable list
2. FOR EACH transaction, THE Application SHALL display the item name, amount, and category
3. WHEN the User adds a new transaction, THE Application SHALL update the list immediately
4. WHEN the User deletes a transaction, THE Application SHALL update the list immediately
5. THE Application SHALL display transactions in the order they were added

### Requirement 3: Transaction Deletion

**User Story:** As a User, I want to delete transactions from the list, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. FOR EACH transaction in the list, THE Application SHALL provide a delete button
2. WHEN the User clicks the delete button, THE Application SHALL remove the transaction from the list
3. WHEN the User deletes a transaction, THE Application SHALL remove the transaction from Local_Storage
4. WHEN the User deletes a transaction, THE Application SHALL update the total balance immediately
5. WHEN the User deletes a transaction, THE Application SHALL update the chart immediately

### Requirement 4: Total Balance Display

**User Story:** As a User, I want to see my total spending at the top of the page, so that I can quickly understand how much I've spent.

#### Acceptance Criteria

1. THE Application SHALL display the total balance at the top of the page
2. THE Application SHALL calculate the total balance as the sum of all transaction amounts
3. WHEN the User adds a transaction, THE Application SHALL update the total balance immediately
4. WHEN the User deletes a transaction, THE Application SHALL update the total balance immediately
5. WHEN no transactions exist, THE Application SHALL display a balance of zero

### Requirement 5: Spending Distribution Chart

**User Story:** As a User, I want to see a pie chart of my spending by category, so that I can visualize where my money goes.

#### Acceptance Criteria

1. THE Application SHALL display a pie chart showing spending distribution by category
2. THE Application SHALL calculate spending per category as the sum of all transaction amounts in that category
3. WHEN the User adds a transaction, THE Application SHALL update the chart immediately
4. WHEN the User deletes a transaction, THE Application SHALL update the chart immediately
5. THE Application SHALL use a charting library (Chart.js or similar) to render the pie chart
6. WHEN no transactions exist, THE Application SHALL display an empty or placeholder chart

### Requirement 6: Data Persistence

**User Story:** As a User, I want my transactions to be saved automatically, so that I don't lose my data when I close the browser.

#### Acceptance Criteria

1. WHEN the Application starts, THE Application SHALL load all transactions from Local_Storage
2. WHEN the User adds a transaction, THE Application SHALL save it to Local_Storage immediately
3. WHEN the User deletes a transaction, THE Application SHALL update Local_Storage immediately
4. THE Application SHALL serialize transaction data to JSON format before storing
5. IF Local_Storage is unavailable, THEN THE Application SHALL display an error message

### Requirement 7: Browser Compatibility

**User Story:** As a User, I want the application to work in modern browsers, so that I can access it on any device.

#### Acceptance Criteria

1. THE Application SHALL function correctly in Chrome version 90 or later
2. THE Application SHALL function correctly in Firefox version 88 or later
3. THE Application SHALL function correctly in Edge version 90 or later
4. THE Application SHALL function correctly in Safari version 14 or later
5. THE Application SHALL use only standard Web APIs supported by all target browsers

### Requirement 8: File Structure

**User Story:** As a Developer, I want a simple file structure, so that the codebase is easy to understand and maintain.

#### Acceptance Criteria

1. THE Application SHALL contain exactly one CSS file located in the css directory
2. THE Application SHALL contain exactly one JavaScript file located in the js directory
3. THE Application SHALL contain an HTML file in the root directory
4. THE Application SHALL organize code with clear separation of concerns (structure, style, behavior)

### Requirement 9: Custom Categories

**User Story:** As a User, I want to create and manage custom categories, so that I can organize my transactions according to my personal spending patterns.

#### Acceptance Criteria

1. THE Application SHALL allow the User to add custom categories in addition to the Default_Categories
2. WHEN the User creates a Custom_Category, THE Application SHALL save it to Local_Storage
3. THE Application SHALL display both Default_Categories and Custom_Categories in the category dropdown
4. THE Application SHALL provide a category management interface where the User can view all categories
5. WHEN the User deletes a Custom_Category, THE Application SHALL remove it from Local_Storage
6. THE Application SHALL prevent deletion of Default_Categories (Food, Transport, Fun)
7. IF the User attempts to create a Custom_Category with a name that already exists, THEN THE Application SHALL display an error message
8. WHEN the User deletes a Custom_Category that has associated transactions, THE Application SHALL reassign those transactions to a default category or prompt the User for action

### Requirement 10: Transaction Sorting

**User Story:** As a User, I want to sort my transactions by amount or category, so that I can analyze my spending patterns more easily.

#### Acceptance Criteria

1. THE Application SHALL provide a sorting control for the transaction list
2. WHEN the User selects sort by amount ascending, THE Application SHALL display transactions ordered from lowest to highest amount
3. WHEN the User selects sort by amount descending, THE Application SHALL display transactions ordered from highest to lowest amount
4. WHEN the User selects sort by category, THE Application SHALL display transactions ordered alphabetically by category name
5. THE Application SHALL update the transaction list display immediately when sorting is applied
6. THE Application SHALL maintain the current sort order when new transactions are added
7. THE Application SHALL provide a visual indicator showing the current sort order

### Requirement 11: Dark and Light Mode Toggle

**User Story:** As a User, I want to switch between dark mode and light mode, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Application SHALL provide a toggle control for switching between Dark_Mode and Light_Mode
2. WHEN the User activates Dark_Mode, THE Application SHALL apply a dark color scheme to all UI elements
3. WHEN the User activates Light_Mode, THE Application SHALL apply a light color scheme to all UI elements
4. WHEN the User changes the Theme, THE Application SHALL save the preference to Local_Storage
5. WHEN the Application starts, THE Application SHALL load the saved Theme preference from Local_Storage
6. IF no Theme preference exists in Local_Storage, THEN THE Application SHALL default to Light_Mode
7. THE Application SHALL ensure sufficient contrast in both themes for accessibility
8. THE Application SHALL position the theme toggle control in a prominent and easily accessible location

---

## Review Notes

This requirements document defines an Expense Tracker application with core functionality and enhanced user experience features:

**Core MVP Features:**

- Input form with three fields (Item Name, Amount, Category)
- Default categories (Food, Transport, Fun)
- Scrollable transaction list with delete capability
- Total balance display that updates automatically
- Pie chart visualization of spending by category
- Local Storage persistence
- Simple file structure (1 HTML, 1 CSS, 1 JS)

**Enhanced Features:**

- Custom category management (add/delete user-defined categories)
- Transaction sorting (by amount ascending/descending, by category alphabetically)
- Dark/Light mode toggle with persistence

The requirements follow EARS patterns and INCOSE quality rules, ensuring they are clear, testable, and complete. All features maintain the simplicity of the client-side architecture while providing users with greater flexibility and personalization options.

Please review these updated requirements and let me know if you'd like any modifications.
