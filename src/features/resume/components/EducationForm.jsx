import React from 'react';
import { TextInput, DateInput, Checkbox, TextArea } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function EducationForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

const MAX_EDUCATION = 10;
const addItem = () => {
    if (items.length >= MAX_EDUCATION) {
      return;
    }
    onChange([
      ...items,
      { id: generateId('edu'), school: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', present: false, description: '' },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Education</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_EDUCATION} >
          + Add Education
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No education added yet.</p>}

      {items.map((item, index) => (
        <div className="form-card" key={item.id}>
          <div className="form-card-header">
            <span className="form-card-title">Education #{index + 1}</span>
            <button type="button" className="btn-icon" onClick={() => removeItem(index)} title="Remove">
              ✕
            </button>
          </div>
          <div className="form-grid">
            <TextInput label="School" value={item.school} onChange={(v) => updateItem(index, { school: v })} />
            <TextInput label="Degree" value={item.degree} onChange={(v) => updateItem(index, { degree: v })} />
            <TextInput label="Field of Study" value={item.fieldOfStudy} onChange={(v) => updateItem(index, { fieldOfStudy: v })} />
            <TextInput label="Location" value={item.location} onChange={(v) => updateItem(index, { location: v })} />
          </div>
          <div className="form-grid">
            <DateInput label="Start Date" value={item.startDate} onChange={(v) => updateItem(index, { startDate: v })} />
            {!item.present && (
              <DateInput label="End Date" value={item.endDate} onChange={(v) => updateItem(index, { endDate: v })} />
            )}
            <div className="form-field">
              <Checkbox label="Currently studying here" checked={item.present} onChange={(v) => updateItem(index, { present: v })} />
            </div>
          </div>
          <TextArea label="Description" value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={2} />
        </div>
      ))}
    </div>
  );
}
