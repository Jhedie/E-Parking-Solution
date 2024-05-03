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

The environment setup is divided into three main parts: setting up the server, setting up the React Native frontend, and setting up the FireCMS app.

The environment variables for the server are stored in a `.env` file in the `server/functions` directory.
The environment variables for the React Native frontend are stored in a `.env` file in the `Frontend` directory.
The environment variables for the FireCMS app are stored in a `.env` file in the `admin` directory.

### Setting up the Server

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```
2. **Clone the repository:**

   ```bash
   git clone [REPOSITORY_URL]

   cd jea22
   ```

3. **Install dependencies and deploy to Firebase:**

   ```bash
   cd server/functions

   npm install

   firebase deploy
   ```

### Setting up the React Native Frontend

1. **Navigate to the mobile directory:**

   ```bash
   cd jea22/Frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the app in the simulator:**
   Install the provided iOS build.
   ```bash
   npx expo start --dev-client
   ```

### Setting up FireCMS App

1. **Navigate to the FireCMS directory and install dependencies:**

   ```bash
   cd jea22/admin
   yarn install
   ```

2. **Run the FireCMS app:**

   ```bash
   yarn dev
   ```

3. **Access the FireCMS panel:**
   Open your browser and navigate to the URL provided in the terminal after running the start command.

### User Roles and Credentials

For test purposes, the following user roles and credentials are provided:

- **Admin Credentials:**
  - **Email:** jeddiahawuku12@gmail.com
  - **Password:** password123?
- **Parking Owner:** jedidiahawuku12@gmail.com
  - **Password:** password123?
- **Driver:** jedidiahawuku12@yahoo.com
  - **Password:** password123?

## Conclusion

This README provides all the necessary steps to successfully set up and run the E-Parking solution. Ensure all environment variables and Firebase configurations are correctly set up for smooth operations.
