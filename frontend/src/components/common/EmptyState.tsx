import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface IEmptyStateProps {
    /** Icon to display (React node) */
    icon?: React.ReactNode;
    /** Title text */
    title: string;
    /** Description text */
    description?: string;
    /** Action button label */
    actionLabel?: string;
    /** Action button callback */
    onAction?: () => void;
}

/**
 * Reusable empty state component for when there's no data
 */
export const EmptyState: React.FC<IEmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col justify-center items-center py-12 text-center">
            <div className="text-gray-600 mb-4">
                {icon || <Inbox size={48} />}
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-gray-500 text-sm max-w-md mb-4">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
