import React from 'react';
import { TextInput, TextArea } from './FormFields.jsx';

export default function PersonalInfoForm({ personal, onChange }) {
  const update = (field) => (value) => onChange({ ...personal, [field]: value });

  return (
    <div className="form-section">
      <h3 className="form-section-title">Personal Information</h3>
      <div className="form-grid">
        <TextInput label="Full Name" value={personal.fullName} onChange={update('fullName')} placeholder="John Doe" maxLength={100} />
        <TextInput label="Job Title" value={personal.jobTitle} onChange={update('jobTitle')} placeholder="Software Engineer" maxLength={150} />
        <TextInput label="Email" type="email" value={personal.email} onChange={update('email')} placeholder="john@email.com" maxLength={254} />
        <TextInput label="Phone" value={personal.phone} onChange={update('phone')} placeholder="+1 555 000 0000" maxLength={30} />
        <TextInput label="Address" value={personal.address} onChange={update('address')} placeholder="123 Main St" maxLength={300} />
        <TextInput label="City, State" value={personal.city} onChange={update('city')} placeholder="New York, NY" maxLength={150} />
        <TextInput label="Postal Code" value={personal.postalCode} onChange={update('postalCode')} placeholder="10001" maxLength={20} />
        <TextInput label="Website" value={personal.website} onChange={update('website')} placeholder="johndoe.com" maxLength={2048} />
        <TextInput label="LinkedIn" value={personal.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/in/johndoe" maxLength={2048} />
        <TextInput label="GitHub" value={personal.github} onChange={update('github')} placeholder="github.com/johndoe" maxLength={2048} />
      </div>
      <TextArea
        label="Career Objectives"
        value={personal.careerObjectives}
        onChange={update('careerObjectives')}
        rows={4}
        maxLength={3000}
        placeholder="Write a brief statement of your career objectives..."
      />
    </div>
  );
}
