# Implementation Plan: Expense & Budget Visualizer

## Overview

This plan implements a client-side expense tracker using vanilla JavaScript, HTML, and CSS. The implementation follows a phased approach: structure and styling first, then core data management, form handling, transaction list with deletion, balance calculation, and finally Chart.js integration for visualization. All data persists in Local Storage.

## Tasks

- [x] 1. Create HTML structure and CSS styling
  - Create index.html with semantic markup for form, transaction list, balance display, and chart container
  - Create css/styles.css with responsive layout using Flexbox/Grid
  - Include Chart.js CDN link in HTML
  - Set up form with Item Name input, Amount input, and Category dropdown (Food, Transport, Fun)
  - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3_

- [x] 2. Implement Storage Module and Transaction Model
  - [x] 2.1 Create js/app.js with Storage Module section
    - Implement loadTransactions() to read from Local Storage
    - Implement saveTransactions() to write to Local Storage
    - Implement isStorageAvailable() to check Local Storage availability
    - Handle JSON serialization/deserialization
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]\* 2.2 Write property test for persistence round-trip
    - **Property 5: Transaction persistence round-trip**
    - **Validates: Requirements 1.4, 6.2, 6.4**
  - [x] 2.3 Create Transaction Model section
    - Define Transaction class with id, itemName, amount, category
    - Generate unique IDs using timestamp + random string
    - Implement validateTransactionInput() for form validation
    - Implement calculateTotal() for balance calculation
    - Implement calculateCategoryTotals() for chart data
    - _Requirements: 1.6, 4.2, 5.2_
  - [ ]\* 2.4 Write property tests for transaction validation
    - **Property 1: Empty field validation**
    - **Validates: Requirements 1.5**
    - **Property 2: Positive amount validation**
    - **Validates: Requirements 1.6**

- [ ] 3. Implement Form Handling and Validation
  - [x] 3.1 Create UI Module section with form handling
    - Implement handleFormSubmit() to process form submissions
    - Validate all fields are non-empty using validateTransactionInput()
    - Validate amount is positive number
    - Display error messages using showError()
    - Create transaction object and add to transactions array
    - Save to Local Storage after adding
    - Implement clearForm() to reset form fields
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_
  - [ ]\* 3.2 Write property test for form clearing
    - **Property 3: Form clearing after submission**
    - **Validates: Requirements 1.7**
  - [ ]\* 3.3 Write unit tests for form validation
    - Test empty field rejection
    - Test negative amount rejection
    - Test zero amount rejection
    - Test non-numeric amount rejection
    - _Requirements: 1.5, 1.6_

- [ ] 4. Checkpoint - Ensure form validation works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Transaction List Display and Deletion
  - [x] 5.1 Create transaction list rendering
    - Implement renderTransactions() to display all transactions
    - Display itemName, amount, and category for each transaction
    - Add delete button for each transaction
    - Use event delegation for delete button clicks
    - Maintain display order matching addition order
    - _Requirements: 2.1, 2.2, 2.5, 3.1_
  - [x] 5.2 Implement transaction deletion
    - Implement handleDelete() to remove transaction by ID
    - Remove from transactions array
    - Update Local Storage
    - Re-render transaction list
    - _Requirements: 3.2, 3.3, 2.4_
  - [ ]\* 5.3 Write property tests for transaction list
    - **Property 4: Transaction addition to list**
    - **Validates: Requirements 1.3, 2.3**
    - **Property 6: Transaction display completeness**
    - **Validates: Requirements 2.2**
    - **Property 7: Transaction list ordering**
    - **Validates: Requirements 2.5**
    - **Property 8: Delete button presence**
    - **Validates: Requirements 3.1**
  - [ ]\* 5.4 Write property tests for deletion
    - **Property 9: Transaction deletion from list**
    - **Validates: Requirements 3.2, 2.4**
    - **Property 10: Transaction deletion from storage**
    - **Validates: Requirements 3.3, 6.3**

- [x] 6. Implement Balance Display
  - [x] 6.1 Create balance calculation and display
    - Implement updateBalance() to display total
    - Calculate total using calculateTotal()
    - Update balance on transaction addition
    - Update balance on transaction deletion
    - Display zero when no transactions exist
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]\* 6.2 Write property tests for balance
    - **Property 11: Balance calculation correctness**
    - **Validates: Requirements 4.2**
    - **Property 12: Balance update on addition**
    - **Validates: Requirements 4.3**
    - **Property 13: Balance update on deletion**
    - **Validates: Requirements 3.4, 4.4**

- [x] 7. Implement Chart.js Pie Chart
  - [x] 7.1 Create Chart Module section
    - Implement initChart() to create Chart.js pie chart instance
    - Implement updateChart() to refresh chart with category totals
    - Use calculateCategoryTotals() for data aggregation
    - Configure chart with category colors and labels
    - Handle empty state with placeholder or empty chart
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 7.2 Integrate chart updates with transaction operations
    - Call updateChart() after adding transaction
    - Call updateChart() after deleting transaction
    - _Requirements: 5.3, 5.4, 3.5_
  - [ ]\* 7.3 Write property tests for chart updates
    - **Property 14: Category totals calculation**
    - **Validates: Requirements 5.2**
    - **Property 15: Chart update on addition**
    - **Validates: Requirements 5.3**
    - **Property 16: Chart update on deletion**
    - **Validates: Requirements 3.5, 5.4**
  - [ ]\* 7.4 Write unit tests for chart error handling
    - Test Chart.js load failure fallback
    - Test chart rendering error handling
    - _Requirements: 5.5_

- [ ] 8. Implement Application Initialization
  - [ ] 8.1 Create init() function
    - Check Local Storage availability using isStorageAvailable()
    - Load transactions from Local Storage
    - Initialize Chart.js instance
    - Render initial transaction list
    - Update initial balance display
    - Update initial chart
    - Attach form submit event listener
    - Display error if Local Storage unavailable
    - _Requirements: 6.1, 6.5_
  - [ ]\* 8.2 Write property test for startup loading
    - **Property 17: Transaction loading on startup**
    - **Validates: Requirements 6.1**
  - [ ]\* 8.3 Write unit tests for initialization
    - Test initialization with empty storage
    - Test initialization with existing transactions
    - Test initialization with corrupted storage data
    - Test initialization with unavailable storage
    - _Requirements: 6.1, 6.5_

- [ ] 9. Final checkpoint and browser compatibility verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify application works in Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All modules are organized within a single js/app.js file with clear comment boundaries
- Chart.js will be loaded via CDN for simplicity
- The implementation follows the phased approach outlined in the design document
