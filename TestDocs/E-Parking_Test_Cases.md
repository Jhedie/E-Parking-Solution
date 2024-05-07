# E-Parking Solution Test Cases

This document contains test cases to help guide development of the e-parking system.

## Driver Test Cases

### Test Case: Search for Parking Location

- [ ] **Step 1:** Open the e-parking app
  - **Expected Result:** The search page is displayed without errors.
- [ ] **Step 2:** Enter a specific address in the search bar and submit the search.

  - **Expected Result:** Navigates to the locations a button appears to search spaces.

- [ ] **Step 3:** Select a parking location from the list.

  - **Expected Result:** Details of the selected parking location (e.g., availability, rates, distance) are displayed.

- [ ] **Step 4:** Confirm a parking reservation at the selected location.

  - **Expected Result:** The reservation is confirmed, and a confirmation screen with details (e.g., reservation ID, QR code) is displayed.

- [ ] **Step 5:** Navigate to the onboarding screen after installation.

  - **Expected Result:** The onboarding screens are displayed sequentially, providing information about the app's features.

- [ ] **Step 6:** Complete the onboarding process.

  - **Expected Result:** The main screen of the app is displayed after the last onboarding screen.

- [ ] **Step 7:** Attempt to extend a parking session from the parking ticket screen.

  - **Expected Result:** The extend parking screen is displayed with options to select additional time.

- [ ] **Step 8:** Submit a request to extend the parking time and confirm.

  - **Expected Result:** The extension is confirmed, and an updated parking ticket with the new time is displayed.

- [ ] **Step 9:** Use the app in offline mode to check parking availability.

  - **Expected Result:** The app displays cached data or a message indicating that it is in offline mode.

- [ ] **Step 10:** Refresh the authentication token by minimizing and then maximizing the app.

  - **Expected Result:** The app refreshes the authentication token without needing a manual login.

- [ ] **Step 11:** Cancel a parking reservation.

  - **Expected Result:** The reservation is cancelled, and a cancellation confirmation is displayed.

- [ ] **Step 12:** Check the user location functionality by allowing the app to access device location.
  - **Expected Result:** The app correctly displays the parking spots nearest to the user's current location.

### Test Case: Reserve Parking Spot

- [ ] **Step 1:** From the details page, click on the reserve spot button for a specific time and date.
  - **Expected Result:** The app prompts the user to confirm the reservation details.
- [ ] **Step 2:** Confirm the reservation details and proceed to payment.
  - **Expected Result:** The payment gateway page is displayed.
- [ ] **Step 3:** Complete the payment process.
  - **Expected Result:** A reservation confirmation is displayed along with a QR code or digital pass.

### Test Case: Extend Parking Time

- [ ] **Step 1:** Navigate to the 'My Reservations' section and select an active parking session.
  - **Expected Result:** Details of the active parking session are displayed with an option to extend the parking time.
- [ ] **Step 2:** Click on the 'Extend Time' option and select an additional duration.
  - **Expected Result:** The app prompts for additional payment corresponding to the extended time.
- [ ] **Step 3:** Complete the additional payment.
  - **Expected Result:** The parking time is successfully extended, and a new confirmation is displayed.

### Test Case: Receive Parking Expiry Notification

- [ ] **Step 1:** Wait for the parking session to approach its expiry time.
  - **Expected Result:** The app sends a notification reminding the user about the parking expiry 10 minutes before the time.
- [ ] **Step 2:** Click on the notification.
  - **Expected Result:** The app opens and displays options to either extend the parking or to navigate back to the parking spot.

## Parking Owner Test Cases

### Test Case: Create a New Parking Lot

- [ ] **Step 1:** Log in as a Parking Owner.
  - **Expected Result:** The parking owner dashboard is displayed.
- [ ] **Step 2:** Navigate to Create Parking Lot Page.
  - **Expected Result:** The form to create a new parking lot is displayed.
- [ ] **Step 3:** Enter Parking Lot Details.
  - **Expected Result:** Each field accepts and displays the input correctly.
- [ ] **Step 4:** Submit the Parking Lot Creation Form.
  - **Expected Result:** The app validates the data. If all inputs are correct, the system saves the parking lot information.
- [ ] **Step 5:** Confirm Creation.
  - **Expected Result:** The new parking lot appears in the list of available parking lots on the owner's dashboard.
- [ ] **Step 6:** Verify Parking Lot on User Interface.
  - **Expected Result:** The new parking lot is discoverable and details match those entered by the parking owner.

### Test Case: Activate and Deactivate Parking Lot

- [ ] **Step 1:** Log in as an admin.

  - **Expected Result:** The admin dashboard is displayed.

- [ ] **Step 2:** Navigate to the parking lots management page.

  - **Expected Result:** A list of parking lots is displayed, each with current status indicated (Active/Inactive).

- [ ] **Step 3:** Select a parking lot to change its status.

  - **Expected Result:** Details of the selected parking lot are displayed with options to activate or deactivate the lot.

- [ ] **Step 4:** Click on the 'Deactivate' button for an active parking lot.

  - **Expected Result:** The system prompts for confirmation of deactivation.

- [ ] **Step 5:** Confirm the deactivation.

  - **Expected Result:** The parking lot is marked as inactive, and a confirmation message is displayed.

- [ ] **Step 6:** Click on the 'Activate' button for an inactive parking lot.

  - **Expected Result:** The system prompts for confirmation of activation.

- [ ] **Step 7:** Confirm the activation.
  - **Expected Result:** The parking lot is marked as active, and a confirmation message is displayed.

### Test Case: Display Active Parking Lots on Map

- [ ] **Step 1:** Open the e-parking app.

  - **Expected Result:** The main screen of the app is displayed.

- [ ] **Step 2:** Navigate to the map view.

  - **Expected Result:** The map is displayed without errors.

- [ ] **Step 3:** Ensure the map shows parking locations.

  - **Expected Result:** Only active parking lots are visible on the map.

- [ ] **Step 4:** Verify the details of a visible parking lot.

  - **Expected Result:** Selecting a parking lot on the map displays details such as availability, rates, and distance, confirming it is active.

- [ ] **Step 5:** Check for the absence of inactive parking lots.
  - **Expected Result:** Inactive parking lots are not visible on the map, and cannot be selected or interacted with.
