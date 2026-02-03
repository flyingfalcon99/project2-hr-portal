import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

/**
 * 404 Not Found Page
 * Displays when user navigates to non-existent route
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            404
          </h1>
          <p className="text-3xl font-bold text-gray-900">Page Not Found</p>
        </div>

        {/* Error Message */}
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Helpful Links */}
        <div className="space-y-3 mb-8">
          <p className="text-gray-600 text-sm">Try these links instead:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Login
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Home
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
