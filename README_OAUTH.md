# 🚗 SmartParking - Multi-Platform Google OAuth

Smart parking application dengan Google OAuth terintegrasi untuk **Web, Android, dan iOS**.

## 🌟 Features

- ✅ **Multi-Platform Google OAuth** (Web + Android + iOS)
- ✅ **Firebase Firestore** integration
- ✅ **Unified Authentication** (Email + Google)
- ✅ **Cross-Platform Profile Sync**
- ✅ **React Native** dengan Expo
- ✅ **Flask Backend** dengan JWT

## 🏗️ Project Structure

```
SmartParking/
├── 📱 Frontend (React Native + Expo)
│   ├── app/                     # Expo Router pages
│   ├── components/              # Reusable components
│   ├── contexts/AuthContext.js  # Authentication state
│   ├── services/GoogleAuthService.js # Google OAuth logic
│   └── app.json                 # Expo configuration
│
├── 🖥️ Backend (Flask + Firebase)
│   ├── app.py                   # Main Flask application
│   ├── .env                     # Environment variables
│   ├── requirements.txt         # Python dependencies
│   └── firebase-key.json        # Firebase service account
│
├── 📚 Documentation
│   ├── GOOGLE_MULTIPLATFORM_SETUP.md    # Google Console setup
│   ├── MULTIPLATFORM_TESTING_GUIDE.md   # Testing guide
│   └── docs/oauth/                       # Additional docs
│
└── 🛠️ Tools
    ├── generate_sha1.sh         # SHA-1 generator for Android
    └── setup_oauth.sh           # Quick setup script
```

## 🚀 Quick Start

### 1. Setup Project

```bash
# Clone repository
git clone <your-repo>
cd SmartParking

# Run setup script
./setup_oauth.sh
```

### 2. Configure Google OAuth

```bash
# Follow detailed guide
cat GOOGLE_MULTIPLATFORM_SETUP.md

# Generate Android SHA-1
./generate_sha1.sh
```

### 3. Update Configuration Files

**backend/.env:**

```env
GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
```

**app.json:**

```json
{
  "expo": {
    "extra": {
      "googleSignIn": {
        "webClientId": "your_web_client_id.apps.googleusercontent.com",
        "androidClientId": "your_android_client_id.apps.googleusercontent.com",
        "iosClientId": "your_ios_client_id.apps.googleusercontent.com"
      }
    }
  }
}
```

### 4. Start Development

**Terminal 1 - Backend:**

```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**

```bash
npm start
# Choose platform: w (web), a (android), i (ios)
```

## 🧪 Testing

### Web Testing:

```bash
npm start
# Press 'w' for web
# Open http://localhost:19006
# Test Google login
```

### Android Testing:

```bash
npm start
# Scan QR with Expo Go app
# Or: npx expo run:android
```

### iOS Testing:

```bash
npm start
# Press 'i' for iOS simulator
# Or: npx expo run:ios
```

## 📊 Platform Support

| Platform    | Status   | OAuth Method                | Notes               |
| ----------- | -------- | --------------------------- | ------------------- |
| **Web**     | ✅ Ready | expo-auth-session           | Works in browser    |
| **Android** | ✅ Ready | @react-native-google-signin | Requires SHA-1 cert |
| **iOS**     | ✅ Ready | @react-native-google-signin | Requires Bundle ID  |

## 🔧 Configuration Examples

### Google Cloud Console Setup:

1. **Web Application**: http://localhost:19006
2. **Android App**: Package `com.smartparking.app` + SHA-1
3. **iOS App**: Bundle `com.smartparking.app`

### Expected Firebase Data:

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

## 🎯 Authentication Flow

```mermaid
graph TD
    A[User clicks Google Login] --> B{Platform?}

    B -->|Web| C[expo-auth-session]
    B -->|Mobile| D[@react-native-google-signin]

    C --> E[Google OAuth Popup]
    D --> F[Native Google Dialog]

    E --> G[Get ID Token]
    F --> G

    G --> H[Send to Backend /api/auth/google]
    H --> I[Verify Token with Google]
    I --> J[Save/Update Firebase]
    J --> K[Return JWT Token]
    K --> L[User Logged In ✅]
```

## 🛠️ Development Tools

### Useful Scripts:

- `./setup_oauth.sh` - Initial project setup
- `./generate_sha1.sh` - Generate Android certificates
- `npm start` - Start Expo development server
- `cd backend && python app.py` - Start Flask backend

### Debug Commands:

```bash
# Check backend health
curl http://localhost:5000/health

# View React Native logs
npx expo logs --platform android
npx expo logs --platform ios

# Check Firebase data
# Open Firebase Console → Firestore Database
```

## 📚 Documentation

- **[Multi-Platform Setup](GOOGLE_MULTIPLATFORM_SETUP.md)** - Google Console configuration
- **[Testing Guide](MULTIPLATFORM_TESTING_GUIDE.md)** - Platform-specific testing
- **[API Documentation](docs/oauth/)** - Backend API reference

## 🔒 Security Features

- ✅ **Google Token Verification** - Backend validates all tokens
- ✅ **JWT Authentication** - Secure session management
- ✅ **Firebase Security Rules** - Database access control
- ✅ **CORS Protection** - Cross-origin request filtering
- ✅ **Environment Variables** - Sensitive data protection

## 🚀 Production Deployment

### Backend (Flask):

- Deploy ke Heroku/Railway/DigitalOcean
- Update CORS origins untuk production
- Use production Firebase project

### Frontend (Expo):

```bash
# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Google Console:

- Update redirect URIs untuk production
- Add production SHA-1 certificates
- Configure production Bundle IDs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create GitHub issue
- **Documentation**: Check docs/ folder
- **Testing**: Follow MULTIPLATFORM_TESTING_GUIDE.md

---

Made with ❤️ using React Native, Expo, Flask, and Firebase

**Ready for Web, Android, and iOS! 🎉**
