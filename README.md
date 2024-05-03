# E-Parking Solution Setup Guide

## Introduction

Welcome to the **E-parking solution**, a cloud-based system designed to improve parking management efficiency. Traditional parking inefficiencies—like excessive search times, traffic congestion, and environmental impact—are tackled with real-time updates, online reservations, automated payments, and dynamic slot allocation. The system uses Firebase and a React-based FireCMS for administration, while drivers interact through a React Native mobile application with backend support from Express JS. This setup guide will cover everything needed to get the system up and running.

## Requirements

- Node.js (LTS version)
- Firebase CLI
- Git
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Simulator for iOS or Android for testing purposes

## Installation

### Setting up the Server

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```
2. **Clone the repository:**
   ```bash
   git clone [REPOSITORY_URL]
   ```
3. **Navigate to the functions directory and set up environment variables:**
   Create a `.env` file in the `functions` directory and populate it with the necessary environment variables as specified in the repository documentation.

4. **Install dependencies and deploy to Firebase:**
   ```bash
   npm install
   firebase deploy
   ```

### Setting up the React Native Frontend

1. **Set up environment variables:**
   Add the necessary environment variables at the root of the project as specified in the repository documentation.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Firebase configuration files:**

   - **Android:** Download `google-services.json` from Firebase and place it in the `android/app` directory.
   - **iOS:** Download `GoogleService-Info.plist` from Firebase and place it in the `ios` directory.

4. **Run the app in the simulator:**
   Download the latest build for the simulator from `application-2ad6b8cd-bdec-42a4-8f22-274bf746dfa3.ipa` and install it.
   - **Android:**
     ```bash
     npx expo run:android
     ```
   - **iOS:**
     ```bash
     npx expo run:ios
     ```

### Setting up FireCMS App

1. **Navigate to the FireCMS directory and install dependencies:**

   ```bash
   cd [REPO_NAME]/firecms
   yarn install
   ```

2. **Run the FireCMS app:**

   ```bash
   yarn dev
   ```

3. **Access the FireCMS panel:**
   Open your browser and navigate to the URL provided in the terminal after running the start command.

### User Roles and Credentials

- **Admin:** Set up admin credentials in Firebase Authentication and Firestore with appropriate roles.
- **Super User:** Similar setup as admin but with fewer privileges.
- **Parking Owner:** Ensure they have permissions to manage their parking lots.
- **Driver:** Basic user role that allows booking and managing reservations.

## Conclusion

This README provides all the necessary steps to successfully set up and run the E-Parking solution. Ensure all environment variables and Firebase configurations are correctly set up for smooth operations.
