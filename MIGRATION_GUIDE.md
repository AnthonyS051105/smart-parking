# Smart Parking - NativeWind Refactoring Summary

## ✅ Yang Sudah Dibuat

### 1. Komponen UI Baru dengan NativeWind

- **Button** (`/components/ui/Button.js`) - Menggantikan CustomButton
- **Input** (`/components/ui/Input.js`) - Menggantikan CustomInput
- **Card** (`/components/ui/Card.js`) - Container dengan glass effect
- **Logo** (`/components/ui/Logo.js`) - Logo dengan berbagai ukuran
- **Divider** (`/components/ui/Divider.js`) - Pembagi dengan optional text
- **HeaderNavigation** (`/components/ui/HeaderNavigation.js`) - Header dengan back button
- **LoadingSpinner** (`/components/ui/LoadingSpinner.js`) - Loading indicator

### 2. Layout Components (Updated)

- **GradientBackground** - Sudah menggunakan NativeWind
- **DecorativeCircles** - Diupdate dengan NativeWind

### 3. Utilities

- **cn** (`/utils/cn.js`) - Helper untuk menggabungkan className

### 4. File Contoh

- **identitas.js** - Sudah direfactor menggunakan komponen baru
- **login-new.js** - Contoh implementasi form login
- **status-new.js** - Contoh implementasi halaman status
- **ProfileForm.js** - Contoh form kompleks

## 🔧 Konfigurasi

### Tailwind Config

File `tailwind.config.js` sudah diupdate dengan:

- Path ke folder components
- Font family mapping untuk Poppins
- Custom colors dan spacing

## 📋 Langkah Implementasi

### 1. Ganti Import Komponen

```jsx
// Dari
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";

// Ke
import { Button, Input } from "../../components";
```

### 2. Update Props

**Button:**

```jsx
// Lama
<CustomButton
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
  size="large"
  fontFamily="Poppins-SemiBold"
/>

// Baru
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
  size="lg"
/>
```

**Input:**

```jsx
// Lama
<CustomInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  containerStyle={{ marginBottom: 16 }}
  error={emailError?.error}
/>

// Baru
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  className="mb-4"
  error={emailError}
/>
```

### 3. Gunakan Card untuk Container

```jsx
// Lama
<View style={{
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: 24,
  padding: 20,
  ...SHADOWS.card
}}>

// Baru
<Card variant="glass" padding="lg">
```

### 4. Update Layout Classes

```jsx
// Lama
<View style={{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32
}}>

// Baru
<View className="flex-1 justify-center items-center px-8">
```

## 🎨 Style Guide

### Colors

```jsx
// Text colors
"text-white"; // White text
"text-white/70"; // 70% transparent white
"text-blue-500"; // Primary blue

// Background colors
"bg-white/10"; // 10% transparent white (glass effect)
"bg-blue-500"; // Primary blue
"bg-blue-600/30"; // 30% transparent blue (decorative)
```

### Spacing

```jsx
// Margins & Padding
"p-4"; // padding: 16px
"px-8"; // paddingHorizontal: 32px
"mb-6"; // marginBottom: 24px

// Gaps
"space-y-4"; // gap vertical 16px between children
"space-x-3"; // gap horizontal 12px between children
```

### Typography

```jsx
"text-sm"; // 14px
"text-base"; // 16px
"text-lg"; // 18px
"text-xl"; // 20px
"text-2xl"; // 24px

"font-medium"; // Poppins-Medium
"font-semibold"; // Poppins-SemiBold
"font-bold"; // Poppins-Bold
```

### Layout

```jsx
"flex-1"; // flex: 1
"flex-row"; // flexDirection: 'row'
"items-center"; // alignItems: 'center'
"justify-center"; // justifyContent: 'center'
"self-end"; // alignSelf: 'flex-end'
```

### Effects

```jsx
"rounded-3xl"; // borderRadius: 24px
"shadow-lg"; // drop shadow large
"backdrop-blur-sm"; // backdrop blur effect
"border"; // border width 1px
"border-white/20"; // border color 20% white
"active:opacity-80"; // opacity on press
```

## 🚀 Cara Migrate File Existing

### 1. Update Import

```jsx
// Di bagian atas file
import {
  GradientBackground,
  DecorativeCircles,
  HeaderNavigation,
  Button,
  Input,
  Card,
  Logo,
  Divider,
} from "../../components";
```

### 2. Replace Komponen

Ganti satu per satu:

1. CustomButton → Button
2. CustomInput → Input
3. Manual View containers → Card
4. Style objects → className

### 3. Test & Refine

```bash
npx expo start --clear
```

## 📁 File yang Perlu Diupdate

### Priority 1 (Core Auth Flow)

- `/app/auth/login.js`
- `/app/auth/signup.js`
- `/app/auth/status.js`

### Priority 2 (Main App)

- `/app/dashboard.js`
- `/app/profile.js`
- `/app/bookings.js`

### Priority 3 (Other Features)

- Files in `/app/dashboard/` folder

## 🔄 Backward Compatibility

Komponen lama masih tersedia untuk transisi bertahap:

- `CustomButton` masih bisa digunakan
- `CustomInput` masih bisa digunakan

## 🐛 Debugging Tips

1. **Class tidak apply:** Pastikan path di `tailwind.config.js` sudah benar
2. **Font tidak muncul:** Check font family mapping di config
3. **Spacing tidak tepat:** Gunakan VS Code extension Tailwind IntelliSense
4. **Layout issue:** Tambahkan `border border-red-500` untuk debug

## 📖 Next Steps

1. Migrate file prioritas 1 terlebih dahulu
2. Test setiap perubahan
3. Update dokumentasi jika ada perubahan API
4. Optimize performance dengan menghapus komponen lama yang tidak terpakai

## 💡 Benefits

✅ **Lebih Maintainable** - Code lebih bersih dan mudah dibaca
✅ **Konsisten** - Styling uniform di seluruh aplikasi  
✅ **Developer Friendly** - IntelliSense dan auto-complete
✅ **Faster Development** - Utility classes lebih cepat
✅ **Smaller Bundle** - Hanya CSS yang digunakan yang di-include
✅ **Responsive Ready** - Built-in responsive utilities
