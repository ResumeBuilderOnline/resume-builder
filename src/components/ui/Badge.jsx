import React from 'react';

/**
 * Badge/pill component for small labels.
 */
export default function Badge({ children, color = 'primary', className = '' }) {
  return <span className={`badge badge-${color} ${className}`}>{children}</span>;
}
