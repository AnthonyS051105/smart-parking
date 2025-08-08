# Google OAuth Configuration Guide

## Step-by-Step Setup Instructions

### 1. Google Cloud Console Setup

1. **Buka Google Cloud Console**: https://console.cloud.google.com/
2. **Buat Project Baru atau Pilih Project**:
   - Klik dropdown project di top bar
   - Klik "New Project" dan beri nama "SmartParking"

3. **Enable APIs**:
   - Buka "APIs & Services" → "Library"
   - Cari dan enable: "Google Sign-In API" atau "Google+ API"

4. **Create OAuth 2.0 Credentials**:
   - Buka "APIs & Services" → "Credentials"
   - Klik "Create Credentials" → "OAuth 2.0 Client IDs"

### 2. Create Credentials for Each Platform

#### A. Web Application (untuk Expo Web)

- **Application type**: Web application
- **Name**: SmartParking Web
- **Authorized JavaScript origins**:
  - `http://localhost:19006` (untuk development)
  - `https://yourdomain.com` (untuk production)
- **Authorized redirect URIs**:
  - `http://localhost:19006`
  - `https://auth.expo.io/@your-username/smartparking`

#### B. Android Application

- **Application type**: Android
- **Name**: SmartParking Android
- **Package name**: `com.smartparking.app`
- **SHA-1 certificate fingerprint**:

  Untuk development, gunakan debug keystore:

  ```bash
  # Di folder android/app
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```

#### C. iOS Application

- **Application type**: iOS
- **Name**: SmartParking iOS
- **Bundle ID**: `com.smartparking.app`

### 3. Update app.json dengan Credentials

Setelah mendapat credentials, update `app.json`:

```json
{
  "expo": {
    // ... existing config
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.smartparking.app",
      "config": {
        "googleSignIn": {
          "reservedClientId": "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com"
        }
      }
    },
    "android": {
      // ... existing config
      "package": "com.smartparking.app",
      "config": {
        "googleSignIn": {
          "apiKey": "YOUR_ANDROID_API_KEY",
          "certificateHash": "YOUR_SHA1_CERTIFICATE_HASH"
        }
      }
    },
    "extra": {
      "googleSignIn": {
        "webClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
      }
    }
  }
}
```

### 4. Development Setup

Untuk development, Anda bisa menggunakan nilai berikut sementara:

1. **Copy credentials dari Google Console**
2. **Paste ke app.json**
3. **Restart Expo development server**

### 5. Testing

Test OAuth dengan urutan:

1. Web browser (paling mudah untuk debug)
2. Android emulator/device
3. iOS simulator/device

### 6. Production Deployment

Untuk production:

1. Generate production certificates
2. Update Google Console dengan production SHA-1
3. Update app.json dengan production values
4. Build dan publish app

### 7. Troubleshooting

**Common Issues:**

- SHA-1 mismatch: Re-generate dan update di Google Console
- Package name mismatch: Pastikan sama di app.json dan Google Console
- Client ID mismatch: Pastikan menggunakan Web Client ID untuk expo-auth-session

**Debug Tips:**

- Check browser console untuk web
- Check Metro console untuk mobile
- Test di browser dulu sebelum mobile
