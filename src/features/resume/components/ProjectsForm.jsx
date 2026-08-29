import React from 'react';
import { TextInput, TextArea, DateInput } from './FormFields.jsx';
import { generateId } from '../../../utils/helpers.js';

export default function ProjectsForm({ items, onChange }) {
  const updateItem = (index, updates) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...updates } : item));
    onChange(next);
  };

  const MAX_PROJECTS = 20;
  const addItem = () => {
    if (items.length >= MAX_PROJECTS) {
      return;
    }
    onChange([
      ...items,
      { id: generateId('proj'), title: '', description: '', link: '', technologies: [], startDate: '', endDate: '' },
    ]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">Projects</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addItem} disabled={items.length >= MAX_PROJECTS} >
          + Add Project
        </button>
      </div>

      {items.length === 0 && <p className="text-muted">No projects added yet.</p>}

      {items.map((item, index) => (
        <div className="form-card" key={item.id}>
          <div className="form-card-header">
            <span className="form-card-title">Project #{index + 1}</span>
            <button type="button" className="btn-icon" onClick={() => removeItem(index)} title="Remove">
              ✕
            </button>
          </div>
          <div className="form-grid">
            <TextInput label="Project Title" value={item.title} onChange={(v) => updateItem(index, { title: v })} maxLength={150} />
            <TextInput label="Link" value={item.link} onChange={(v) => updateItem(index, { link: v })} maxLength={2048} />
          </div>
          <div className="form-grid">
            <DateInput label="Start Date" value={item.startDate} onChange={(v) => updateItem(index, { startDate: v })} />
            <DateInput label="End Date" value={item.endDate} onChange={(v) => updateItem(index, { endDate: v })} />
          </div>
          <TextArea label="Description" value={item.description} onChange={(v) => updateItem(index, { description: v })} rows={3} maxLength={5000}/>
          <div className="form-field">
            <label className="form-label">Technologies (comma separated)</label>
            <TextInput
              label=""
              value={(item.technologies || []).join(', ')}
              onChange={(v) =>
                updateItem(index, {
                  technologies: v.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="React, Node.js, MongoDB"
              maxLength={500}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
