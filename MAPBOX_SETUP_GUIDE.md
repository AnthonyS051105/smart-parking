# 🗺️ Mapbox Dashboard Setup Guide - Mobile Focus

Panduan lengkap untuk menjalankan aplikasi Smart Parking dengan Mapbox Maps untuk Android dan iOS.

## ✨ **Mengapa Mapbox?**

Saya telah mengubah implementasi ke Mapbox berdasarkan permintaan Anda karena:

### **Keunggulan Mapbox untuk Mobile:**
- ✅ **Native Performance**: Optimized untuk Android & iOS
- ✅ **Real Traffic Data**: Traffic-aware routing dengan data real-time
- ✅ **Advanced Navigation**: Turn-by-turn directions yang presisi
- ✅ **Free Tier**: 50,000 requests/bulan (cukup untuk prototype)
- ✅ **Professional Features**: Clustering, custom markers, smooth animations
- ✅ **Offline Support**: Maps dapat di-cache untuk penggunaan offline

### **vs Leaflet:**
- **Leaflet**: Hanya untuk web, tidak optimal untuk mobile
- **Mapbox**: Cross-platform, khusus untuk mobile apps

## 🎯 **Platform Target**

| Platform | Map Engine | Status |
|----------|------------|--------|
| **Android** | Mapbox GL Native | ✅ Primary |
| **iOS** | Mapbox GL Native | ✅ Primary |
| **Web** | Mapbox GL JS | ✅ Fallback |

## 📦 **Dependencies yang Diinstal**

```json
{
  "@rnmapbox/maps": "^11.0.0",
  "@mapbox/mapbox-sdk": "^0.16.0", 
  "supercluster": "^8.0.1"
}
```

## 🚀 **Setup dan Instalasi**

### **1. Verifikasi Dependencies**
```bash
cd /workspace
npm install
```

### **2. Konfigurasi Mapbox Token**

File `/workspace/utils/mapboxConfig.js` sudah dikonfigurasi dengan token Anda:
```javascript
ACCESS_TOKEN: "pk.eyJ1IjoiYW50aG9ueTA1IiwiYSI6ImNtZTQ3Y3F0MDAwMHEya29xMWUzcGVyNHcifQ.4CjdWQvtGe1YVYU-C8lR9Q"
```

### **3. Build Configuration**

File `app.json` sudah dikonfigurasi dengan:
- ✅ Mapbox plugin configuration
- ✅ Location permissions
- ✅ Download token untuk build

## 🔨 **Cara Menjalankan Aplikasi**

### **⚠️ PENTING: Mapbox Memerlukan Development Build**

Mapbox menggunakan native modules yang **TIDAK BISA** dijalankan di Expo Go. Anda harus membuat development build.

### **Option 1: Development Build (Recommended)**

```bash
# Install EAS CLI (jika belum ada)
npm install -g @expo/eas-cli

# Login ke Expo account
eas login

# Build untuk Android (Development)
eas build --platform android --profile development

# Build untuk iOS (Development) 
eas build --platform ios --profile development
```

### **Option 2: Local Development Build**

```bash
# Install Expo Dev Client
npx expo install expo-dev-client

# Generate native code
npx expo run:android --device
# atau
npx expo run:ios --device
```

### **Option 3: Expo Development Build**

```bash
# Create development build
npx expo prebuild

# Start development server
npx expo start --dev-client
```

## 📱 **Step-by-Step Build Process**

### **A. Persiapan**

1. **Install EAS CLI**:
```bash
npm install -g @expo/eas-cli
```

2. **Login ke Expo**:
```bash
eas login
```

3. **Configure Build**:
```bash
eas build:configure
```

### **B. Build untuk Android**

```bash
# Development build (untuk testing)
eas build --platform android --profile development

# Production build 
eas build --platform android --profile production
```

### **C. Build untuk iOS**

```bash
# Development build (perlu Apple Developer Account)
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

### **D. Install Build Result**

1. **Android**: Download `.apk` file dan install
2. **iOS**: Install melalui TestFlight atau direct install

## 🔧 **Configuration Files**

### **1. EAS Build Configuration (`eas.json`)**
```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### **2. App Configuration (`app.json`)**
```json
{
  "expo": {
    "plugins": [
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsImpl": "mapbox",
          "RNMapboxMapsDownloadToken": "your-token-here"
        }
      ]
    ]
  }
}
```

## 🎯 **Features yang Diimplementasikan**

### **🗺️ Map Features**
- ✅ **Mapbox GL Native Maps**: High-performance native maps
- ✅ **Custom Markers**: Color-coded parking availability 
- ✅ **Marker Clustering**: Automatic grouping untuk performance
- ✅ **Smooth Animations**: Fluid map transitions
- ✅ **User Location**: Real-time location tracking

