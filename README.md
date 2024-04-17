# E - Parking Solution

### App Screens:

<details>
<summary>Authentication</summary>
  <img src="Frontend/docs/app-screens/authentication/welcome.png" alt="welcome" width="100"/>
  <img src="Frontend/docs/app-screens/authentication/signup-screen.png"
  alt="sign-up" width="100"/>
  <img src="Frontend/docs/app-screens/authentication/signin-screen.png" alt="sign-in" width="100"/>
  <img src="Frontend/docs/app-screens/authentication/resetPassword.png" alt="resetPassword" width="100"/>
</details>
<details>
<summary>Onboarding</summary>
  <img src="Frontend/docs/app-screens/onBoarding/welcome-to-e-parky.png" alt="Onboarding screen 1" width="100"/>
  <img src="Frontend/docs/app-screens/onBoarding/welcome-screen-2.png" alt="Onboarding screen 2" width="100"/>
  <img src="Frontend/docs/app-screens/onBoarding/welcome-screen-3.png" alt="Onboarding screen 3" width="100"/>
  <img src="Frontend/docs/app-screens/onBoarding/welcome-screen-4.png" alt="Onboarding screen 4" width="100"/>
  <img src="Frontend/docs/app-screens/onBoarding/welcome-with-sign-in.png" alt="Onboarding screen 3" width="100"/>
</details>
<details>
<summary>Map</summary>
  <img src="Frontend/docs/app-screens/map/MapV1.png" alt="Map V1" width="100"/>
  <img src="Frontend/docs/app-screens/map/MapV2.png" alt="Map V2" width="100"/>
</details>
<details>
<summary>Parking Details</summary>
  <img src="Frontend/docs/app-screens/parkingDetails/parkingDetails.png" alt="Parking Details" width="100"/>
  <img src="Frontend/docs/app-screens/parkingDetails/parkingDetailsV2.png" alt="Parking Details V2" width="100"/>
</details>
<details>
<summary>Booking Details</summary>
  <img src="Frontend/docs/app-screens/bookingDetails/bookingDetailsV1.png" alt="Booking Details" width="100"/>
  <img src="Frontend/docs/app-screens/bookingDetails/bookingDetailsV2.png" alt="Booking Details V2" width="100"/>
</details>
<details>
<summary>Parking Slots</summary>
  <img src="Frontend/docs/app-screens/parkingSlots/slotsV1.png" alt="Parking Slots" width="100"/>
</details>
<details>
<summary>Vehicle Select</summary>
  <img src="Frontend/docs/app-screens/vehicle/VehicleSelectV1.png" alt="Vehicle Select" width="100"/>
  <img src="Frontend/docs/app-screens/vehicle/vehicleSelectV2.png" alt="Vehicle Select V2" width="100"/>
  <img src="Frontend/docs/app-screens/vehicle/addVehicle.png" alt="Vehicle Select V3" width="100"/>
</details>
<details>
<summary>Profile</summary>
  <img src="Frontend/docs/app-screens/profile/Profile.png" alt="Profile" width="100"/>
  <img src="Frontend/docs/app-screens/profile/ProfileV2.png" alt="Profile V2" width="100"/>
</details>
<details>
<summary>Booking Confirmation</summary>
  <img src="Frontend/docs/app-screens/bookingConfirmation/bookingConfirmation.png" alt="Booking Confirmation" width="100"/>
  <img src="Frontend/docs/app-screens/bookingConfirmation/bookingSuccess.png" alt="Booking Confirmation V2" width="100"/>
  <img src="Frontend/docs/app-screens/bookingConfirmation/ParkingTicket.png" alt="Booking Confirmation V3" width="100"/>
</details>
<details>
<summary>Payment</summary>
  <img src="Frontend/docs/app-screens/payment/paymentStripe.png" alt="Payment" width="100"/>
</details>
<details>
<summary>Parking Session</summary>
  <img src="Frontend/docs/app-screens/parkingSession/Parking.png" alt="Parking Session" width="100"/>
  <img src="Frontend/docs/app-screens/parkingSession/ParkingV2.png" alt="Parking Session V3" width="100"/>
  <img src="Frontend/docs/app-screens/parkingSession/parkingHistory.png" alt="Parking Session V2" width="100"/>
  <img src="Frontend/docs/app-screens/parkingSession/ViewTicket.png" alt="Parking Session V4" width="100"/>
  <img src="Frontend/docs/app-screens/parkingSession/Timer.png" alt="Parking Session V5" width="100"/>
</details>

## Information about this repository

This is the repository that you are going to use **individually** for developing your project. Please use the resources provided in the module to learn about **plagiarism** and how plagiarism awareness can foster your learning.

Regarding the use of this repository, once a feature (or part of it) is developed and **working** or parts of your system are integrated and **working**, define a commit and push it to the remote repository. You may find yourself making a commit after a productive hour of work (or even after 20 minutes!), for example. Choose commit message wisely and be concise.

Please choose the structure of the contents of this repository that suits the needs of your project but do indicate in this file where the main software artefacts are located.

# How to run the project

### Setting up a firebase project

1. Create a firebase project
2. Enable Firestore,
3. Enable Authentication
4. Enable Functions
5. Enable Hosting
6. Enable Storage
7. Create a service account and download the json file
8. Add the json file to the functions folder

### Setting up Server

1. firebase cli
2. clone repo
3. Add env variables to functions/.env
4. `cd functions`
5. run `npm install`
6. run firebase deploy

### Setting up react Native App

1. Clone repo
2. Add env variables to the root of the project
3. run `npm install`
4. Download google-services.json from firebase and add it to the android/app folder
5. Download the GoogleService-Info.plist from firebase and add it to the ios folder
6. run

### Setting up FireCMS App

### Setting up User Accounts

#### Super User

An admin needs to created serving as a superuser. They would manage all parking Owners

This can be done using the post man collection with the body

    {
    "name":"Jedidiah Awuku",
    "role":"admin",
    "email": "jeddiahawuku12@gmail.com",
    "password": "password123?",
    "phoneNumber": "0774839242",
    "adminKey": "parkAdminSecretKey123"
    }

#### Parking Owner

Parking Owners are created via the website(this is hosted using firebase hosting):
Website Link: `https://e-parking-app-b22cb.web.app/`

#### Driver

Drivers are created through the react native app

Setting up Dynamic Templates through sendGrid

### Setting up SendGrid for Email Notifications

Need an API key from sendGrid

Create a dynamic template for:

1.  New parking Owner
2.  User verification
3.  Parking owner approval/rejection
4.  ParkingLot Approval/Rejection

### Setting up Stripe for Payment Integration
