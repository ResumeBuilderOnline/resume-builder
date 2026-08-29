import React from 'react';

/**
 * Page/section heading component.
 */
export default function Heading({ title, subtitle, align = 'left', className = '' }) {
  return (
    <div className={`heading heading-${align} ${className}`}>
      <h2 className="heading-title">{title}</h2>
      {subtitle && <p className="heading-subtitle text-muted">{subtitle}</p>}
    </div>
  );
}
