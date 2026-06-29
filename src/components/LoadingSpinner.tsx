import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  };

  const textSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100">
      <div className={`${sizeClasses[size]} border-4 border-blue-400 border-t-transparent rounded-full animate-spin`}></div>
      {message && (
        <p className={`mt-4 text-gray-600 ${textSize[size]}`}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;