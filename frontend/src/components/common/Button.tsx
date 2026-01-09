import React from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button component tái sử dụng với các variants khác nhau
 */
export const Button: React.FC<IButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClass =
    'font-semibold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClass = {
    primary: 'bg-yellow-500 text-black hover:bg-yellow-600 active:bg-yellow-700',
    secondary:
      'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    outline:
      'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? '...Loading' : children}
    </button>
  );
};
