import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../../utils/validators';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: Record<string, string | null> = {
      first_name: validateRequired(formData.first_name, 'First name'),
      last_name: validateRequired(formData.last_name, 'Last name'),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== null);
    if (hasErrors) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setApiError(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {apiError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.first_name}
          onChange={handleChange('first_name')}
          error={errors.first_name}
          placeholder="John"
        />
        <Input
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange('last_name')}
          error={errors.last_name}
          placeholder="Doe"
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        placeholder="••••••••"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={errors.confirmPassword}
        placeholder="••••••••"
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;