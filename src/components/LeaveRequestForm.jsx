import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useCurrentUser, useLeaveLoading, useLeaveError, useEmployeeLeaves } from '@/store/hooks';
import { submitLeaveRequest, fetchLeavesByEmployee, clearError } from '@/store/leaveSlice';
import FormField from './FormField';
import SuccessMessage from './SuccessMessage';
import { leaveRequestSchema, formModes } from '@/utils/validationSchemas';

const LEAVE_TYPES = [
  { value: 'Sick Leave', label: 'Sick Leave', maxDays: 10 },
  { value: 'Vacation', label: 'Vacation/Annual Leave', maxDays: 20 },
  { value: 'Personal Leave', label: 'Personal Leave', maxDays: 5 },
  { value: 'Emergency Leave', label: 'Emergency Leave', maxDays: 3 },
  { value: 'Paid Time Off', label: 'Paid Time Off', maxDays: 5 },
];

export default function LeaveRequestForm() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const loading = useLeaveLoading();
  const error = useLeaveError();
  const employeeLeaves = useEmployeeLeaves();

  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: formModes.LEAVE_REQUEST,
    defaultValues: {
      leaveType: 'Sick Leave',
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const selectedLeaveType = watch('leaveType');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const reasonText = watch('reason');

  // Fetch employee leaves on mount
  useEffect(() => {
    if (currentUser?.employeeId) {
      dispatch(fetchLeavesByEmployee(currentUser.employeeId));
    }
  }, [dispatch, currentUser]);

  // Calculate remaining days for selected leave type
  useEffect(() => {
    const leaveType = LEAVE_TYPES.find((lt) => lt.value === selectedLeaveType);
    if (leaveType) {
      // Count used days for this leave type
      const usedDays = employeeLeaves
        .filter((leave) => leave.leaveType === selectedLeaveType && leave.status === 'approved')
        .reduce((total, leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

      setRemainingDays(Math.max(0, leaveType.maxDays - usedDays));
    }
  }, [selectedLeaveType, employeeLeaves]);

  // Calculate number of days between dates
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Check for overlapping leave requests
  const hasOverlappingLeaves = () => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return employeeLeaves.some((leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);

      // Check if dates overlap
      return !(end < leaveStart || start > leaveEnd);
    });
  };

  const onSubmit = async (data) => {
    setValidationError(null);

    // Additional custom validations
    if (!data.startDate || !data.endDate) {
      setValidationError('Please select both start and end dates');
      return;
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (end < start) {
      setValidationError('End date must be after start date');
      return;
    }

    const days = calculateDays();

    if (days > remainingDays) {
      setValidationError(
        `You only have ${remainingDays} days available for ${selectedLeaveType}. You requested ${days} days.`
      );
      return;
    }

    if (hasOverlappingLeaves()) {
      setValidationError('You already have a leave request during these dates');
      return;
    }

    // Submit leave request
    try {
      await dispatch(
        submitLeaveRequest({
          employeeId: currentUser.employeeId,
          leaveType: data.leaveType,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason.trim(),
        })
      ).unwrap();

      setSuccess(true);
      setSuccessMessage(`Leave request submitted successfully! You have ${remainingDays - days} days remaining.`);
      reset();

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit leave request:', err);
    }
  };

  const selectedType = LEAVE_TYPES.find((lt) => lt.value === selectedLeaveType);
  const requestedDays = calculateDays();

  return (
    <div className="min-h-screen bg-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Request Leave</h1>
          <p className="text-secondary-600 mt-2">Submit a new leave request</p>
        </div>

        {/* Main Form Card */}
        <div className="card shadow-card-hover">
          {/* Success Message */}
          {success && (
            <div className="mb-6">
              <SuccessMessage 
                title="Leave Request Submitted!"
                message={successMessage}
                autoClose={true}
                duration={4000}
              />
            </div>
          )}

          {/* Error Message */}
          {(error || validationError) && (
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
              <div>
                <p className="font-semibold text-danger-900">Error</p>
                <p className="text-sm text-danger-700">{error || validationError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Leave Type */}
            <FormField
              control={control}
              name="leaveType"
              type="select"
              label="Leave Type"
              options={LEAVE_TYPES.map((type) => ({ value: type.value, label: type.label }))}
              rules={leaveRequestSchema.leaveType}
              required
              hint={selectedType && `Maximum allowed: ${selectedType.maxDays} days`}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Leave Balance */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-primary-900 uppercase mb-1">Total Allowed</p>
                <p className="text-2xl font-bold text-primary-600">
                  {selectedType?.maxDays || 0}
                </p>
              </div>
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-accent-900 uppercase mb-1">Requested</p>
                <p className="text-2xl font-bold text-accent-600">{requestedDays}</p>
              </div>
              <div className={`border rounded-lg p-4 ${
                remainingDays < 5
                  ? 'bg-warning-50 border-warning-200'
                  : 'bg-success-50 border-success-200'
              }`}>
                <p className={`text-xs font-semibold uppercase mb-1 ${
                  remainingDays < 5 ? 'text-warning-900' : 'text-success-900'
                }`}>
                  Remaining
                </p>
                <p className={`text-2xl font-bold ${
                  remainingDays < 5 ? 'text-warning-600' : 'text-success-600'
                }`}>
                  {Math.max(0, remainingDays - requestedDays)}
                </p>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startDate"
                type="date"
                label="Start Date"
                rules={leaveRequestSchema.startDate}
                required
                successMessage="Date selected"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />

              <FormField
                control={control}
                name="endDate"
                type="date"
                label="End Date"
                rules={{
                  ...leaveRequestSchema.endDate,
                  validate: (value) => {
                    if (!value) return 'End date is required';
                    if (startDate) {
                      const start = new Date(startDate);
                      const end = new Date(value);
                      return end >= start || 'End date must be after start date';
                    }
                    return true;
                  },
                }}
                required
                successMessage="Date selected"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Date Range Info */}
            {startDate && endDate && (
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-secondary-900">
                    {requestedDays} day{requestedDays > 1 ? 's' : ''} of leave
                  </p>
                  <p className="text-xs text-secondary-600">
                    From {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Reason */}
            <FormField
              control={control}
              name="reason"
              type="textarea"
              label="Reason for Leave"
              placeholder="Please provide a detailed reason for your leave request"
              rules={leaveRequestSchema.reason}
              required
              rows={4}
              hint={`${reasonText.length}/500 characters`}
              successMessage="Reason provided"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Information Box */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-accent-900 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Important Information
              </p>
              <ul className="text-xs text-accent-800 space-y-1 ml-6">
                <li>✓ Your leave request will be submitted for approval</li>
                <li>✓ You will receive a notification once it's reviewed</li>
                <li>✓ Do not submit overlapping leave requests</li>
                <li>✓ Ensure you have sufficient leave balance</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
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
                      className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Leave Request
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setValidationError(null);
                }}
                className="btn-secondary"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Recent Leave Requests */}
        {employeeLeaves && employeeLeaves.length > 0 && (
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Your Leave Requests</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {employeeLeaves.slice(0, 5).map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-start justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-secondary-900">{leave.leaveType}</p>
                    <p className="text-sm text-secondary-600">
                      {leave.startDate} to {leave.endDate}
                    </p>
                    {leave.reason && (
                      <p className="text-xs text-secondary-600 mt-1">{leave.reason}</p>
                    )}
                  </div>
                  <span
                    className={`badge whitespace-nowrap ml-4 ${
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
