# 🔑 Google OAuth Multi-Platform Setup (Web + Android + iOS)

## 🎯 Overview

Setup ini akan mengkonfigurasi Google OAuth untuk **3 platform sekaligus**:

- ✅ **Web** (React Native Web)
- ✅ **Android** (React Native Android)
- ✅ **iOS** (React Native iOS)

## 📋 Langkah 1: Google Cloud Console Setup

### 1.1 Buat Project

1. Buka https://console.cloud.google.com/
2. Klik dropdown project → "New Project"
3. Nama: `SmartParking` → Create

### 1.2 Buat 3 OAuth Credentials

**🔥 PENTING: Buat 3 credentials terpisah untuk setiap platform!**

#### A. Web Application

- **Application type**: `Web application`
- **Name**: `SmartParking Web`
- **Authorized JavaScript origins**:
  ```
  http://localhost:19006
  http://localhost:3000
  https://yourdomain.com
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:19006
  https://auth.expo.io/@your-username/smartparking
  ```
- **📋 Save Client ID** sebagai `WEB_CLIENT_ID`

#### B. Android Application

- **Application type**: `Android`
- **Name**: `SmartParking Android`
- **Package name**: `com.smartparking.app`
- **SHA-1 certificate**: (generate dulu - lihat langkah 2)
- **📋 Save Client ID** sebagai `ANDROID_CLIENT_ID`

#### C. iOS Application

- **Application type**: `iOS`
- **Name**: `SmartParking iOS`
- **Bundle ID**: `com.smartparking.app`
- **📋 Save Client ID** sebagai `IOS_CLIENT_ID`

## 📋 Langkah 2: Generate SHA-1 untuk Android

### Development SHA-1:

```bash
# Untuk development/debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Copy output SHA-1 seperti:
# SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD
```

### Production SHA-1:

```bash
# Untuk production release
keytool -list -v -keystore your-release-key.keystore -alias your-alias

# Upload SHA-1 ini juga ke Google Console
```

## 📋 Langkah 3: Update Backend Configuration

### Update `backend/.env`:

```env
# Google OAuth Configuration - Multi Platform
GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com

# Use Web Client ID for token verification
GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
```

## 📋 Langkah 4: Update Frontend Configuration

### Update `app.json`:

```json
{
  "expo": {
    "name": "SmartParking",
    "slug": "smartparking",
    "scheme": "smartparking",
    "android": {
      "package": "com.smartparking.app",
      "config": {
        "googleSignIn": {
          "apiKey": "YOUR_ANDROID_API_KEY",
          "certificateHash": "YOUR_SHA1_HASH"
        }
      }
    },
    "ios": {
      "bundleIdentifier": "com.smartparking.app",
      "config": {
        "googleSignIn": {
          "reservedClientId": "your_ios_client_id.apps.googleusercontent.com"
        }
      }
    },
    "extra": {
      "googleSignIn": {
        "webClientId": "your_web_client_id.apps.googleusercontent.com",
        "androidClientId": "your_android_client_id.apps.googleusercontent.com",
        "iosClientId": "your_ios_client_id.apps.googleusercontent.com"
      }
    },
    "plugins": [
      "expo-font",
      "expo-router",
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

## 📋 Langkah 5: Test di Setiap Platform

### A. Test Web (Paling Mudah):

```bash
npm start
# Pilih 'w' untuk web
# Buka http://localhost:19006
# Test Google login
```

### B. Test Android:

```bash
# Dengan Expo Go
npm start
# Scan QR dengan Expo Go

# Atau dengan development build
npx expo run:android
```

### C. Test iOS:

```bash
# Dengan Expo Go (iOS Simulator)
npm start
# Pilih 'i' untuk iOS simulator

# Atau dengan development build
npx expo run:ios
```

## 🔧 Platform-Specific Configuration

### Web Configuration:

- Uses `expo-auth-session` dan `expo-web-browser`
- AuthSession.makeRedirectUri() untuk redirect
- Verify dengan Web Client ID

### Android Configuration:

- Uses `@react-native-google-signin/google-signin`
- Requires SHA-1 certificate
- Package name harus match

### iOS Configuration:

- Uses `@react-native-google-signin/google-signin`
- Requires Bundle ID
- URL scheme configuration

## 🎯 Expected Results per Platform

### Web:

```
✅ Google OAuth popup
✅ Token diterima frontend
✅ POST ke /api/auth/google
✅ Data tersimpan Firebase
```

### Android:

```
✅ Google Sign-In native dialog
✅ Token diterima frontend
✅ POST ke /api/auth/google
✅ Data tersimpan Firebase
```

### iOS:

```
✅ Google Sign-In native dialog
✅ Token diterima frontend
✅ POST ke /api/auth/google
✅ Data tersimpan Firebase
```

## 📱 Platform-Specific Troubleshooting

### Web Issues:

- CORS error → Check backend CORS settings
- Redirect URI mismatch → Update Google Console
- Invalid client ID → Check Web Client ID

### Android Issues:

- SHA-1 mismatch → Re-generate dan update Google Console
- Package name mismatch → Check app.json vs Google Console
- Google Play Services not available → Test on device with Play Services

### iOS Issues:

- Bundle ID mismatch → Check app.json vs Google Console
- URL scheme not configured → Check app.json scheme
- Missing iOS Client ID → Verify Google Console setup

## 🚀 Production Deployment

### Web Production:

- Update redirect URIs dengan production domain
- Use production Web Client ID

### Android Production:

- Generate production SHA-1 certificate
- Upload ke Google Console
- Update app.json dengan production values

### iOS Production:

- Use production Bundle ID
- Update Google Console dengan production iOS Client ID
- Configure production URL schemes

## 📋 Quick Reference

### Client IDs Usage:

- **Web Client ID**: Frontend web + Backend verification
- **Android Client ID**: Android app configuration
- **iOS Client ID**: iOS app configuration

### Files yang Perlu Diupdate:

- `backend/.env` → Web Client ID untuk verification
- `app.json` → Semua Client IDs + package/bundle config
- Google Console → 3 OAuth credentials terpisah

### Testing Order:

1. **Web first** (easiest to debug)
2. **Android** (dengan Expo Go)
3. **iOS** (dengan Expo Go)
4. **Production builds** untuk testing final
