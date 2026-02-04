import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useIsAuthenticated, useAuthLoading, useAuthError } from '@/store/hooks';
import { loginUser } from '@/store/authSlice';
import useNotification from '@/store/useNotification';
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
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: formModes.LOGIN,
    defaultValues: {
      email: '',
      password: '',
      role: 'employee',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      successNotification('Login Successful!', 'Redirecting to dashboard...');
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const redirectPath = user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard';
        navigate(redirectPath);
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
              label="Email Address:"
              placeholder="you@example.com"
              rules={validationRules.email}
              required
              // successMessage="Email format is valid"
              layout="horizontal"
            />

            {/* Password Field */}
            <div className="flex items-center gap-4">
              <FormField
                control={control}
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password:"
                placeholder="Enter your password"
                rules={{
                  required: 'Password is required',
                }}
                required
                layout="horizontal"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mb-2 px-3 py-2 text-secondary-600 hover:text-primary-600 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>

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
                  <strong>Employee:</strong> rajesh.kumar@hrportal.com / hashed_password_2
                </p>
              </div>
              <div className="bg-secondary-50 p-2 rounded-lg border border-secondary-100">
                <p className="text-secondary-900">
                  <strong>HR Manager:</strong> priya.sharma@hrportal.com / hashed_password_1
                </p>
              </div>
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
