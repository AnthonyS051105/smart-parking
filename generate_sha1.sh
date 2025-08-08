#!/bin/bash

# Script untuk generate SHA-1 certificate fingerprint untuk Google OAuth

echo "🔑 Generating SHA-1 Certificate Fingerprints for Google OAuth"
echo "============================================================="

# Function to generate debug SHA-1
generate_debug_sha1() {
    echo ""
    echo "📱 DEVELOPMENT/DEBUG SHA-1:"
    echo "--------------------------------"
    
    # Check if debug keystore exists
    if [ -f ~/.android/debug.keystore ]; then
        echo "✅ Debug keystore found at ~/.android/debug.keystore"
        echo ""
        echo "🔍 Generating SHA-1..."
        
        keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep "SHA1:"
        
        echo ""
        echo "📋 Copy the SHA-1 value above and paste it in Google Cloud Console"
        echo "   → APIs & Services → Credentials → Android OAuth Client"
        
    else
        echo "❌ Debug keystore not found!"
        echo "   Please run an Android build first to generate debug keystore:"
        echo "   npx expo run:android"
    fi
}

# Function to generate release SHA-1
generate_release_sha1() {
    echo ""
    echo "🏭 PRODUCTION/RELEASE SHA-1:"
    echo "--------------------------------"
    
    # Look for release keystore in common locations
    RELEASE_KEYSTORE=""
    
    if [ -f "./android/app/release.keystore" ]; then
        RELEASE_KEYSTORE="./android/app/release.keystore"
    elif [ -f "./release.keystore" ]; then
        RELEASE_KEYSTORE="./release.keystore"
    elif [ -f "./android/keystores/release.keystore" ]; then
        RELEASE_KEYSTORE="./android/keystores/release.keystore"
    fi
    
    if [ -n "$RELEASE_KEYSTORE" ]; then
        echo "✅ Release keystore found at $RELEASE_KEYSTORE"
        echo ""
        echo "🔐 Enter your keystore details:"
        read -p "Keystore alias: " ALIAS
        read -s -p "Keystore password: " STORE_PASS
        echo ""
        read -s -p "Key password: " KEY_PASS
        echo ""
        echo ""
        echo "🔍 Generating SHA-1..."
        
        keytool -list -v -keystore "$RELEASE_KEYSTORE" -alias "$ALIAS" -storepass "$STORE_PASS" -keypass "$KEY_PASS" | grep "SHA1:"
        
        echo ""
        echo "📋 Copy the SHA-1 value above for PRODUCTION Google OAuth"
        
    else
        echo "❌ Release keystore not found!"
        echo "   Common locations checked:"
        echo "   - ./android/app/release.keystore"
        echo "   - ./release.keystore"
        echo "   - ./android/keystores/release.keystore"
        echo ""
        echo "   To generate release keystore:"
        echo "   keytool -genkey -v -keystore release.keystore -alias your-alias -keyalg RSA -keysize 2048 -validity 10000"
    fi
}

# Function to show package info
show_package_info() {
    echo ""
    echo "📦 PACKAGE INFORMATION:"
    echo "--------------------------------"
    
    # Check app.json for package name
    if [ -f "./app.json" ]; then
        ANDROID_PACKAGE=$(grep -o '"package"[[:space:]]*:[[:space:]]*"[^"]*"' app.json | cut -d'"' -f4)
        IOS_BUNDLE=$(grep -o '"bundleIdentifier"[[:space:]]*:[[:space:]]*"[^"]*"' app.json | cut -d'"' -f4)
        
        echo "📱 Android Package Name: $ANDROID_PACKAGE"
        echo "🍎 iOS Bundle Identifier: $IOS_BUNDLE"
        echo ""
        echo "✅ Use these values in Google Cloud Console:"
        echo "   Android OAuth → Package name: $ANDROID_PACKAGE"
        echo "   iOS OAuth → Bundle ID: $IOS_BUNDLE"
    else
        echo "❌ app.json not found!"
        echo "   Please run this script from your project root directory"
    fi
}

# Function to show Google Console instructions
show_google_console_instructions() {
    echo ""
    echo "🌐 GOOGLE CLOUD CONSOLE SETUP:"
    echo "=================================="
    echo ""
    echo "1. Go to: https://console.cloud.google.com/"
    echo "2. Select your project (or create new one)"
    echo "3. Navigate to: APIs & Services → Credentials"
    echo "4. Click: + CREATE CREDENTIALS → OAuth 2.0 Client IDs"
    echo ""
    echo "5. Create 3 separate credentials:"
    echo ""
    echo "   A. Web Application:"
    echo "      - Application type: Web application"
    echo "      - Authorized JavaScript origins: http://localhost:19006"
    echo "      - Authorized redirect URIs: http://localhost:19006"
    echo ""
    echo "   B. Android Application:"
    echo "      - Application type: Android"
    echo "      - Package name: (see above)"
    echo "      - SHA-1 certificate: (see above)"
    echo ""
    echo "   C. iOS Application:"
    echo "      - Application type: iOS"
    echo "      - Bundle ID: (see above)"
    echo ""
    echo "6. Copy all 3 Client IDs to your app.json and backend/.env"
    echo ""
}

# Main execution
echo "What would you like to do?"
echo ""
echo "1) Generate DEBUG SHA-1 (for development)"
echo "2) Generate RELEASE SHA-1 (for production)"
echo "3) Show package information"
echo "4) Show Google Console setup instructions"
echo "5) Do everything"
echo ""
read -p "Enter your choice (1-5): " CHOICE

case $CHOICE in
    1)
        generate_debug_sha1
        ;;
    2)
        generate_release_sha1
        ;;
    3)
        show_package_info
        ;;
    4)
        show_google_console_instructions
        ;;
    5)
        show_package_info
        generate_debug_sha1
        generate_release_sha1
        show_google_console_instructions
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done! Use the information above to configure Google OAuth."
echo ""
