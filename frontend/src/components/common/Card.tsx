import React from 'react';

interface ICardProps {
    /** Card variant */
    variant?: 'default' | 'elevated' | 'bordered' | 'interactive';
    /** Additional CSS classes */
    className?: string;
    /** Card content */
    children: React.ReactNode;
    /** Click handler for interactive cards */
    onClick?: () => void;
}

/**
 * Reusable card component with multiple variants
 */
export const Card: React.FC<ICardProps> = ({
    variant = 'default',
    className = '',
    children,
    onClick,
}) => {
    const baseClasses = 'rounded-lg';

    const variantClasses = {
        default: 'bg-gray-900 p-4',
        elevated: 'bg-gray-900 p-4 shadow-lg shadow-black/50',
        bordered: 'bg-gray-900 border border-gray-700 p-4',
        interactive:
            'bg-gray-900 border border-gray-700 p-4 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer',
    };

    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </Component>
    );
};
