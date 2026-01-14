import React from 'react';

interface ILoadingSpinnerProps {
    /** Size of the spinner: 'sm' (16px), 'md' (32px), 'lg' (48px) */
    size?: 'sm' | 'md' | 'lg';
    /** Optional message to display below the spinner */
    message?: string;
    /** Center the spinner in full height container */
    fullHeight?: boolean;
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({
    size = 'md',
    message,
    fullHeight = false,
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const containerClass = fullHeight
        ? 'flex flex-col justify-center items-center h-96'
        : 'flex flex-col justify-center items-center py-8';

    return (
        <div className={containerClass}>
            <div
                className={`${sizeClasses[size]} border-gray-600 border-t-yellow-500 rounded-full animate-spin`}
            />
            {message && (
                <p className="mt-4 text-gray-400 text-sm">{message}</p>
            )}
        </div>
    );
};
