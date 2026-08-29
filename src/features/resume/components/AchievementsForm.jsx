import React from 'react';
import { TextInput, TextArea, DateInput } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function AchievementsForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

const MAX_ACHIEVEMENTS = 30;
const addItem = () => {
  if (items.length >= MAX_ACHIEVEMENTS) {
    return;
  }
    onChange([
      ...items,
      { id: generateId('ach'), title: '', description: '', date: '' },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Achievements</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_ACHIEVEMENTS}>
          + Add Achievement
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No achievements added yet.</p>}

      {items.map((item, index) => (
        <div className="form-card" key={item.id}>
          <div className="form-card-header">
            <span className="form-card-title">Achievement #{index + 1}</span>
            <button type="button" className="btn-icon" onClick={() => removeItem(index)} title="Remove">
              ✕
            </button>
          </div>
          <div className="form-grid">
            <TextInput label="Title" value={item.title} onChange={(v) => updateItem(index, { title: v })} />
            <DateInput label="Date" value={item.date} onChange={(v) => updateItem(index, { date: v })} />
          </div>
          <TextArea label="Description" value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={2} />
        </div>
      ))}
    </div>
  );
}
