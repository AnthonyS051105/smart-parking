// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    error: !isValid ? "Please enter a valid email address" : null,
  };
};

export const validatePassword = (password) => {
  // ✅ Sesuaikan dengan backend requirement (minimum 6 chars)
  const minLength = password.length >= 6; // Changed from 8 to 6
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    isValid: minLength, // ✅ Only require minimum length for now
    errors: {
      minLength: !minLength ? "Password must be at least 6 characters" : null,
      // Comment out strict requirements for now
      // hasLetter: !hasLetter ? "Password must contain at least one letter" : null,
      // hasNumber: !hasNumber ? "Password must contain at least one number" : null,
    },
  };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const isValid = password === confirmPassword;
  return {
    isValid,
    error: !isValid ? "Passwords do not match" : null,
  };
};

export const validateUsername = (username) => {
  const minLength = username.length >= 3;
  const validChars = /^[a-zA-Z0-9_]+$/.test(username);

  return {
    isValid: minLength && validChars,
    errors: {
      minLength: !minLength ? "Username must be at least 3 characters" : null,
      validChars: !validChars
        ? "Username can only contain letters, numbers, and underscores"
        : null,
    },
  };
};

export const validateRequired = (value, fieldName = "Field") => {
  const isValid = value && value.trim().length > 0;
  return {
    isValid,
    error: !isValid ? `${fieldName} is required` : null,
  };
};

// ✅ Add phone number validation
export const validatePhoneNumber = (phoneNumber) => {
  const cleanPhone = phoneNumber?.toString().replace(/\D/g, ""); // Remove non-digits
  const isValid = cleanPhone && cleanPhone.length >= 10;
  return {
    isValid,
    error: !isValid ? "Phone number must be at least 10 digits" : null,
  };
};

// ✅ Add full name validation
export const validateFullName = (fullName) => {
  const isValid = fullName && fullName.trim().length >= 2;
  return {
    isValid,
    error: !isValid ? "Full name must be at least 2 characters" : null,
  };
};
