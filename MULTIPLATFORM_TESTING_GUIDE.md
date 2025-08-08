# 🧪 Multi-Platform Google OAuth Testing Guide

## 🎯 Testing Strategy

Test urutan: **Web → Android → iOS** (dari yang paling mudah debug)

## 📋 Prerequisites

1. ✅ Google Cloud Console sudah setup (3 OAuth credentials)
2. ✅ Backend running dengan Google OAuth endpoint
3. ✅ Firebase Firestore siap terima data
4. ✅ app.json sudah dikonfigurasi dengan 3 Client IDs

## 🌐 Phase 1: Web Testing

### Setup:

```bash
# Pastikan backend running
cd backend
python app.py

# Terminal baru, jalankan frontend
cd ..
npm start
# Pilih 'w' untuk web
```

### Test Steps:

1. Buka http://localhost:19006 di browser
2. Buka Developer Tools (F12)
3. Klik "Sign in with Google"
4. Login dengan Google account
5. Check console logs

### Expected Results:

```
✅ Browser Console:
🔐 Starting Google Sign-In...
✅ Google Sign-In successful, sending to backend...
✅ Google login successful for: user@gmail.com

✅ Backend Terminal:
🔐 Google login attempt for: user@gmail.com
👤 Creating new Google user: user@gmail.com
✅ Google login successful: user@gmail.com (Login #1)

✅ Firebase Console:
New document in 'users' collection with Google data
```

### Web Troubleshooting:

- **CORS error**: Check backend CORS settings
- **Invalid client**: Check Web Client ID in app.json
- **Redirect mismatch**: Update Google Console redirect URIs

## 📱 Phase 2: Android Testing

### Setup SHA-1 Certificate:

```bash
# Generate debug SHA-1
./generate_sha1.sh
# Pilih option 1

# Copy SHA-1 output ke Google Console → Android OAuth
```

### Test with Expo Go:

```bash
npm start
# Scan QR code dengan Expo Go di Android device
```

### Test with Development Build:

```bash
# Install Expo CLI tools
npm install -g @expo/cli

# Create development build
npx expo run:android
```

### Expected Results:

```
✅ Android Device:
Native Google Sign-In dialog appears
User selects Google account
App receives token dan login sukses

✅ Backend logs sama seperti web testing
✅ Firebase data tersimpan
```

### Android Troubleshooting:

- **SHA-1 mismatch**: Re-generate dan update Google Console
- **Package name error**: Check app.json android.package
- **Google Play Services**: Test on device with Play Services

## 🍎 Phase 3: iOS Testing

### Test with Expo Go:

```bash
npm start
# Pilih 'i' untuk iOS Simulator
# Atau scan QR dengan Expo Go di iOS device
```

### Test with Development Build:

```bash
# Requires macOS dengan Xcode
npx expo run:ios
```

### Expected Results:

```
✅ iOS Device/Simulator:
Native Google Sign-In dialog
User selects Google account
App receives token dan login sukses

✅ Backend logs sama seperti platform lain
✅ Firebase data tersimpan
```

### iOS Troubleshooting:

- **Bundle ID mismatch**: Check app.json ios.bundleIdentifier
- **URL scheme error**: Check app.json scheme configuration
- **Invalid iOS Client ID**: Verify Google Console setup

## 🔍 Debug Tools per Platform

### Web Debug:

```bash
# Browser DevTools
- Console tab: Check JavaScript logs
- Network tab: Monitor API calls
- Application tab: Check localStorage/AsyncStorage

# Backend debug
curl http://localhost:5000/health
# Should return: "google_oauth": "configured"
```

### Android Debug:

```bash
# React Native logs
npx react-native log-android

# atau Expo logs
npx expo logs --platform android

# ADB logs
adb logcat | grep -i "google\|oauth\|smartparking"
```

### iOS Debug:

```bash
# React Native logs
npx react-native log-ios

# atau Expo logs
npx expo logs --platform ios

# Xcode logs (jika menggunakan development build)
# Buka Xcode → Window → Devices and Simulators → View Device Logs
```

## 🎯 Verification Checklist

### ✅ Web Verification:

- [ ] Google OAuth popup muncul
- [ ] User bisa pilih Google account
- [ ] Token diterima frontend
- [ ] POST request ke /api/auth/google berhasil (200)
- [ ] JWT token diterima dari backend
- [ ] User data tersimpan di Firebase
- [ ] Login state updated di frontend

### ✅ Android Verification:

- [ ] Native Google Sign-In dialog muncul
- [ ] Account picker works
- [ ] Token generation berhasil
- [ ] API call ke backend berhasil
- [ ] Firebase data tersimpan
- [ ] App navigation ke dashboard

### ✅ iOS Verification:

- [ ] Native Google Sign-In dialog muncul
- [ ] Account selection works
- [ ] Token exchange berhasil
- [ ] Backend communication sukses
- [ ] Firebase data persistence
- [ ] App state management correct

## 🔧 Common Issues & Solutions

### Issue: "Google OAuth not configured"

**Platforms**: All
**Solution**: Check backend .env file, restart backend server

### Issue: "Invalid client ID"

**Platforms**: All  
**Solution**: Verify Client IDs di app.json match Google Console

### Issue: "Redirect URI mismatch"

**Platforms**: Web
**Solution**: Add correct URIs di Google Console Web OAuth

### Issue: "SHA-1 certificate mismatch"

**Platforms**: Android
**Solution**:

```bash
./generate_sha1.sh
# Update Google Console dengan SHA-1 yang benar
```

### Issue: "Bundle ID not found"

**Platforms**: iOS
**Solution**: Check app.json ios.bundleIdentifier

### Issue: "Network request failed"

**Platforms**: All
**Solution**:

- Check backend is running (localhost:5000)
- Check phone/emulator dapat akses localhost
- Use IP address instead: http://YOUR_IP:5000

## 📊 Success Metrics

### Per Platform:

- ✅ Google login success rate: 100%
- ✅ Firebase data accuracy: Complete user profile
- ✅ Token validation: Valid JWT dari backend
- ✅ Error handling: Graceful fallbacks

### Cross-Platform:

- ✅ Same user dapat login di semua platform
- ✅ Firebase data consistent across platforms
- ✅ Login count accurate
- ✅ Profile data synced

## 🚀 Production Testing

### Before Production Deploy:

1. **Generate production certificates**:
   - Android: Production SHA-1
   - iOS: Production Bundle ID

2. **Update Google Console**:
   - Add production redirect URIs
   - Add production certificates

3. **Test production builds**:

   ```bash
   # Android
   eas build --platform android --profile production

   # iOS
   eas build --platform ios --profile production
   ```

4. **Verify production endpoints**:
   - Update backend URLs
   - Test with production Firebase

This comprehensive testing ensures Google OAuth works seamlessly across all platforms! 🎉
