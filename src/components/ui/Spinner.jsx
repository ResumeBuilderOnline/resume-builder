import React from 'react';

/**
 * Spinner/loading indicator.
 */
export default function Spinner({ size = 'md', text }) {
  return (
    <div className="spinner-wrap">
      <div className={`spinner spinner-${size}`} />
      {text && <p className="spinner-text text-muted">{text}</p>}
    </div>
  );
}
