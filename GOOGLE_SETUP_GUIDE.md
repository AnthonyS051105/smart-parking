# 🔑 Setup Google Cloud Console untuk OAuth - Panduan Lengkap

## ❗ Catatan tentang "Google Sign-In API"

**Anda benar** - Google Sign-In API sudah tidak ada lagi di Google Cloud Console. Sekarang menggunakan **Google Identity** yang otomatis tersedia untuk semua project.

## 📋 Langkah-Langkah Setup (Terbaru 2024/2025)

### 1. Buat Google Cloud Project

1. **Buka Google Cloud Console**: https://console.cloud.google.com/
2. **Klik dropdown project** di bagian atas
3. **Klik "New Project"**
4. **Nama project**: `SmartParking`
5. **Klik "Create"**

### 2. Enable Google Identity API (OTOMATIS)

**TIDAK PERLU** mencari dan enable API apapun! Google Identity sudah otomatis aktif untuk semua project baru.

### 3. Buat OAuth 2.0 Credentials

1. **Buka menu** ☰ → **APIs & Services** → **Credentials**
2. **Klik "+ CREATE CREDENTIALS"**
3. **Pilih "OAuth 2.0 Client IDs"**

#### Untuk Web Application (WAJIB - untuk frontend):

- **Application type**: `Web application`
- **Name**: `SmartParking Web`
- **Authorized JavaScript origins**:
  ```
  http://localhost:19006
  http://localhost:3000
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:19006
  https://auth.expo.io/@your-expo-username/smartparking
  ```
- **Klik "CREATE"**
- **📋 COPY "Client ID"** → Ini untuk .env backend

#### Untuk Android (Opsional - untuk mobile):

- **Application type**: `Android`
- **Name**: `SmartParking Android`
- **Package name**: `com.smartparking.app`
- **SHA-1 certificate fingerprint**: (lihat cara generate di bawah)

#### Untuk iOS (Opsional - untuk mobile):

- **Application type**: `iOS`
- **Name**: `SmartParking iOS`
- **Bundle ID**: `com.smartparking.app`

### 4. Generate SHA-1 untuk Android (Jika Diperlukan)

```bash
# Development SHA-1 (debug keystore)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Copy output SHA-1 yang seperti ini:
# SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD
```

### 5. Setup Backend

#### A. Update .env file di folder backend:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**⚠️ GUNAKAN WEB CLIENT ID**, bukan Android atau iOS Client ID!

#### B. Test backend:

```bash
cd backend
python app.py
```

Browser akan menampilkan:

```json
{
  "message": "🚗 SmartParking API is running!",
  "google_oauth": "configured"
}
```

### 6. Setup Frontend

#### A. Update app.json:

```json
{
  "expo": {
    "extra": {
      "googleSignIn": {
        "webClientId": "123456789-abcdefghijklmnop.apps.googleusercontent.com"
      }
    }
  }
}
```

**⚠️ GUNAKAN WEB CLIENT ID YANG SAMA** seperti di backend!

#### B. Restart Expo:

```bash
npm start
```

### 7. Test Google OAuth

#### Test di Web Browser (Paling Mudah):

1. `npm start` → pilih 'w' untuk web
2. Buka http://localhost:19006
3. Klik "Login with Google"
4. Login dengan Google account
5. Check browser console untuk log
6. Check backend terminal untuk log

#### Expected Logs:

**Frontend (Browser Console):**

```
🔐 Starting Google Sign-In...
✅ Google Sign-In successful, sending to backend...
✅ Google login successful for: user@gmail.com
```

**Backend (Terminal):**

```
🔐 Google login attempt for: user@gmail.com
👤 Creating new Google user: user@gmail.com
✅ Google login successful: user@gmail.com (Login #1)
```

### 8. Verify Firebase

Buka **Firebase Console** → **Firestore Database** → **Collection "users"**:

Harus ada dokumen baru seperti:

```json
{
  "fullName": "John Doe",
  "email": "john@gmail.com",
  "googleId": "1234567890",
  "profilePicture": "https://lh3.googleusercontent.com/...",
  "emailVerified": true,
  "authProvider": "google",
  "loginCount": 1,
  "createdAt": "2025-08-06T..."
}
```

## 🔧 Troubleshooting

### Error: "Google OAuth not configured"

**Solution**: Pastikan GOOGLE_CLIENT_ID di `.env` backend sudah diisi

### Error: "Invalid Google token"

**Solutions**:

1. Pastikan Client ID sama di frontend dan backend
2. Pastikan pakai Web Client ID (bukan Android/iOS)
3. Restart backend setelah update .env

### Error: "Cannot connect to server"

**Solution**: Pastikan backend running di http://localhost:5000

### Error: "CORS error"

**Solution**: Pastikan backend ada CORS configuration (sudah ada di code)

## 📱 Mobile Testing (Android/iOS)

Untuk test di mobile device/emulator:

1. Setup Android/iOS credentials di Google Console
2. Update app.json dengan mobile-specific config
3. Build dengan `expo run:android` atau `expo run:ios`

## 🔑 Security Notes

- **Web Client ID**: Boleh public, digunakan untuk frontend
- **Client Secret**: JANGAN pernah expose ke frontend
- **Production**: Gunakan domain production di redirect URIs

## 🎯 Quick Test

Cara cepat test apakah setup berhasil:

1. **Backend test**:

   ```bash
   curl http://localhost:5000/health
   ```

   Harus return: `"google_oauth": "configured"`

2. **Frontend test**:
   - Buka browser dev tools
   - Login dengan Google
   - Check Network tab untuk POST ke `/api/auth/google`
   - Harus return HTTP 200 dengan JWT token

3. **Firebase test**:
   - Check Firestore Console
   - Harus ada collection "users" dengan data Google
