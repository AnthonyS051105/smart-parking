# 🔧 Setup Google OAuth dengan Firebase - Langkah Demi Langkah

## 📋 Ringkasan Jawaban Pertanyaan Anda

**Q: Apakah data Google OAuth otomatis tersimpan ke Firebase?**
**A: TIDAK otomatis. Anda perlu implementasi endpoint khusus (yang sudah saya buatkan).**

Data Google OAuth akan tersimpan ke Firebase **hanya setelah** Anda:

1. ✅ Setup Google Cloud Console
2. ✅ Konfigurasi backend dengan endpoint `/api/auth/google`
3. ✅ Update frontend untuk kirim Google token ke backend

## 🚀 Langkah Setup Lengkap

### 1. Setup Google Cloud Console

#### A. Buat Project

1. Buka https://console.cloud.google.com/
2. Klik "Select a project" → "New Project"
3. Nama: "SmartParking" → Create

#### B. Enable APIs

1. Buka "APIs & Services" → "Library"
2. Cari "Google Sign-In API" → Enable
3. Atau cari "Google+ API" → Enable

#### C. Create Credentials

1. "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth 2.0 Client IDs"
3. Buat 3 credentials:

**Web Application** (untuk frontend):

- Name: SmartParking Web
- Authorized JavaScript origins: `http://localhost:19006`
- Authorized redirect URIs: `http://localhost:19006`

**Android** (untuk mobile):

- Name: SmartParking Android
- Package: `com.smartparking.app`
- SHA-1: (lihat cara generate di bawah)

**iOS** (untuk mobile):

- Name: SmartParking iOS
- Bundle ID: `com.smartparking.app`

### 2. Generate SHA-1 Certificate (untuk Android)

```bash
# Development SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Copy SHA-1 dari output dan paste ke Google Console
```

### 3. Update Backend

#### A. Install Dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

#### B. Create .env File

```bash
cp .env.template .env
```

Edit `.env`:

```env
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

#### C. Replace Backend File

```bash
# Backup existing backend
cp your_existing_backend.py your_existing_backend.backup.py

# Use new backend dengan Google OAuth
cp backend_with_google_oauth.py your_backend_file.py
```

### 4. Update Frontend

#### A. Update app.json

```json
{
  "expo": {
    "extra": {
      "googleSignIn": {
        "webClientId": "SAME_AS_BACKEND_GOOGLE_CLIENT_ID"
      }
    },
    "android": {
      "package": "com.smartparking.app"
    },
    "ios": {
      "bundleIdentifier": "com.smartparking.app",
      "config": {
        "googleSignIn": {
          "reservedClientId": "YOUR_IOS_CLIENT_ID"
        }
      }
    }
  }
}
```

#### B. Install Missing Dependency

```bash
npm install expo-web-browser
```

### 5. Test Implementation

#### A. Test Backend

```bash
python test_google_oauth.py
```

#### B. Test Frontend

```bash
npm start
# Pilih 'w' untuk web testing
```

### 6. Verify Firebase Data

Setelah Google login sukses, check Firebase Console:

```
📁 Firestore Database
  └── 📁 users
      └── 📄 [auto-generated-id]
          ├── fullName: "John Doe"
          ├── email: "john@gmail.com"
          ├── googleId: "1234567890"
          ├── profilePicture: "https://..."
          ├── authProvider: "google"
          └── ... other fields
```

## 🔍 Troubleshooting

### Issue 1: "Google Client ID not configured"

**Solution**: Pastikan GOOGLE_CLIENT_ID di .env sudah benar

### Issue 2: "Invalid Google token"

**Solution**:

- Check apakah Client ID sama di frontend dan backend
- Pastikan token dari frontend valid

### Issue 3: SHA-1 mismatch (Android)

**Solution**:

- Generate ulang SHA-1 dengan command di atas
- Update di Google Console

### Issue 4: Bundle ID mismatch (iOS)

**Solution**:

- Pastikan bundleIdentifier di app.json sama dengan Google Console

## 📊 Flow Data Google OAuth → Firebase

```
1. User click "Sign in with Google" (Frontend)
   ↓
2. Google OAuth popup (Frontend)
   ↓
3. User authorize & Google return ID token (Frontend)
   ↓
4. Frontend send ID token to /api/auth/google (Backend)
   ↓
5. Backend verify token dengan Google servers
   ↓
6. Backend extract user info (name, email, photo)
   ↓
7. Backend check Firebase: user exist?
   ↓
8. If new user: CREATE document di Firebase
   If existing: UPDATE login info
   ↓
9. Backend generate JWT token
   ↓
10. Frontend receive JWT & user data
    ↓
11. User logged in! ✅
```

## 🎯 Expected Results

Setelah setup lengkap:

- ✅ User bisa login dengan Google
- ✅ Data tersimpan otomatis ke Firebase
- ✅ Profile picture dari Google muncul
- ✅ Email sudah verified
- ✅ Login history tracked
- ✅ Support mix login (email + Google)

## 📝 Next Steps

1. **Complete setup** mengikuti guide ini
2. **Test dengan real Google account**
3. **Check Firebase Console** untuk data
4. **Deploy ke production** dengan production credentials

## 🆘 Support

Jika ada error, check log:

- **Backend**: Terminal Python akan print detail error
- **Frontend**: Check browser console atau Metro console
- **Firebase**: Check Firebase Console untuk data

File bantuan:

- `GOOGLE_FIREBASE_INTEGRATION.md` - Detail teknis
- `test_google_oauth.py` - Testing script
- `requirements.txt` - Dependencies list
