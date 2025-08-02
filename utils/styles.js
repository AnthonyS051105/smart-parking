// Shadow styles untuk berbagai komponen
export const SHADOWS = {
  // Shadow untuk button
  button: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // Shadow untuk button yang elevated/primary
  buttonElevated: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  // Shadow untuk button large
  buttonLarge: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },

  // Shadow untuk logo/image - REMOVED SHADOW
  logo: {
    // Shadow dihapus sesuai permintaan
  },

  // Shadow untuk text/title
  text: {
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Shadow untuk text yang lebih prominent
  textTitle: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // Shadow untuk card/container
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  // Shadow untuk card dengan efek glass
  cardGlass: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  // Shadow untuk card elevated
  cardElevated: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },

  // Shadow untuk input field
  input: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    input: "#F0FDFF",
    inputTeal: "#E6FFFA",
  },
  text: {
    primary: "#2D2B2E",
    secondary: "#6B7280",
    white: "#FFFFFF",
    placeholder: "#9CA3AF",
  },
  error: {
    DEFAULT: "#EF4444",
    light: "#FCA5A5",
    dark: "#DC2626",
  },
  success: {
    DEFAULT: "#10B981",
    light: "#6EE7B7",
    dark: "#059669",
  },
};
