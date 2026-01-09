import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../store/AuthContext';
import { isValidUsername, isValidPassword } from '../utils/helpers';

/**
 * Signup page
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!isValidUsername(formData.username)) {
      newErrors.username =
        'Username must be 3-20 characters (letters, numbers, underscore)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    try {
      await signup(
        formData.username,
        formData.password,
        formData.confirmPassword,
        formData.phoneNumber || undefined
      );
      navigate('/');
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message || 'Signup failed. Please try again.'
      );
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen -my-8">
        <div className="w-full max-w-md bg-gray-900 border-2 border-yellow-500 rounded-lg p-8">
          <h1 className="text-3xl font-black text-yellow-500 mb-2 text-center">
            IMDB
          </h1>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>

          {apiError && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Choose a username"
              helperText="3-20 characters, letters, numbers, underscore"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="At least 6 characters"
              helperText="Use a strong password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
            />

            <Input
              label="Phone Number (optional)"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Your phone number"
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
