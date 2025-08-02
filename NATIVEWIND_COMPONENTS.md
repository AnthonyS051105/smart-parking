# Smart Parking - Component Documentation

## Overview

Proyek ini telah direfactor untuk menggunakan **NativeWind** sebagai framework styling utama. Semua komponen telah dibuat dengan pendekatan modular dan reusable dengan styling yang konsisten menggunakan utility classes.

## Komponen UI

### Button

Komponen button dengan berbagai variant dan size.

```jsx
import { Button } from "../../components";

// Basic usage
<Button title="Click Me" onPress={handlePress} />

// Dengan props lengkap
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary" // "primary" | "secondary" | "outline" | "ghost"
  size="lg" // "sm" | "md" | "lg"
  disabled={isLoading}
  fullWidth={true}
  className="mb-4"
/>
```

**Props:**

- `title`: string - Text button
- `onPress`: function - Handler ketika ditekan
- `variant`: "primary" | "secondary" | "outline" | "ghost"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean
- `fullWidth`: boolean (default: true)
- `icon`: ReactElement (optional)
- `className`: string - Custom classes

### Input

Komponen input dengan validasi dan password toggle.

```jsx
import { Input } from "../../components";

<Input
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  keyboardType="email-address"
  error={emailError}
/>

// Password input
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  placeholder="Enter password"
  secureTextEntry={true}
  showPasswordToggle={true}
  error={passwordError}
/>
```

**Props:**

- `label`: string - Label input
- `value`: string - Value input
- `onChangeText`: function - Handler perubahan text
- `placeholder`: string
- `error`: string - Error message
- `secureTextEntry`: boolean
- `showPasswordToggle`: boolean
- `keyboardType`: string
- `className`: string

### Card

Komponen container dengan styling glass effect.

```jsx
import { Card } from "../../components";

<Card variant="glass" padding="lg">
  <Text>Content goes here</Text>
</Card>;
```

**Props:**

- `variant`: "default" | "glass" | "elevated"
- `padding`: "none" | "sm" | "md" | "lg"
- `className`: string

### Logo

Komponen logo dengan berbagai ukuran.

```jsx
import { Logo } from "../../components";

<Logo size="lg" showText={true} />;
```

**Props:**

- `size`: "sm" | "md" | "lg"
- `showText`: boolean
- `className`: string

### Divider

Komponen pembagi dengan optional text.

```jsx
import { Divider } from "../../components";

<Divider text="OR" />
<Divider /> // tanpa text
```

### HeaderNavigation

Komponen header dengan back button.

```jsx
import { HeaderNavigation } from "../../components";

<HeaderNavigation
  title="Page Title"
  showBack={true}
  onBackPress={customBackHandler}
/>;
```

## Layout Components

### GradientBackground

Komponen background dengan gradient.

```jsx
import { GradientBackground } from "../../components";

<GradientBackground>{/* Content */}</GradientBackground>;
```

### DecorativeCircles

Komponen dekoratif circles dengan berbagai posisi.

```jsx
import { DecorativeCircles } from "../../components";

<DecorativeCircles variant="bottom-right" />
<DecorativeCircles variant="top-left" />
<DecorativeCircles variant="scattered" />
<DecorativeCircles variant="top-left-light" />
```

## Utilities

### cn (className utility)

Utility function untuk menggabungkan className.

```jsx
import { cn } from "../../utils/cn";

const classes = cn([
  "base-class",
  "another-class",
  condition && "conditional-class",
  customClassName,
]);
```

## Best Practices

### 1. Konsistensi Styling

Gunakan utility classes yang sudah didefinisikan:

```jsx
// ✅ Good
<View className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">

// ❌ Avoid
<View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 24 }}>
```

### 2. Responsive Design

Gunakan responsive classes yang tersedia:

```jsx
// ✅ Good
<Text className="text-sm md:text-base lg:text-lg">

// ✅ Good - Custom responsive dengan JavaScript
const textSize = isDesktop ? "text-lg" : "text-base";
<Text className={cn("font-bold", textSize)}>
```

### 3. Component Composition

Kombinasikan komponen untuk membuat UI yang kompleks:

```jsx
// ✅ Good
<GradientBackground>
  <DecorativeCircles variant="scattered" />
  <HeaderNavigation title="Login" />

  <Card variant="glass" padding="lg" className="mx-5">
    <Input label="Email" />
    <Input label="Password" secureTextEntry />
    <Button title="Login" variant="primary" />
  </Card>
</GradientBackground>
```

### 4. Ekstrak Logic ke Custom Hooks

```jsx
// ✅ Good
const { values, errors, setValue, validateAll } = useForm(
  { email: "", password: "" },
  validationRules
);
```

### 5. Consistent Spacing

Gunakan spacing yang konsisten:

```jsx
// ✅ Good
<View className="space-y-4"> // 16px gap
<View className="space-y-6"> // 24px gap
<View className="mb-4"> // margin bottom 16px
```

## Migration dari Komponen Lama

Untuk backward compatibility, komponen lama masih tersedia:

```jsx
// Old (masih berfungsi)
import CustomButton from "../../components/ui/CustomButton";

// New (recommended)
import { Button } from "../../components";
```

## Colors Palette

Warna yang tersedia di Tailwind config:

```jsx
// Primary colors
"text-primary"; // #DDF8FB
"bg-primary"; // #DDF8FB
"bg-primary-dark"; // #5B9396

// Transparency
"bg-white/10"; // 10% transparent white
"bg-black/20"; // 20% transparent black

// Blue variants
"bg-blue-500";
"bg-blue-600/30"; // 30% transparent blue
```

## Tips untuk Development

1. **Gunakan VS Code Extensions:**
   - Tailwind CSS IntelliSense
   - NativeWind extension

2. **Hot Reload:**

   ```bash
   npx expo start --clear
   ```

3. **Debug Styling:**
   Tambahkan border untuk debugging layout:

   ```jsx
   <View className="border border-red-500">
   ```

4. **Performance:**
   - Avoid inline styles jika memungkinkan
   - Gunakan className untuk styling
   - Ekstrak complex logic ke custom hooks
