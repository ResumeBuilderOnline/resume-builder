import React from 'react';
import { TextInput, DateInput } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function CertificationsForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

const MAX_CERTIFICATIONS = 30;
const addItem = () => {
    if (items.length >= MAX_CERTIFICATIONS) {
      return;
    }
    onChange([
      ...items,
      { id: generateId('cert'), name: '', issuer: '', date: '', link: '' },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Certifications</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_CERTIFICATIONS}>
          + Add Certification
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No certifications added yet.</p>}

      {items.map((item, index) => (
        <div className="form-card" key={item.id}>
          <div className="form-card-header">
            <span className="form-card-title">Certification #{index + 1}</span>
            <button type="button" className="btn-icon" onClick={() => removeItem(index)} title="Remove">
              ✕
            </button>
          </div>
          <div className="form-grid">
            <TextInput label="Certification Name" value={item.name} onChange={(v) => updateItem(index, { name: v })} />
            <TextInput label="Issuer" value={item.issuer} onChange={(v) => updateItem(index, { issuer: v })} />
          </div>
          <div className="form-grid">
            <DateInput label="Date" value={item.date} onChange={(v) => updateItem(index, { date: v })} />
            <TextInput label="Link" value={item.link} onChange={(v) => updateItem(index, { link: v })} />
          </div>
        </div>
      ))}
    </div>
  );
}
