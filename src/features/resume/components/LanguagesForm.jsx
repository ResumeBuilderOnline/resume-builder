import React from 'react';
import { TextInput, SelectInput } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

const proficiencyLevels = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic',
];

export default function LanguagesForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

const MAX_LANGUAGES = 20;
const addItem = () => {
  if (items.length >= MAX_LANGUAGES) {
    return;
  }
    onChange([
      ...items,
      { id: generateId('lang'), name: '', proficiency: 'Fluent' },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Languages</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_LANGUAGES} >
          + Add Language
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No languages added yet.</p>}

      {items.map((item, index) => (
        <div className="form-row" key={item.id}>
          <TextInput
            label="Language"
            value={item.name}
            onChange={(v) => updateItem(index, { name: v })}
            placeholder="e.g. English"
          />
          <SelectInput
            label="Proficiency"
            value={item.proficiency}
            onChange={(v) => updateItem(index, { proficiency: v })}
            options={proficiencyLevels}
          />
          <button type="button" className="btn-icon btn-icon-top" onClick={() => removeItem(index)} title="Remove">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
