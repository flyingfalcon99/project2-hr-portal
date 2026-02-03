/**
 * LoadingSpinner Component
 * Displays animated loading indicators with optional message
 */
const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  overlay = false,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Spinner Animation */}
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        ></div>
      </div>

      {/* Message */}
      {message && (
        <p className="text-gray-700 font-medium text-sm text-center">{message}</p>
      )}

      {/* Animated dots */}
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-blue-600 rounded-full"
          style={{
            animation: 'bounce 1.4s infinite',
            animationDelay: '0s',
          }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full"
          style={{
            animation: 'bounce 1.4s infinite',
            animationDelay: '0.2s',
          }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full"
          style={{
            animation: 'bounce 1.4s infinite',
            animationDelay: '0.4s',
          }}
        ></div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={containerClasses}>
        {overlay && (
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        )}
        <div className="relative z-10 bg-white rounded-lg shadow-lg p-8">
          {spinner}
        </div>
      </div>
    );
  }

  return <div className={containerClasses}>{spinner}</div>;
};

export default LoadingSpinner;
