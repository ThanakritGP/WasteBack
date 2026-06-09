# 🍃 WasteBack

**WasteBack** is a gamified, mobile-first web application designed to promote environmental sustainability and urban biodiversity awareness within **Lumphini Park, Bangkok**. By combining smart waste management tracking with educational wildlife mapping, the app turns park visitors into active eco-warriors.

---

## 1. Core Objectives
* **Encourage Smart Recycling**: Gamify the act of recycling by letting users scan smart bins, earn points, and redeem green rewards.
* **Urban Biodiversity Awareness**: Educate visitors about the local wildlife species living inside Lumphini Park through an interactive map.
* **Carbon Tracking**: Provide users with tangible feedback on their positive environmental impact (items recycled and $CO_2$ saved).

---

## 2. Key Features

### 🔐 Interactive Authentication Gate
* **Dual Access Modes**: Support for registered users and guest visitors.
* **UX Micro-animations**: Simulated loading state indicators on buttons, smooth text-input focus animations, and a premium custom transition that shrinks and fades out the login screen upon successful authorization.

### 🗺️ Dynamic Map Page (Google Maps Engine)
* **Google Maps Layering**: Renders standard Google Maps styles using Leaflet for smooth performance.
* **Map Filters Overlay**: A floating glassmorphic filter bar allowing users to toggle the visibility of **Smart Bins** and **Wildlife Animals** independently.
* **Smart Bin Indicators**: Displays interactive pin drops showing path locations and real-time container capacity (e.g., *Gate 1 Bin: 40% Full*).
* **Wildlife Species Encyclopedia**: Displays markers for park wildlife (Asian Water Monitors, Red-eared Slider Turtles, Pigeons, Cats) with detail popups featuring scientific names, diet, and localized Thai translations.

### 📷 Live Camera QR Scanner
* **Real-time Camera Streaming**: Utilizes the browser's HTML5 camera API (`navigator.mediaDevices.getUserMedia`) to request permission and stream live video inside a rounded, responsive viewfinder.
* **Intelligent Camera Lifecycle**: The app automatically requests and activates the camera when navigating to the Scan page, and immediately shuts down the stream when leaving to conserve battery and protect user privacy.
* **Interactive Scanner Simulation**: Allows scanning QR codes on smart bins to unlock them and reward the user with $+10$ green points.

### 🎁 Gamified Rewards Catalog
* **Points Balance Tracker**: Real-time updates of current points.
* **Green Incentives**: A list of redeemable rewards (e.g., BTS transit discounts, reusable tote bags, free cafe drinks) utilizing validation checks to prevent users from purchasing rewards without sufficient points.

### 📊 Eco-Warrior Dashboard (User Profile)
* **Impact Metrics**: Visually tracks user accomplishments, specifically **total items recycled** and **kilograms of $CO_2$ offset**.
* **Eco-Warrior Leveling**: Displays progress and titles depending on active contribution.

---

## 3. Technology Stack

* **Structure & Markup**: HTML5 (Semantic structure, standard navigation grid).
* **Styling & Transitions**: Vanilla CSS3 (Custom variables, absolute overlay maps, `@keyframes` page fade-in/scale-out transitions, interactive feedback states).
* **Core Logic**: Vanilla JavaScript (ES6+, state management, asynchronous camera media controls).
* **Map Rendering Engine**: Leaflet.js linked with Google Maps tile systems.
* **Interactive Dialogs**: SweetAlert2 (Toast notifications and custom modals).
* **Typography**: Google Fonts
  * **Poppins** (Modern Latin font stack)
  * **Noto Sans Thai** (Polished Thai character stack with weights $100$ to $900$)
* **Iconography**: Google Material Symbols Outlined (Clean, minimalistic system icons).

---

## 4. File Architecture

The project is organized into clean, modular components:
* `index.html`: Defines the mobile layout shell, headers, and individual page containers.
* `style.css`: Houses the core layout styles, modern glassmorphic styles, and layout transitions.
* `script.js`: Governs Leaflet map initializations, point calculations, page navigations, and live camera media streams.
