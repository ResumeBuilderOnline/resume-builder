import React from 'react';
import { TextInput } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function SkillsForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

const MAX_SKILLS = 50;
const addItem = () => {
    if (items.length >= MAX_SKILLS) {
      return;
    }
    onChange([...items, { id: generateId('skill'), name: '', level: 3 }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Skills</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_SKILLS}>
          + Add Skill
        </button>
      </div>

      {items.map((item, index) => (
        <div className="form-row" key={item.id}>
          <TextInput
            label="Skill"
            value={item.name}
            onChange={(v) => updateItem(index, { name: v })}
            placeholder="e.g. React"
          />
          <div className="form-field form-field-shrink">
            <label className="form-label">Level</label>
            <select
              className="form-input"
              value={item.level}
              onChange={(e) => updateItem(index, { level: Number(e.target.value) })}
            >
              <option value={1}>Beginner</option>
              <option value={2}>Basic</option>
              <option value={3}>Intermediate</option>
              <option value={4}>Advanced</option>
              <option value={5}>Expert</option>
            </select>
          </div>
          <button type="button" className="btn-icon btn-icon-top" onClick={() => removeItem(index)} title="Remove">
            ✕
          </button>
        </div>
      ))}

      {items.length === 0 && <p className="text-muted">No skills added yet.</p>}
    </div>
  );
}
