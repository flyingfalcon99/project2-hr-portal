import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/store/hooks';

export default function Unauthorized() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-danger-50 to-danger-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-100 rounded-full">
            <svg
              className="w-8 h-8 text-danger-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-danger-900 mb-4">Access Denied</h1>
        <p className="text-lg text-danger-700 mb-6">
          You do not have permission to access this page.
        </p>

        {/* Details */}
        <div className="card mb-8 bg-white border-l-4 border-danger-600">
          <p className="text-secondary-700 mb-2">
            <strong>Your Role:</strong> {currentUser?.role ? currentUser.role.toUpperCase() : 'Unknown'}
          </p>
          <p className="text-sm text-secondary-600">
            This page is restricted to authorized users only. If you believe this is an error, please contact
            the HR department.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline">
            Go Back
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-secondary-600 mt-8">
          © 2024 HR Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
