#!/bin/bash

echo "🚀 Starting SmartParking build process..."

# Set environment variables
export CI=1
export EXPO_USE_FAST_RESOLVER=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf android ios

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run prebuild
echo "🔨 Running prebuild..."
npx expo prebuild --clean --platform android

# Check if prebuild was successful
if [ $? -eq 0 ]; then
    echo "✅ Prebuild successful! Now attempting EAS build..."
    
    # Try EAS build
    echo "🚀 Starting EAS build..."
    npx eas-cli build --platform android --profile development --clear-cache --non-interactive
else
    echo "❌ Prebuild failed. Please check the errors above."
    exit 1
fi