import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface IErrorMessageProps {
    /** Error message to display */
    message: string;
    /** Optional retry callback */
    onRetry?: () => void;
    /** Center in full height container */
    fullHeight?: boolean;
}

/**
 * Reusable error message component with optional retry button
 */
export const ErrorMessage: React.FC<IErrorMessageProps> = ({
    message,
    onRetry,
    fullHeight = false,
}) => {
    const containerClass = fullHeight
        ? 'flex flex-col justify-center items-center h-96'
        : 'flex flex-col justify-center items-center py-8';

    return (
        <div className={containerClass}>
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 text-lg mb-4 text-center max-w-md">
                {message}
            </p>
            {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                    <RefreshCw size={16} className="mr-2" />
                    Try Again
                </Button>
            )}
        </div>
    );
};
