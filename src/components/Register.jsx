import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEmployeeLoading } from '@/store/hooks';
import useNotification from '@/store/useNotification';
import axios from 'axios';
import FormField from './FormField';
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  formModes,
} from '@/utils/validationSchemas';

const API_BASE = 'http://localhost:3001';
const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
];

export default function Register() {
  const navigate = useNavigate();
  const { success: successNotification, error: errorNotification } = useNotification();
  const loading = useEmployeeLoading();
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    trigger,
    reset,
  } = useForm({
    mode: formModes.REGISTER,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      position: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const totalSteps = 3;

  const validateStep = async () => {
    if (step === 1) {
      return await trigger(['firstName', 'lastName', 'email', 'phone']);
    } else if (step === 2) {
      return await trigger(['department', 'position', 'dateOfJoining']);
    } else if (step === 3) {
      return await trigger(['password', 'confirmPassword']);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Check if email already exists
      const existingUsers = await axios.get(`http://localhost:5000/api/users?email=${data.email}`);
      if (existingUsers.data.length > 0) {
        errorNotification('Registration Failed', 'Email already registered. Please use a different email.');
        return;
      }

      // Create employee record
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        position: data.position,
        dateOfJoining: data.dateOfJoining,
        status: 'active',
        managerId: null,
      };

      const employeeResponse = await axios.post('http://localhost:5000/api/employees', employeeData);
      const newEmployeeId = employeeResponse.data.id;

      // Create user account
      const userData = {
        email: data.email,
        password: data.password, // In production, hash this with bcrypt
        role: 'employee',
        employeeId: newEmployeeId,
      };

      await axios.post('http://localhost:5000/api/users', userData);

      // Success feedback
      successNotification('Registration Successful!', 'Redirecting to login...');
      reset();
      setStep(1);
      
      // Redirect to login with success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      errorNotification('Registration Error', errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-2">Employee Registration</h1>
          <p className="text-secondary-600">Create your account to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    s <= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-200 text-secondary-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      s < step ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span className={step === 1 ? 'text-primary-600' : 'text-secondary-600'}>
              Personal Info
            </span>
            <span className={step === 2 ? 'text-primary-600' : 'text-secondary-600'}>
              Employment
            </span>
            <span className={step === 3 ? 'text-primary-600' : 'text-secondary-600'}>
              Password
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="card shadow-card-hover">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary-900">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                    rules={registerStep1Schema.firstName}
                    required
                    successMessage="Valid name"
                  />

                  <FormField
                    control={control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    rules={registerStep1Schema.lastName}
                    required
                    successMessage="Valid name"
                  />
                </div>

                <FormField
                  control={control}
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="john.doe@company.com"
                  rules={registerStep1Schema.email}
                  required
                  successMessage="Email format is valid"
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <FormField
                  control={control}
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="+91-9876543210"
                  rules={registerStep1Schema.phone}
                  required
                  successMessage="Valid phone number"
                  hint="Format: +1-9876543210 or (987) 654-3210"
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.295a1 1 0 00-.096 1.697l-2.457 2.457a1 1 0 00-.096 1.697l3.452 3.452a1 1 0 001.697-.096l2.457-2.457a1 1 0 001.697.096l1.295 2.048a1 1 0 00.756.502l4.493 1.498a1 1 0 00.684-.948V5a2 2 0 00-2-2h-2.28a1 1 0 00-.948.684L9.552 3.684a1 1 0 00-.502.756L7.552 8.933a1 1 0 00.096 1.697l2.457 2.457a1 1 0 00.096 1.697L6.75 17.838a1 1 0 01-1.697-.096l-2.457-2.457a1 1 0 00-1.697.096L1.852 18.933a1 1 0 00-.756-.502L-1.493 17.435a1 1 0 00-.684.948v2.28a2 2 0 002 2h2.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 00-.502-.756l-2.048-1.295a1 1 0 00.096-1.697l2.457-2.457a1 1 0 00.096-1.697l-3.452-3.452a1 1 0 00-1.697.096l-2.457 2.457a1 1 0 00-1.697-.096l-1.295-2.048a1 1 0 00-.756-.502l-4.493-1.498a1 1 0 00-.684.948z" />
                    </svg>
                  }
                />
              </div>
            )}

            {/* Step 2: Employment Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary-900">Employment Details</h2>

                <FormField
                  control={control}
                  name="department"
                  type="select"
                  label="Department"
                  options={DEPARTMENTS.map((dept) => ({ value: dept, label: dept }))}
                  rules={registerStep2Schema.department}
                  required
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  }
                />

                <FormField
                  control={control}
                  name="position"
                  label="Position"
                  placeholder="e.g., Senior Software Engineer"
                  rules={registerStep2Schema.position}
                  required
                  successMessage="Valid position"
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 0a2 2 0 100-4m0 4a2 2 0 110-4m0 0V4m0 2a2 2 0 100 4" />
                    </svg>
                  }
                />

                <FormField
                  control={control}
                  name="dateOfJoining"
                  type="date"
                  label="Date of Joining"
                  rules={registerStep2Schema.dateOfJoining}
                  required
                  successMessage="Date confirmed"
                />
              </div>
            )}

            {/* Step 3: Login Credentials */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary-900">Login Credentials</h2>

                <FormField
                  control={control}
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter a strong password"
                  rules={registerStep3Schema.password}
                  required
                  successMessage="Strong password"
                  hint="Must contain: uppercase, lowercase, number, and special character (@$!%*?&)"
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />

                <FormField
                  control={control}
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  rules={{
                    ...registerStep3Schema.confirmPassword,
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                  required
                  successMessage={password && password === watch('confirmPassword') ? 'Passwords match' : undefined}
                  icon={
                    <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  }
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-secondary-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="btn-secondary flex-1"
                >
                  ← Previous
                </button>
              )}
              {step < totalSteps ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="btn-primary flex-1"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`btn-primary flex-1 relative transition-opacity ${
                    isSubmitting || loading ? 'opacity-75' : 'hover:opacity-90'
                  }`}
                >
                  {isSubmitting || loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 inline flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    '✓ Complete Registration'
                  )}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <p className="text-secondary-600">
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
