import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateEmail, validateRequired } from '../../utils/validators';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const emailError = validateEmail(email);
    const passwordError = validateRequired(password, 'Password');

    setErrors({ email: emailError, password: passwordError });

    if (emailError !== null || passwordError !== null) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setApiError(error.response?.data?.detail || 'Login failed. Please try again.');
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
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="••••••••"
      />
      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;