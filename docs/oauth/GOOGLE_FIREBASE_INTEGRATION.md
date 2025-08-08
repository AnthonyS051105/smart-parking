# Google OAuth + Firebase Integration

## 📋 Bagaimana Data Google OAuth Disimpan ke Firebase

### 1. Flow Google OAuth ke Firebase

```
1. User klik "Sign in with Google" di frontend
2. Frontend mendapat ID token dari Google
3. Frontend kirim ID token ke backend (/api/auth/google)
4. Backend verify ID token dengan Google servers
5. Backend ekstrak user info dari verified token
6. Backend cek apakah user sudah ada di Firebase
7. Jika user baru: buat document baru di Firebase
8. Jika user ada: update login info
9. Backend generate JWT token dan return ke frontend
```

### 2. Struktur Data di Firebase

#### User Document Structure:

```json
{
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "phoneNumber": "", // Empty untuk Google users (kecuali diisi manual)
  "password": null, // null untuk Google users
  "googleId": "1234567890123456789", // Google unique ID
  "profilePicture": "https://lh3.googleusercontent.com/...",
  "emailVerified": true, // Google users biasanya sudah verified
  "createdAt": "2025-08-06T10:30:00.000Z",
  "updatedAt": "2025-08-06T10:30:00.000Z",
  "lastLogin": "2025-08-06T10:30:00.000Z",
  "isActive": true,
  "loginCount": 5,
  "authProvider": "google" // Track apakah user pakai email atau Google
}
```

### 3. Scenario Handling

#### Scenario A: User Baru Google Sign-In

- User sign in dengan Google pertama kali
- Backend create document baru di Firebase collection "users"
- Data diisi dari Google profile (name, email, photo)
- `password` field = `null` (karena pakai Google)
- `authProvider` = "google"

#### Scenario B: User Existing Email + Google Sign-In

- User sudah punya account dengan email biasa
- Kemudian sign in dengan Google menggunakan email yang sama
- Backend update existing document dengan Google info
- Tambah `googleId` dan `profilePicture`
- `authProvider` tetap "email" (tapi bisa login dengan Google juga)

#### Scenario C: User Google Sign-In Berulang

- User sudah pernah sign in dengan Google
- Backend update `lastLogin`, `loginCount`, dll
- Data existing tetap utuh

### 4. Keunggulan Integrasi Ini

✅ **Automatic Data Sync**: Data Google langsung masuk Firebase
✅ **User Profile Complete**: Nama, email, foto profile otomatis terisi
✅ **Unified Authentication**: Support login email + Google di satu system
✅ **Data Persistence**: Semua login history tersimpan
✅ **Email Verification**: User Google sudah auto-verified

### 5. Setup Required

#### Backend (.env file):

```env
GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
```

#### Frontend (app.json):

```json
{
  "extra": {
    "googleSignIn": {
      "webClientId": "same_as_backend_google_client_id"
    }
  }
}
```

### 6. Security Features

🔐 **Token Verification**: Backend selalu verify Google token
🔐 **JWT Generation**: Backend generate own JWT untuk session management
🔐 **Firebase Security**: Data tersimpan aman di Firebase
🔐 **No Password Storage**: Google users tidak butuh password

### 7. Testing

1. **Test New Google User**:
   - Sign in dengan Google account baru
   - Check Firebase console: ada document baru
   - Verify field `authProvider` = "google"

2. **Test Existing User**:
   - Buat account dengan email biasa dulu
   - Kemudian sign in dengan Google (same email)
   - Check Firebase: document updated dengan Google info

3. **Test Repeat Login**:
   - Sign in Google berulang kali
   - Check `loginCount` bertambah
   - Check `lastLogin` terupdate

### 8. Monitoring

Backend akan print log:

```
🔐 Google login attempt for: user@gmail.com
📝 Existing user found: user@gmail.com
✅ Google login successful: user@gmail.com (Login #3)
```

Atau untuk user baru:

```
🔐 Google login attempt for: newuser@gmail.com
👤 Creating new Google user: newuser@gmail.com
✅ Google login successful: newuser@gmail.com (Login #1)
```

### 9. Error Handling

- Invalid Google token → Error 400
- Google API down → Error 500
- Firebase connection issue → Error 500
- User account deactivated → Error 401

### 10. Data Migration

Jika Anda sudah punya users existing, mereka bisa:

1. Continue login dengan email/password
2. Link Google account nanti (backend akan merge data)
3. Semua history tetap terjaga
