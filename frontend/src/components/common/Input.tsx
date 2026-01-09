import React from 'react';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input component tái sử dụng với error handling
 */
export const Input: React.FC<IInputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-gray-800 border-2 border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-yellow-500 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
      {helperText && !error && (
        <span className="text-sm text-gray-400">{helperText}</span>
      )}
    </div>
  );
};
