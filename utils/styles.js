// Shadow styles untuk berbagai komponen
export const SHADOWS = {
  // Shadow sesuai gambar: X=0, Y=4, Blur=4.8, Spread=0, #000000 25%
  button: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 8,
  },

  buttonElevated: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 8,
  },

  buttonLarge: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 8,
  },

  // Shadow untuk text sesuai gambar
  text: {
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4.8,
  },

  textTitle: {
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4.8,
  },

  // Other shadows...
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 8,
  },

  input: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4.8,
    elevation: 4,
  },
};

// Color constants
export const COLORS = {
  primary: {
    light: "#B7F7FB",
    DEFAULT: "#DDF8FB",
    dark: "#5B9396",
    text: "#CEF1F3",
  },
  gradient: {
    start: "#4B919B",
    end: "#093E47",
  },
  background: {
    card: "#FFFFFF",
    input: "#E2E2E2",
    inputTeal: "#E6FFFA",
    signupButton: "#2F6E77",
  },
  text: {
    primary: "#2D2B2E",
    secondary: "#6B7280",
    white: "#FFFFFF",
    placeholder: "#909090",
    signup: "#093E47",
  },
  error: {
    DEFAULT: "#EF4444",
  },
};
