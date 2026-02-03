import { useEffect, useState } from 'react';
import { isOnline, waitForNetwork } from '../utils/errorHandler';

/**
 * NetworkStatus Component
 * Displays network connectivity status with visual indicator
 */
const NetworkStatus = ({ position = 'bottom', showOnline = false }) => {
  const [online, setOnline] = useState(isOnline());
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setOnline(isOnline());

    // Handle online event
    const handleOnline = () => {
      setOnline(true);
      setWasOffline(false);
    };

    // Handle offline event
    const handleOffline = () => {
      setOnline(false);
      setWasOffline(true);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show when online unless explicitly requested
  if (online && !showOnline) {
    return null;
  }

  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (online) {
    return (
      <div className={`fixed ${positionClasses[position]} px-4 py-2 z-40 transition-all duration-300`}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 max-w-xs mx-auto">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">You are back online</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} px-4 py-2 z-40`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 max-w-xs mx-auto shadow-lg">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-red-800">No internet connection</span>
      </div>
    </div>
  );
};

export default NetworkStatus;
