# Presentation Outline

## Slide 0: Title Slide

- **Title:** E-Parking Solution
- **Subtitle:** A User-Friendly and Efficient Parking Software
- **Name:** Jedidiah Awuku
- **Date:** 27th February 2024

## Slide 1: Introduction

- **Title:** Presentation Overview
- **Content:**
  - Project Overview
  - The Challenge of Urban Parking
  - Cost of Inefficiency
  - Pain Points for Parking Space Owners
  - Towards a Solution
  - Project Purpose and Aims
  - Technical Architecture
  - Progress So Far
  - Live Demo
  - Next Steps
  - Q&A

## Slide 2: The Challenge of Urban Parking

- **Title:** Urbanization and Car Usage
- **Content:**
  - Increased urbanization and prevalence of car usage as a commuting method.
  - Statistics on car usage in Great Britain.

## Slide 3: The Cost of Inefficiency

- **Title:** Inefficiency and Sustainability Issues
- **Content:**
  - The impact of parking inefficiency on congestion and pollution.
  - The environmental cost due to increased CO2 emissions from searching for parking.
  - The human cost: stress, frustration, impatience, and risky driving behaviors.

## Slide 4: Pain Points for Parking Space Owners

- **Title:** Challenges for Parking Space Owners
- **Content:**
  - Operational inefficiencies caused by outdated payment systems.
  - The financial and emotional impact of overpayment or penalties on users and owners.

## Slide 5: Towards a Solution

- **Title:** Need for an Efficient Parking Solution
- **Content:**
  - The importance of maximizing space utilization and streamlining payment processes.
  - The role of real-time data in transforming parking into a seamless experience.
  - The broader goal of contributing to sustainability and operational efficiency.

## Slide 6: Project Purpose and Aims

- **Title:** Project Purpose and Aims
- **Content:**
  - The project's main goal: to build an efficient, user-friendly, and reliable parking system for drivers an parking owners.
  - The approach: exploring system architectures, design patterns, and technological resources.

## Slide 7: Requirements

Core Functionality:

- drivers

  - Find/search parking slot and location
  - Secure parking slot and manage bookings (pay, cancel, extend, view history)
  - View parking sessions, availability, bookings, barcodes for entry and exit

- parking owners
  - Manage users and their sessions (add, remove, update)
  - Manage parking slots (add, remove, update)
  - View parking history, location, availability, bookings, basic statistics like revenue

- Admin
  - Parking owner management (approve, remove, update)
  - User management (approve, remove, update)

Additional:
- Voice Control
  - Integrate a voice assistant feature for hands-free control.
  - Allow users to perform actions such as finding parking lots, reserving spaces, and navigating the app using voice commands
  - The voice assistant should provide auditory feedback to confirm actions and provide requested information.
- Parking Analytics
  - Provide a summary of parking lots with useful analytics such as peak usage times, average duration of parking, and revenue generated.
  - Live user support: Implement a comprehensive help and support chat system for users.

## State of the Art

- **Title:** State of the Art
- **Content:**
  - Overview of existing parking solutions and their limitations.
  - The need for a more user-friendly and efficient parking system.

## Slide 7: Technical Architecture

- **Title:** Under the Hood
- **Content:**

  - Overview of the tech stack and integrated APIs or services.
  - React Native for the mobile app
  - Firebase as the BaaS for user authentication and data storage and real-time updates
  - Node.js and Express for the backend serving as the intermediary between the app and firebase services

## Slide 8: Progress So Far

- **Title:** The Journey So Far
- **Content:**
  - Overview of key features developed and tested:
    - User authentication and profile management
    - Securing a parking slot and making a payment
    - So far I have implemented the front end of the app and I have now started working on the backend.
    - Why did I approach the project this way?
      - I wanted to get an idea of the user experience, what I would required on the frontend before achieving dynamic data updates

## Slide 9: Live Demo

- **Title:** Seeing Is Believing - Live Demo
- **Preparation:**
  - Plan key features to showcase in a concise and engaging manner.

## Slide 10: Next Steps

- **Title:** Roadmap Ahead
- **Content:**
  - Outline of future plans for feature development and testing.
  - Handle edge cases within the app use:
    - User authentication and security
    - Real-time data updates
    - Payment processing
    - Cancelation and refund policies
    - Two users trying to book the same spot at the same time

## Slide 11: Q&A

- **Title:** Your Thoughts?
- **Content:**
  - Invitation for questions from the audience.

parking owners have a parking sections that are bookable and not bookable
parking owners can set this up from their side

things not within my control

how to handle when a user enters
