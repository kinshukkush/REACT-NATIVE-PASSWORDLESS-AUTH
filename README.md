# Passwordless Authentication Flow

A React Native mobile application implementing passwordless authentication using Email + OTP with session tracking.

[![React Native](https://img.shields.io/badge/React%20Native-0.74.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~51.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.3.3-blue.svg)](https://www.typescriptlang.org/)

## 📱 Features

- ✅ Email-based passwordless login
- ✅ 6-digit OTP verification (60-second expiry, 3 attempts max)
- ✅ Live session duration tracking with real-time timer
- ✅ Clean architecture with TypeScript
- ✅ AsyncStorage integration for OTP management
- ✅ Expo framework for cross-platform support

## 🛠️ Tech Stack

- **React Native** (v0.74.5) via Expo (~51.0.0)
- **TypeScript** (~5.3.3)
- **AsyncStorage** (v1.23.1) - Local storage SDK
- **React Hooks** (useState, useEffect, useMemo, useRef)

---

## 📦 Download & Install APK

### Option 1: Direct APK Download (Fastest)

**Download the pre-built Android APK:**

👉 **[Download APK Here](https://expo.dev/accounts/kinshuk_saxena/projects/passwordless-auth-flow/builds/31a3b876-a573-422b-9004-b6f65a32c486)**

**Installation Steps:**
1. Download APK on your Android device
2. Go to Settings → Security → Enable "Install from unknown sources"
3. Open the downloaded APK file
4. Tap "Install" and launch the app

---

## 🚀 Run from Source Code

### Prerequisites

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** installed
- **Expo Go app** (for mobile testing) - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)

---

### Option 2: Clone & Run (Development)

#### Step 1: Clone Repository
```bash
git clone https://github.com/kinshukkush/REACT-NATIVE-PASSWORDLESS-AUTH.git
cd REACT-NATIVE-PASSWORDLESS-AUTH
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm start
```

Once started, you'll see a QR code and menu options:

---

### Option 3: Run on Android Phone (USB)

**Requirements:**
- Android phone with USB cable
- USB Debugging enabled on phone

**Steps:**

1. **Enable USB Debugging on Phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to unlock Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect Phone via USB:**
   ```bash
   # Verify device is connected
   adb devices
   ```

3. **Install and Run:**
   ```bash
   npm install
   npm run android
   ```

The app will automatically install and launch on your phone!

---

### Option 4: Run on Expo Go (WiFi)

**Requirements:**
- Phone and computer on the **same WiFi network**
- Expo Go app installed on phone

**Steps:**

1. **Start Expo Server:**
   ```bash
   npm start
   ```

2. **Scan QR Code:**
   - **Android**: Open Expo Go app → Scan QR code
   - **iOS**: Open Camera app → Scan QR code

The app will load directly on your phone!

---

### Option 5: Run on Android Studio Emulator

**Requirements:**
- Android Studio installed
- Android emulator configured

**Steps:**

1. **Start Android Emulator** from Android Studio

2. **Install and Run:**
   ```bash
   npm install
   npm run android
   ```

The app will launch in the emulator!

---

### Option 6: Run on Web Browser

```bash
npm install
npm start
# Press 'w' when prompted
```

Or directly:
```bash
npm run web
```

Opens at `http://localhost:8081`

---

## 🎯 How to Use

### Login Flow

1. **Enter Email** → Tap "Send OTP"
2. **View OTP** → Check the alert popup (development mode)
3. **Enter OTP** → Type the 6-digit code
4. **Session Screen** → View live session timer
5. **Logout** → Tap logout button

### OTP Rules

- ⏱️ **Expiry**: 60 seconds
- 🔢 **Length**: 6 digits
- 🚫 **Max Attempts**: 3 per email
- 🔄 **Resend**: Invalidates old OTP and resets attempts
- 📧 **Per Email**: Each email has isolated OTP state

---

## 📁 Project Structure

```
passwordless-auth-flow/
├── src/
│   ├── screens/              # UI Screens
│   │   ├── LoginScreen.tsx   # Email input
│   │   ├── OtpScreen.tsx     # OTP verification
│   │   └── SessionScreen.tsx # Active session
│   ├── hooks/                # Custom Hooks
│   │   └── useSessionTimer.ts
│   ├── services/             # Business Logic
│   │   ├── otpManager.ts     # OTP generation & validation
│   │   └── analytics.ts      # Event logging
│   └── types/                # TypeScript Types
│       └── auth.ts
├── App.tsx                   # Main entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🧪 Testing

### Manual Test Cases

1. ✅ **Happy Path**: Email → OTP → Session → Logout
2. ⏰ **Expired OTP**: Wait 60+ seconds before verification
3. ❌ **Wrong OTP**: Enter incorrect OTP 3 times
4. 🔄 **Resend OTP**: Request new OTP after expiry
5. 📱 **Background/Foreground**: Timer continues accurately when app is backgrounded

---

## 🎨 Technical Highlights

### Architecture
- **Clean Separation**: UI, Business Logic, and Side Effects
- **No Global Variables**: Pure React hooks and service functions
- **Memory Safe**: Proper cleanup in useEffect hooks
- **Type Safe**: Full TypeScript with strict mode

### Key Implementations
- **Timestamp-based Timer**: Works correctly even when app is backgrounded
- **Per-Email OTP Storage**: O(1) lookup with complete metadata
- **Proper Hook Usage**: useState, useEffect, useMemo, useRef with correct dependencies
- **AsyncStorage SDK**: Initialized and integrated for local storage and event logging

---

## 📧 Contact

- **Name**: Kinshuk Saxena
- **Email**: [kinshuksaxena3@gmail.com](mailto:kinshuksaxena3@gmail.com)
- **Phone**: +91 9057538521
- **LinkedIn**: [linkedin.com/in/Kinshuk-Saxena-](https://www.linkedin.com/in/kinshuk-saxena-)
- **GitHub**: [github.com/Kinshukkush](https://github.com/Kinshukkush)
- **Portfolio**: [kinshuksaxena.vercel.app](https://portfolio-frontend-mu-snowy.vercel.app/)

---

## 📝 Assignment Compliance

✅ All functional requirements implemented  
✅ React Native with Expo & TypeScript  
✅ Functional components only  
✅ Proper hooks usage (useState, useEffect, useMemo, useRef)  
✅ External SDK integration (AsyncStorage)  
✅ Event logging (OTP generated, validated, logout)  
✅ Clean architecture with separation of concerns  
✅ Edge cases handled (expiry, wrong OTP, max attempts)  
✅ Session timer persists across re-renders and app backgrounding  
✅ No comments in code files  

---

## 📄 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ by Kinshuk Saxena using React Native, TypeScript, and Expo**
