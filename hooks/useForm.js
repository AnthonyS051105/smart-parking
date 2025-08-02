import { useState } from "react";

// Hook untuk menangani form state dan validation
export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error ketika user mulai mengetik
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const setFieldTouched = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // ✅ FIX: Handle different validation result formats
  const validateField = (field, value) => {
    const rule = validationRules[field];
    if (!rule) return null;

    const result = rule(value);

    // Handle different validation result formats
    if (typeof result === "boolean") {
      // For simple boolean validations
      return result ? null : `${field} is invalid`;
    }

    if (result && typeof result === "object") {
      // Check if validation passed
      if (result.isValid === false) {
        // Return the error message
        if (result.error) {
          return result.error;
        }
        if (result.errors) {
          // Handle password validation errors object
          const errorMessages = Object.values(result.errors).filter(Boolean);
          return errorMessages.length > 0 ? errorMessages[0] : null;
        }
      }

      // If isValid is true or undefined, no error
      if (result.isValid === true) {
        return null;
      }
    }

    return null;
  };

  // ✅ FIX: Improved validateAll function
  const validateAll = () => {
    const newErrors = {};
    let isValid = true;

    console.log("🔍 Validating all fields...");
    console.log("📋 Current values:", values);

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field]);
      console.log(`✅ ${field}:`, error ? `❌ ${error}` : "✅ Valid");

      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    console.log("📊 Validation result:", { isValid, errors: newErrors });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {})
    );

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  // ✅ FIX: Better isValid calculation
  const hasErrors = Object.keys(errors).some(
    (key) => errors[key] !== null && errors[key] !== undefined
  );

  // ✅ FIXED: Include setFieldTouched in return statement
  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched, // ← This was missing!
    validateAll,
    reset,
    isValid: !hasErrors,
  };
};
