import React from 'react';

/**
 * Card component for wrapping content.
 */
export default function Card({ children, className = '', clickable = false, onClick }) {
  return (
    <div
      className={`card ${clickable ? 'card-clickable' : ''} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
}
