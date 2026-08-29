/**
 * Editable form fields for the resume builder.
 */
import React from 'react';
import { generateId } from '../../../utils/helpers.js';

export function TextInput({ label, value, onChange, placeholder, type = 'text', id, maxLength = 200 }) {
  const fieldId = id || generateId('input');
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        className="form-input"
        value={value || ''}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, id, maxLength = 5000}) {
  const fieldId = id || generateId('textarea');
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={fieldId}>
        {label}
      </label>
      <textarea
        id={fieldId}
        className="form-input"
        value={value || ''}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function NumberInput({ label, value, onChange, min, max }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        type="number"
        className="form-input"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function DateInput({ label, value, onChange }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <input
        type="month"
        className="form-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function SelectInput({ label, value, onChange, options = [] }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <select
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="form-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
