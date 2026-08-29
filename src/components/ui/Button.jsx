import React from 'react';

/**
 * Primary button component.
 */
export function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', onClick, disabled }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
