/**
 * Form validation utility functions.
 */

/**
 * Validate that a value is not empty.
 */
export function validateRequired(value: string, fieldName: string = 'This field'): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate that a value is a valid email address.
 */
export function validateEmail(value: string): string | null {
  const requiredError = validateRequired(value, 'Email');
  if (requiredError) return requiredError;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validate password meets minimum requirements.
 */
export function validatePassword(value: string): string | null {
  const requiredError = validateRequired(value, 'Password');
  if (requiredError) return requiredError;

  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (value.length > 128) {
    return 'Password must be at most 128 characters';
  }
  return null;
}

/**
 * Validate that a string meets minimum length requirements.
 */
export function validateMinLength(value: string, minLength: number, fieldName: string = 'This field'): string | null {
  if (value && value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
}

/**
 * Validate that a string does not exceed maximum length.
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string = 'This field'): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} must be at most ${maxLength} characters`;
  }
  return null;
}

/**
 * Validate that two passwords match.
 */
export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}