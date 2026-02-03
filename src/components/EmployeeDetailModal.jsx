import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
];

export default function EmployeeDetailModal({ employee, onClose, onSave, leaveHistory = [] }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      firstName: employee?.firstName || '',
      lastName: employee?.lastName || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      department: employee?.department || 'Engineering',
      position: employee?.position || '',
      dateOfJoining: employee?.dateOfJoining || '',
      status: employee?.status || 'active',
      managerId: employee?.managerId || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_BASE}/employees/${employee.id}`, {
        ...employee,
        ...data,
      });

      setSuccess(true);
      setIsEditing(false);
      
      if (onSave) {
        onSave(response.data);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return null;

  const yearsOfService = employee.dateOfJoining
    ? Math.floor(
        (new Date() - new Date(employee.dateOfJoining)) / (1000 * 60 * 60 * 24 * 365)
      )
    : 0;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'employment', label: 'Employment Details', icon: '💼' },
    { id: 'leaves', label: 'Leave History', icon: '📋' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 flex items-center justify-between border-b border-primary-800 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-primary-600 font-bold text-lg">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-primary-100">{employee.position}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-200 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase">Department</p>
            <p className="text-sm font-bold text-secondary-900">{employee.department}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase">Joined</p>
            <p className="text-sm font-bold text-secondary-900">{employee.dateOfJoining}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary-600 uppercase">Years</p>
            <p className="text-sm font-bold text-secondary-900">{yearsOfService} years</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-4 bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
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
          <div className="mx-6 mt-4 bg-success-50 border border-success-200 rounded-lg p-4 flex items-start gap-3">
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
            <p className="text-sm text-success-700">Employee updated successfully!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-secondary-200 px-6 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-semibold text-sm transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-primary-600 border-primary-600'
                  : 'text-secondary-600 border-transparent hover:text-secondary-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-96 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          {...register('firstName', {
                            required: 'First name is required',
                            minLength: {
                              value: 2,
                              message: 'Must be at least 2 characters',
                            },
                          })}
                          className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-danger-600">{errors.firstName.message}</p>
                        )}
                      </>
                    ) : (
                      <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                        {employee.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          {...register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                              value: 2,
                              message: 'Must be at least 2 characters',
                            },
                          })}
                          className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-danger-600">{errors.lastName.message}</p>
                        )}
                      </>
                    ) : (
                      <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                        {employee.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email',
                          },
                        })}
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                      {employee.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Phone is required',
                          pattern: {
                            value: /^[+]?[\d\s-()]{10,}$/,
                            message: 'Invalid phone number',
                          },
                        })}
                        className={`input-field ${errors.phone ? 'input-error' : ''}`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-danger-600">{errors.phone.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                      {employee.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Employment Details Tab */}
            {activeTab === 'employment' && (
              <div className="space-y-4">
                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Department
                  </label>
                  {isEditing ? (
                    <>
                      <select
                        {...register('department')}
                        className="input-field"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                      {employee.department}
                    </p>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Position
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        {...register('position', {
                          required: 'Position is required',
                          minLength: {
                            value: 3,
                            message: 'Must be at least 3 characters',
                          },
                        })}
                        className={`input-field ${errors.position ? 'input-error' : ''}`}
                      />
                      {errors.position && (
                        <p className="mt-1 text-xs text-danger-600">{errors.position.message}</p>
                      )}
                    </>
                  ) : (
                    <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                      {employee.position}
                    </p>
                  )}
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Date of Joining
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      {...register('dateOfJoining')}
                      className="input-field"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-secondary-50 rounded-input text-secondary-900">
                      {employee.dateOfJoining}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-1">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      {...register('status')}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  ) : (
                    <p className={`py-2 px-3 rounded-input font-semibold ${
                      employee.status === 'active'
                        ? 'bg-success-50 text-success-900'
                        : 'bg-danger-50 text-danger-900'
                    }`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Leave History Tab */}
            {activeTab === 'leaves' && (
              <div className="space-y-4">
                {leaveHistory && leaveHistory.length > 0 ? (
                  <div className="space-y-3">
                    {leaveHistory.map((leave) => (
                      <div key={leave.id} className="border border-secondary-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-secondary-900">{leave.leaveType}</p>
                            <p className="text-xs text-secondary-600">
                              {leave.startDate} to {leave.endDate}
                            </p>
                          </div>
                          <span
                            className={`badge ${
                              leave.status === 'approved'
                                ? 'badge-success'
                                : leave.status === 'pending'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        {leave.reason && (
                          <p className="text-sm text-secondary-700">{leave.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-secondary-600">No leave history</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary-50 px-6 py-4 border-t border-secondary-200 flex gap-3 justify-end rounded-b-lg">
          {!isEditing ? (
            <>
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
