import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useCurrentUser } from '@/store/hooks';
import { updateEmployee } from '@/store/employeeSlice';

const DEPARTMENTS = {
  Engineering: ['Alice Johnson', 'Bob Smith', 'Carol White'],
  Sales: ['David Brown', 'Emma Davis', 'Frank Miller'],
  Marketing: ['Grace Wilson', 'Henry Moore', 'Ivy Taylor'],
  HR: ['Jack Anderson', 'Karen Thomas'],
  Finance: ['Leo Jackson', 'Mia White', 'Noah Harris'],
  Operations: ['Olivia Martin', 'Paul Garcia'],
};

export default function EmployeeProfile() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'emergency', 'security'
  const [photoPreview, setPhotoPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      zipCode: currentUser?.zipCode || '',
    },
  });

  const {
    register: registerEmergency,
    handleSubmit: handleSubmitEmergency,
    formState: { errors: emergencyErrors },
    reset: resetEmergency,
  } = useForm({
    defaultValues: {
      emergencyContactName: currentUser?.emergencyContactName || '',
      emergencyContactPhone: currentUser?.emergencyContactPhone || '',
      emergencyContactRelation: currentUser?.emergencyContactRelation || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch new password field for confirmation match
  const newPassword = watchPassword('newPassword');
  const confirmPassword = watchPassword('confirmPassword');

  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const onSubmitProfile = async (data) => {
    setActionLoading(true);
    setError(null);
    try {
      await dispatch(
        updateEmployee({
          id: currentUser.employeeId,
          updates: {
            ...data,
            profilePhoto: photoPreview || currentUser?.profilePhoto,
          },
        })
      ).unwrap();
      setSuccess(true);
      setPhotoPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle emergency contact update
  const onSubmitEmergency = async (data) => {
    setActionLoading(true);
    setError(null);
    try {
      await dispatch(
        updateEmployee({
          id: currentUser.employeeId,
          updates: data,
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update emergency contact');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle password change
  const onSubmitPassword = async () => {
    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      resetPassword();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to change password');
    } finally {
      setActionLoading(false);
    }
  };

  // Get team members for department
  const teamMembers = currentUser?.department ? DEPARTMENTS[currentUser.department] || [] : [];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-secondary-900">My Profile</h1>
          <p className="text-secondary-600 mt-1">Manage your personal and account information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-success-700">Changes saved successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Photo & Basic Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-center">
                {/* Profile Photo */}
                <div className="mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 relative group shadow-lg">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      title="Upload photo"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-secondary-600 mt-2">Click avatar to upload photo</p>
                </div>

                <h3 className="text-xl font-bold text-secondary-900">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h3>
                <p className="text-sm text-secondary-600 mt-1">{currentUser?.position}</p>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-secondary-200 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase">Employee ID</p>
                  <p className="text-sm font-medium text-secondary-900">{currentUser?.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase">Status</p>
                  <span className="badge badge-success text-xs">Active</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-secondary-600 uppercase">Joined</p>
                  <p className="text-sm font-medium text-secondary-900">
                    {currentUser?.dateOfJoining
                      ? new Date(currentUser.dateOfJoining).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs & Forms */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 border border-secondary-200">
              {[
                { id: 'profile', label: 'Personal Info', icon: '👤' },
                { id: 'emergency', label: 'Emergency Contact', icon: '🆘' },
                { id: 'security', label: 'Security', icon: '🔒' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                {/* Personal Information */}
                <div className="card">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">Phone</label>
                      <input
                        type="tel"
                        {...registerProfile('phone', {
                          pattern: {
                            value: /^[\d\s\-+()]+$/,
                            message: 'Invalid phone number format',
                          },
                        })}
                        className="input-field"
                        placeholder="(555) 123-4567"
                      />
                      {profileErrors.phone && (
                        <p className="text-sm text-danger-600 mt-1">{profileErrors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">Email</label>
                      <input
                        type="email"
                        disabled
                        value={currentUser?.email}
                        className="input-field bg-secondary-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-secondary-600 mt-1">Cannot be changed</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">Address</label>
                    <input
                      type="text"
                      {...registerProfile('address')}
                      className="input-field"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">City</label>
                      <input type="text" {...registerProfile('city')} className="input-field" placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">State</label>
                      <input type="text" {...registerProfile('state')} className="input-field" placeholder="State" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        {...registerProfile('zipCode', {
                          pattern: {
                            value: /^\d{5}(-\d{4})?$/,
                            message: 'Invalid ZIP code format',
                          },
                        })}
                        className="input-field"
                        placeholder="12345"
                      />
                      {profileErrors.zipCode && (
                        <p className="text-sm text-danger-600 mt-1">{profileErrors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="card">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Employment Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Department</p>
                      <p className="text-sm font-medium text-secondary-900">{currentUser?.department}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Position</p>
                      <p className="text-sm font-medium text-secondary-900">{currentUser?.position}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Date of Joining</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {currentUser?.dateOfJoining
                          ? new Date(currentUser.dateOfJoining).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Manager</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {currentUser?.managerName || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {teamMembers.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">Team Members</h3>

                    <div className="space-y-2">
                      {teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-secondary-900">{member}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-3">
                  <button type="submit" disabled={actionLoading} className="btn-primary flex-1">
                    {actionLoading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button type="button" onClick={() => resetProfile()} className="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === 'emergency' && (
              <form onSubmit={handleSubmitEmergency(onSubmitEmergency)} className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Emergency Contact Information</h3>
                  <p className="text-sm text-secondary-600 mb-6">
                    This information will be used to contact someone in case of an emergency.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        {...registerEmergency('emergencyContactName', {
                          required: 'Emergency contact name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                        className="input-field"
                        placeholder="John Doe"
                      />
                      {emergencyErrors.emergencyContactName && (
                        <p className="text-sm text-danger-600 mt-1">
                          {emergencyErrors.emergencyContactName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Relationship *
                      </label>
                      <select
                        {...registerEmergency('emergencyContactRelation', {
                          required: 'Relationship is required',
                        })}
                        className="input-field"
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                      {emergencyErrors.emergencyContactRelation && (
                        <p className="text-sm text-danger-600 mt-1">
                          {emergencyErrors.emergencyContactRelation.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...registerEmergency('emergencyContactPhone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[\d\s\-+()]+$/,
                            message: 'Invalid phone number format',
                          },
                        })}
                        className="input-field"
                        placeholder="(555) 987-6543"
                      />
                      {emergencyErrors.emergencyContactPhone && (
                        <p className="text-sm text-danger-600 mt-1">
                          {emergencyErrors.emergencyContactPhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-secondary-200 bg-primary-50 rounded-lg p-4">
                    <p className="text-sm text-primary-900">
                      <strong>Current Emergency Contact:</strong> {currentUser?.emergencyContactName || 'Not set'} -{' '}
                      {currentUser?.emergencyContactPhone || 'No phone'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={actionLoading} className="btn-primary flex-1">
                    {actionLoading ? 'Saving...' : '💾 Save Emergency Contact'}
                  </button>
                  <button type="button" onClick={() => resetEmergency()} className="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        className="input-field"
                        placeholder="••••••••"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-danger-600 mt-1">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message:
                              'Password must contain at least one uppercase letter, lowercase letter, and number',
                          },
                        })}
                        className="input-field"
                        placeholder="••••••••"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-danger-600 mt-1">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your password',
                        })}
                        className={`input-field ${!passwordMatch && confirmPassword ? 'border-danger-500' : ''}`}
                        placeholder="••••••••"
                      />
                      {!passwordMatch && confirmPassword && (
                        <p className="text-sm text-danger-600 mt-1">Passwords do not match</p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <p className="text-sm font-semibold text-secondary-900 mb-3">Password Requirements:</p>
                      <ul className="space-y-2 text-sm text-secondary-700">
                        <li className="flex items-center gap-2">
                          <span className={newPassword?.length >= 8 ? 'text-success-600' : 'text-secondary-400'}>
                            ✓
                          </span>
                          At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                          <span
                            className={/[A-Z]/.test(newPassword) ? 'text-success-600' : 'text-secondary-400'}
                          >
                            ✓
                          </span>
                          One uppercase letter (A-Z)
                        </li>
                        <li className="flex items-center gap-2">
                          <span
                            className={/[a-z]/.test(newPassword) ? 'text-success-600' : 'text-secondary-400'}
                          >
                            ✓
                          </span>
                          One lowercase letter (a-z)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={/\d/.test(newPassword) ? 'text-success-600' : 'text-secondary-400'}>
                            ✓
                          </span>
                          One number (0-9)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={passwordMatch ? 'text-success-600' : 'text-secondary-400'}>✓</span>
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={actionLoading || !passwordMatch} className="btn-primary flex-1">
                    {actionLoading ? 'Updating...' : '🔒 Change Password'}
                  </button>
                  <button type="button" onClick={() => resetPassword()} className="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
