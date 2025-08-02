# SmartParking - Component Documentation

## Struktur Komponen

Proyek ini telah direfactor menjadi struktur yang lebih modular dengan komponen yang dapat digunakan ulang.

### Struktur Folder

```
components/
├── ui/                    # UI components yang dapat digunakan ulang
│   ├── CustomButton.js    # Button komponen dengan berbagai variant
│   ├── CustomInput.js     # Input field dengan validation dan styling
│   ├── Divider.js        # Divider dengan text
│   ├── HeaderNavigation.js # Header dengan back button dan title
│   └── Logo.js           # Logo komponen dengan shadow dan sizing
├── layout/               # Layout components
│   ├── GradientBackground.js # Background gradient dengan responsive container
│   └── DecorativeCircles.js  # Decorative circles untuk background
└── index.js             # Export semua komponen

utils/
├── responsive.js        # Utility functions untuk responsive design
├── styles.js           # Style constants dan shadow definitions
└── validation.js       # Form validation utilities

hooks/
└── useForm.js          # Custom hook untuk form state management
```

## Komponen UI

### CustomButton

Button komponen yang responsive dengan berbagai variant dan shadow.

```javascript
import { CustomButton } from "../../components";

<CustomButton
  title="Get Started"
  onPress={handlePress}
  variant="primary" // "primary", "secondary", "outline", "transparent"
  size="large" // "small", "medium", "large"
  disabled={false}
  fullWidth={true}
/>;
```

**Props:**

- `title`: Text pada button
- `onPress`: Function yang dipanggil saat button ditekan
- `variant`: Style variant button
- `size`: Ukuran button
- `disabled`: Status disabled
- `fullWidth`: Apakah button menggunakan full width

### CustomInput

Input field dengan label, validation, dan password toggle.

```javascript
import { CustomInput } from "../../components";

<CustomInput
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  keyboardType="email-address"
  showPasswordToggle={false}
  error="Error message"
/>;
```

**Props:**

- `label`: Label untuk input
- `value`: Value input
- `onChangeText`: Function untuk handle perubahan text
- `placeholder`: Placeholder text
- `secureTextEntry`: Untuk password field
- `showPasswordToggle`: Menampilkan toggle untuk password
- `error`: Error message untuk validation

### Logo

Logo komponen dengan shadow dan sizing responsive.

```javascript
import { Logo } from "../../components";

<Logo
  size="large" // "small", "medium", "large"
  showText={true}
  textColor="#CEF1F3"
/>;
```

### HeaderNavigation

Header dengan back button dan title.

```javascript
import { HeaderNavigation } from "../../components";

<HeaderNavigation
  title="User"
  showBack={true}
  onBackPress={customBackHandler}
/>;
```

## Layout Components

### GradientBackground

Background gradient dengan responsive container.

```javascript
import { GradientBackground } from "../../components";

<GradientBackground>
  <YourContent />
</GradientBackground>;
```

### DecorativeCircles

Decorative circles untuk background dengan berbagai variant.

```javascript
import { DecorativeCircles } from "../../components";

<DecorativeCircles
  variant="bottom-right" // "bottom-right", "top-left", "scattered"
  opacity={0.4}
/>;
```

## Utilities

### Responsive Utils

```javascript
import {
  getResponsiveSize,
  getResponsiveFontSize,
  isDesktop,
} from "../../utils/responsive";

const fontSize = getResponsiveFontSize(16);
const desktop = isDesktop();
```

### Style Constants

```javascript
import { SHADOWS, COLORS } from "../../utils/styles";

const buttonStyle = {
  ...SHADOWS.button,
  backgroundColor: COLORS.primary.DEFAULT,
};
```

### Form Validation

```javascript
import { useForm } from "../../hooks/useForm";
import { validateEmail, validatePassword } from "../../utils/validation";

const { values, errors, setValue, validateAll } = useForm(
  { email: "", password: "" },
  {
    email: validateEmail,
    password: validatePassword,
  }
);
```

## Best Practices

### 1. Responsive Design

- Gunakan utility functions dari `utils/responsive.js`
- Komponen otomatis menyesuaikan dengan ukuran layar
- Desktop dan mobile memiliki styling yang berbeda

### 2. Consistent Styling

- Gunakan constants dari `utils/styles.js`
- Shadow dan color konsisten di semua komponen
- Typography menggunakan Poppins font family

### 3. Form Handling

- Gunakan `useForm` hook untuk state management
- Validation dilakukan secara real-time
- Error handling yang konsisten

### 4. Component Reusability

- Komponen dirancang untuk dapat digunakan ulang
- Props yang fleksibel dengan default values
- Styling dapat di-override sesuai kebutuhan

### 5. Performance

- Lazy loading untuk komponen yang tidak diperlukan
- Optimized re-renders dengan proper state management
- Responsive utilities di-cache untuk performa

## Migrasi dari Komponen Lama

Jika Anda memiliki komponen lama yang ingin dimigrasi:

1. **Extract reusable parts**: Identifikasi bagian yang bisa dijadikan komponen
2. **Use utility functions**: Ganti hardcoded values dengan responsive utilities
3. **Apply consistent styling**: Gunakan style constants
4. **Add validation**: Implementasikan form validation jika diperlukan

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm start

# For web
npm run web
```

Proyek ini sekarang lebih maintainable, scalable, dan mengikuti best practices untuk React Native development!
