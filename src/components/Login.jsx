import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useIsAuthenticated, useAuthLoading, useAuthError } from '@/store/hooks';
import { loginUser, clearError } from '@/store/authSlice';
import useNotification from '@/store/useNotification';
import useAsyncOperation from '@/hooks/useAsyncOperation';
import FormField from './FormField';
import LoadingSpinner from './LoadingSpinner';
import { validationRules, formModes } from '@/utils/validationSchemas';
import { logError } from '@/utils/errorHandler';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success: successNotification, error: errorNotification } = useNotification();
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const error = useAuthError();
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    mode: formModes.LOGIN,
    defaultValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      role: 'employee',
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated) {
      successNotification('Login Successful!', 'Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [isAuthenticated, navigate, successNotification]);

  useEffect(() => {
    if (error) {
      errorNotification('Login Failed', error);
    }
  }, [error, errorNotification]);

  const onSubmit = async (data) => {
    const { email, password, role } = data;

    try {
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Dispatch login action with error handling
      const loginPromise = new Promise((resolve, reject) => {
        dispatch(loginUser({ email, password, role }))
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });

      await loginPromise;
    } catch (err) {
      // Log error for debugging
      logError(err, {
        operation: 'Login',
        email,
        role,
      });
      
      // Error notification is handled by the Redux slice
      errorNotification('Login Failed', 'Please check your credentials and try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">HR Portal</h1>
          <p className="text-secondary-600">Welcome back! Please login to continue</p>
        </div>

        {/* Form Container */}
        <div className="card shadow-card-hover">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Role Selection */}
            <FormField
              control={control}
              name="role"
              label="Login As"
              type="radio"
              options={[
                { value: 'employee', label: 'Employee' },
                { value: 'hr', label: 'HR Manager' },
              ]}
              rules={{ required: 'Please select a role' }}
            />

            {/* Email Field */}
            <FormField
              control={control}
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              rules={validationRules.email}
              required
              successMessage="Email format is valid"
            />

            {/* Password Field */}
            <FormField
              control={control}
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              rules={{
                required: 'Password is required',
              }}
              required
              hint="Demo password: hashed_password_1 or hashed_password_2"
            />

            {/* Remember Me Checkbox */}
            <FormField
              control={control}
              name="rememberMe"
              type="checkbox"
              placeholder="Remember my email"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`btn-primary w-full relative transition-opacity ${
                isSubmitting || loading ? 'opacity-75' : 'hover:opacity-90'
              }`}
            >
              {isSubmitting || loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <p className="text-xs text-secondary-600 mb-3">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-secondary-50 p-2 rounded-lg border border-secondary-100">
                <p className="text-secondary-900">
                  <strong>Employee:</strong> rajesh.kumar@hrportal.com
                </p>
              </div>
              <div className="bg-secondary-50 p-2 rounded-lg border border-secondary-100">
                <p className="text-secondary-900">
                  <strong>HR Manager:</strong> priya.sharma@hrportal.com
                </p>
              </div>
              <p className="text-secondary-500">Password: hashed_password_1 or hashed_password_2</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-secondary-600 mt-6">
          © 2024 HR Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