### **🧭 Navigation Features**
- ✅ **Mapbox Directions API**: Premium routing dengan traffic data
- ✅ **Turn-by-Turn**: Detailed navigation instructions
- ✅ **Voice Guidance**: Text-to-speech announcements
- ✅ **Traffic Awareness**: Real-time traffic conditions
- ✅ **Route Alternatives**: Multiple route options
- ✅ **ETA Calculation**: Accurate arrival time estimates

### **📱 UI Features**
- ✅ **Draggable Pull-up Panel**: 3-level snap points
- ✅ **Enhanced Navigation UI**: Rich instruction display
- ✅ **Traffic Information**: Live traffic condition display
- ✅ **Voice Toggle**: Enable/disable voice guidance
- ✅ **Modern Design**: Clean, professional interface

## 🔍 **Files yang Diupdate/Dibuat**

### **New/Updated Files:**
```
📁 /workspace/
├── 🆕 utils/mapboxConfig.js          # Mapbox configuration
├── 🔄 components/maps/MapboxMap.js   # Enhanced Mapbox component
├── 🔄 services/navigationService.js # Mapbox-powered navigation
├── 🔄 app/dashboard.js              # Updated dashboard
├── 🔄 app.json                      # Build configuration
├── 🔄 app/global.css                # Mapbox-optimized styles
└── 🆕 MAPBOX_SETUP_GUIDE.md         # This guide
```

### **Files yang Bisa Dihapus:**
```bash
# Leaflet-related files (tidak diperlukan lagi)
rm components/maps/LeafletMap.js
rm -rf node_modules/leaflet*
```

## 🎮 **Cara Menggunakan Aplikasi**

### **1. Basic Usage**
1. Launch app dari build yang sudah diinstall
2. Allow location permissions
3. Map akan menampilkan lokasi Anda dan parking spots
4. Tap pada parking spot untuk memilih

### **2. Navigation**
1. Pilih parking spot dengan tap
2. Tap tombol "Navigate" di pull-up panel
3. Sistem akan calculate route dengan traffic data
4. Ikuti voice guidance dan turn-by-turn directions

### **3. Features**
- **Search**: Gunakan search bar untuk filter locations
- **My Location**: Tap location button untuk center map
- **Pull-up Panel**: Drag untuk resize, scroll untuk browse spots
- **Voice Control**: Toggle voice guidance on/off

## 🐛 **Troubleshooting**

### **Build Issues**

**Problem**: Metro bundler error
```bash
# Solution: Clear cache
npx expo start --clear

# Or reset metro
npx expo start --clear --reset-cache
```

**Problem**: Mapbox token error
```bash
# Check token in utils/mapboxConfig.js
# Verify app.json configuration
```

**Problem**: Location permissions
```bash
# Check app.json permissions array
# Test on device (not simulator untuk location)
```

### **Runtime Issues**

**Problem**: Map tidak muncul
- ✅ Pastikan menggunakan development build (bukan Expo Go)
- ✅ Check internet connection
- ✅ Verify Mapbox token valid

**Problem**: Navigation tidak bekerja
- ✅ Allow location permissions
- ✅ Check Mapbox API quota
- ✅ Test dengan lokasi yang berbeda

**Problem**: Voice guidance tidak bunyi
- ✅ Check device volume
- ✅ Test speech permissions
- ✅ Try toggle voice button

## 📊 **Performance & Quota**

### **Mapbox Free Tier Limits:**
- 🆓 **50,000 map loads/month**
- 🆓 **Unlimited map views** 
- 🆓 **Basic navigation**
- 💰 **Traffic data**: Premium feature

### **Expected Usage untuk Prototype:**
- **Development**: ~1,000 requests/month
- **Testing**: ~2,000 requests/month  
- **Demo**: ~500 requests/month
- **Total**: Well under 50,000 limit ✅

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
cd /workspace && npm install

# 2. Start development server
npx expo start --dev-client

# 3. Build for testing (pilih salah satu)
eas build --platform android --profile development
eas build --platform ios --profile development

# 4. Install build result dan test!
```

## ✅ **Success Checklist**

Pastikan semua ini berfungsi:
- [ ] Map loads dengan location markers
- [ ] User location terdeteksi
- [ ] Markers dapat diklik
- [ ] Pull-up panel bisa di-drag
- [ ] Navigation bisa dimulai
- [ ] Voice guidance berfungsi  
- [ ] Traffic info ditampilkan
- [ ] Routes tergambar di map

## 🎉 **Result**

Aplikasi Anda sekarang memiliki:
- 🗺️ **Professional Mapbox maps** untuk Android & iOS
- 🧭 **Advanced navigation** dengan traffic data
- 📱 **Modern mobile UI** yang responsive
- 🔊 **Voice guidance** untuk hands-free navigation
- ⚡ **High performance** native implementation

**Target tercapai**: Mobile-first application dengan Mapbox! 🚗📱✨

## 📞 **Support**

Jika ada masalah:
1. Check console untuk error messages
2. Verify Mapbox token dan quota
3. Ensure proper build configuration
4. Test on real device (bukan simulator)

Selamat mencoba aplikasi Smart Parking dengan Mapbox! 🎯