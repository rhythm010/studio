import React from 'react';

interface ErrorBannerProps {
  errorMessage: string | null;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="bg-red-500 text-white p-3 rounded-md mb-4">
      <p className="text-center">{errorMessage}</p>
    </div>
  );
};

export default ErrorBanner;