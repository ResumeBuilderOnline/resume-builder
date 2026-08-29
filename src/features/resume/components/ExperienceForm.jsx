import React from 'react';
import { TextInput, TextArea, DateInput, Checkbox } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function ExperienceForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

  const MAX_EXPERIENCE = 20;
  const addItem = () => {
    if (items.length >= MAX_EXPERIENCE) {
      return;
    }
    onChange([
      ...items,
      { id: generateId('exp'), company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [] },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Work Experience</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_EXPERIENCE} >
          + Add Experience
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No experience added yet.</p>}

      {items.map((item, index) => (
        <div className="form-card" key={item.id}>
          <div className="form-card-header">
            <span className="form-card-title">Experience #{index + 1}</span>
            <button type="button" className="btn-icon" onClick={() => removeItem(index)} title="Remove">
              ✕
            </button>
          </div>
          <div className="form-grid">
            <TextInput label="Company" value={item.company} onChange={(v) => updateItem(index, { company: v })} />
            <TextInput label="Role / Title" value={item.role} onChange={(v) => updateItem(index, { role: v })} />
            <TextInput label="Location" value={item.location} onChange={(v) => updateItem(index, { location: v })} />
          </div>
          <div className="form-grid">
            <DateInput label="Start Date" value={item.startDate} onChange={(v) => updateItem(index, { startDate: v })} />
            {!item.current && (
              <DateInput label="End Date" value={item.endDate} onChange={(v) => updateItem(index, { endDate: v })} />
            )}
            <div className="form-field">
              <Checkbox label="Currently working here" checked={item.current} onChange={(v) => updateItem(index, { current: v })} />
            </div>
          </div>
          <TextArea label="Description" value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={3} />
        </div>
      ))}
    </div>
  );
}
