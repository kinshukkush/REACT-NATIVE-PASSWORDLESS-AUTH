# Passwordless Authentication Flow

A React Native mobile application implementing passwordless authentication using Email + OTP with session tracking.

## 📱 Features

- ✅ Email-based login
- ✅ 6-digit OTP verification (60-second expiry, 3 attempts max)
- ✅ Live session duration tracking
- ✅ Clean architecture with TypeScript
- ✅ AsyncStorage integration for OTP management
- ✅ Expo framework for cross-platform support

## 🛠️ Tech Stack

- **React Native** (v0.74.5) via Expo (~51.0.0)
- **TypeScript** (~5.3.3)
- **AsyncStorage** (v1.23.1)
- **React Hooks** (useState, useEffect, useMemo, useRef)

## 📦 APK Download

You can download and install the Android APK directly:

👉 **[Download APK](YOUR_EXPO_BUILD_LINK_HERE)**

**Steps:**
1. Download APK on your Android device
2. Enable "Install from unknown sources" in settings
3. Install and launch the app

*Built using Expo EAS (cloud build)*

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** installed
- **Expo Go app** (for mobile testing) - [Download](https://expo.dev/client)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd passwordless-authentication-flow
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

### Running on Different Platforms

Once the Expo server starts, you'll see a QR code and options:

**📱 Mobile (Recommended)**
- **Android**: Press `a` OR scan QR code with Expo Go app
- **iOS**: Press `i` OR scan QR code with Camera app (macOS only)
- ⚠️ **Important**: Ensure your phone and computer are on the **same WiFi network**

**💻 Web**
- Press `w` to open in browser

**🤖 Android Studio**
```bash
npm run android
```
*Requires Android Studio with an emulator or connected device*

---

## 🎯 Usage

### Login Flow

1. **Enter Email** → Tap "Send OTP"
2. **OTP Screen** → Enter the 6-digit code (shown in alert during development)
3. **Session Screen** → View live session timer
4. **Logout** → Tap logout button to end session

### OTP Rules

- ⏱️ **Expiry**: 60 seconds
- 🔢 **Length**: 6 digits
- 🚫 **Max Attempts**: 3
- 🔄 **Resend**: Invalidates old OTP and resets attempts

---

## 📁 Project Structure

```
src/
├── screens/           # UI components
│   ├── LoginScreen.tsx
│   ├── OtpScreen.tsx
│   └── SessionScreen.tsx
├── hooks/            # Custom React hooks
│   └── useSessionTimer.ts
├── services/         # Business logic
│   ├── otpManager.ts
│   └── analytics.ts
└── types/           # TypeScript definitions
    └── auth.ts
```

---

## 🧪 Testing

### Manual Test Cases

1. ✅ **Happy Path**: Email → OTP → Session → Logout
2. ⏰ **OTP Expiry**: Wait 60+ seconds before verification
3. ❌ **Wrong OTP**: Enter incorrect OTP 3 times
4. 🔄 **Resend OTP**: Request new OTP after expiry
5. 📱 **Background/Foreground**: Timer continues accurately

---

## 🎨 Technical Highlights

### Architecture
- **Clean Separation**: UI, Business Logic, and Side Effects
- **No Global Variables**: Pure React hooks and service functions
- **Memory Safe**: Proper cleanup in useEffect
- **Type Safe**: Full TypeScript support

### Key Implementations
- **Timestamp-based Timer**: Works correctly even when app is backgrounded
- **Per-Email OTP Storage**: O(1) lookup with complete metadata
- **Proper Hook Usage**: useState, useEffect, useMemo, useRef with correct dependencies
- **AsyncStorage Integration**: SDK initialization and event logging

---

## 📧 Contact

- **Email**: kinshuksaxena3@gmail.com
- **Phone**: +91 9057538521
- **LinkedIn**: [linkedin.com/in/Kinshuk-Saxena-](https://www.linkedin.com/in/kinshuk-saxena-)
- **GitHub**: [github.com/Kinshukkush](https://github.com/Kinshukkush)
- **Portfolio**: [kinshuk saxena](https://portfolio-frontend-mu-snowy.vercel.app/)

---

## 📝 Assignment Compliance

✅ All functional requirements implemented  
✅ React Native with TypeScript  
✅ Functional components only  
✅ Proper hooks usage (useState, useEffect, useMemo, useRef)  
✅ External SDK integration (AsyncStorage)  
✅ Event logging (OTP generated, validated, logout)  
✅ Clean architecture with separation of concerns  
✅ Edge cases handled (expiry, wrong OTP, max attempts)  

---

**Built with ❤️ using React Native, TypeScript, and Expo**
