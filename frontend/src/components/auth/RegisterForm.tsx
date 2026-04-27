import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../utils/validators';
import { AxiosError } from 'axios';

interface RegisterFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  first_name?: string;
  last_name?: string;
  general?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const firstNameError = validateRequired(formData.first_name, 'First name');
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validateRequired(formData.last_name, 'Last name');
    if (lastNameError) newErrors.last_name = lastNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.detail || 'Registration failed. Please try again.';
        setErrors({ general: message });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.general && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          type="text"
          value={formData.first_name}
          onChange={(e) => updateField('first_name', e.target.value)}
          error={errors.first_name}
          placeholder="John"
          autoComplete="given-name"
          required
        />

        <Input
          label="Last Name"
          type="text"
          value={formData.last_name}
          onChange={(e) => updateField('last_name', e.target.value)}
          error={errors.last_name}
          placeholder="Doe"
          autoComplete="family-name"
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        error={errors.password}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        placeholder="Repeat your password"
        autoComplete="new-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isSubmitting}
      >
        Create Account
      </Button>
    </form>
  );
};