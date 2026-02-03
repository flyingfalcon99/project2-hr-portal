import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

/**
 * 500 Server Error Page
 * Displays when server error occurs
 */
const ServerErrorPage = ({ error = null }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* 500 Illustration */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            500
          </h1>
          <p className="text-3xl font-bold text-gray-900">Server Error</p>
        </div>

        {/* Error Message */}
        <p className="text-gray-600 text-lg mb-8">
          Something went wrong on our end. Our team has been notified and is working on fixing the issue. Please try again later.
        </p>

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-32 h-32 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4v2m0 5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Details (Development only) */}
        {import.meta.env.DEV && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-red-900 mb-2">Error Details:</p>
            <p className="text-xs font-mono text-red-800 break-words">
              {error.message || error.toString()}
            </p>
          </div>
        )}

        {/* Status Messages */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-xs text-blue-900">
            <strong>What you can try:</strong>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Refresh the page</li>
              <li>Clear your browser cache</li>
              <li>Try again in a few minutes</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Refresh Page
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Go Home
          </Button>
        </div>

        {/* Contact Support */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a
              href="mailto:support@hrportal.com"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
