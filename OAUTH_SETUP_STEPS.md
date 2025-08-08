# 🔧 Google OAuth Setup - Troubleshooting 404 Errors

## ❌ Current Issue

Getting 404 error with existing Client ID: `956536297797-40t8l9ej41b1pqn7089929lc8iok2he4.apps.googleusercontent.com`

## ✅ Solution: Create Fresh OAuth Credentials

### Step 1: Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Select or create project `smartparking-441411`
3. Make sure project is ACTIVE and billing is enabled (if required)

### Step 2: Enable Required APIs

Go to **APIs & Services** > **Library**, search and enable:

- ✅ **People API**
- ✅ **Google+ API** (legacy but needed)
- ✅ **OAuth2 API**

### Step 3: Create OAuth Consent Screen

**APIs & Services** > **OAuth consent screen**:

- User Type: **External**
- App name: `SmartParking`
- User support email: `your-email@gmail.com`
- App domain: Leave blank for testing
- Developer contact: `your-email@gmail.com`

### Step 4: Create New OAuth Client ID

**APIs & Services** > **Credentials** > **Create Credentials** > **OAuth Client ID**:

#### Web Application Client:

- Application type: **Web Application**
- Name: `SmartParking Web Client`
- Authorized JavaScript origins:
  ```
  http://localhost:19006
  http://localhost:3000
  ```
- Authorized redirect URIs:
  ```
  http://localhost:19006
  http://localhost:19006/auth/callback
  http://localhost:3000
  http://localhost:3000/auth/callback
  ```

### Step 5: Test the New Client ID

Use this simple test URL format:

```
https://accounts.google.com/oauth2/v2/auth?client_id=YOUR_NEW_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A19006&response_type=code&scope=email%20profile
```

### Step 6: Update app.json

Replace the webClientId in app.json with your new Client ID.

## 🚨 Common Issues:

1. **Project not active** - Check billing/project status
2. **APIs not enabled** - Enable People API + OAuth2 API
3. **Wrong redirect URI format** - Must be exact match
4. **Client ID from wrong project** - Double-check project selection

## 📝 Notes:

- localhost:19006 is standard Expo dev server port
- Always test manually in browser first
- 404 errors usually mean Client ID or project issues, not redirect URI
