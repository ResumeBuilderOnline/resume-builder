/**
 * Professional (ATS) template - formal, single-column, ATS-optimized.
 * Spec: A4, margin 18mm, name 20pt, body 10pt, section 11pt,
 * no columns, no icons, no graphics.
 */
import React from 'react';
import { getDateRange } from '../../resume/resumeUtils.js';

export default function ProfessionalTemplate({ resume }) {
  const { personal, sections } = resume;
  const accent = resume.accentColor || '#000000';

  return (
    <div className="resume-page ats-template">
      <header className="ats-header">
        <h1 className="ats-name">{personal.fullName || 'Your Name'}</h1>
        {personal.jobTitle && <p className="ats-jobtitle">{personal.jobTitle}</p>}
        <p className="ats-contact">
          {[personal.email, personal.phone, personal.city, personal.website]
            .filter(Boolean)
            .join('  |  ')}
        </p>
      </header>
      <div className="ats-rule" style={{ backgroundColor: accent }} />

      {personal.careerObjectives && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Career Objectives
          </h2>
          <p className="ats-text">{personal.careerObjectives}</p>
        </section>
      )}

      {sections.experience.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Professional Experience
          </h2>
          {sections.experience.map((exp) => (
            <div className="ats-item" key={exp.id}>
              <div className="ats-item-head">
                <strong>{exp.role}</strong>
                <span className="ats-date">
                  {getDateRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              <div className="ats-sub">
                {exp.company}
                {exp.location ? ` — ${exp.location}` : ''}
              </div>
              {exp.description && <p className="ats-text">{exp.description}</p>}
              {exp.achievements?.length > 0 && (
                <ul className="ats-list">
                  {exp.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {sections.internships.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Internships
          </h2>
          {sections.internships.map((int) => (
            <div className="ats-item" key={int.id}>
              <div className="ats-item-head">
                <strong>{int.role}</strong>
                <span className="ats-date">
                  {getDateRange(int.startDate, int.endDate)}
                </span>
              </div>
              <div className="ats-sub">
                {int.company}
                {int.location ? ` — ${int.location}` : ''}
              </div>
              {int.description && <p className="ats-text">{int.description}</p>}
            </div>
          ))}
        </section>
      )}

      {sections.education.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Education
          </h2>
          {sections.education.map((edu) => (
            <div className="ats-item" key={edu.id}>
              <div className="ats-item-head">
                <strong>{edu.school}</strong>
                <span className="ats-date">
                  {getDateRange(edu.startDate, edu.endDate)}
                </span>
              </div>
              <div className="ats-sub">
                {edu.degree}
                {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
              </div>
            </div>
          ))}
        </section>
      )}

      {sections.skills.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Skills
          </h2>
          <p className="ats-text">
            {sections.skills.map((skill) => skill.name).join(', ')}
          </p>
        </section>
      )}

      {sections.projects.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Projects
          </h2>
          {sections.projects.map((proj) => (
            <div className="ats-item" key={proj.id}>
              <div className="ats-item-head">
                <strong>{proj.title}</strong>
                {proj.link && <span className="ats-sub">{proj.link}</span>}
              </div>
              {proj.description && <p className="ats-text">{proj.description}</p>}
              {proj.technologies?.length > 0 && (
                <p className="ats-sub">
                  Technologies: {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {sections.certificates.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Certifications
          </h2>
          {sections.certificates.map((cert) => (
            <div className="ats-item" key={cert.id}>
              <div className="ats-item-head">
                <strong>{cert.name}</strong>
                <span className="ats-date">{cert.date}</span>
              </div>
              <div className="ats-sub">{cert.issuer}</div>
            </div>
          ))}
        </section>
      )}

      {sections.achievements.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Achievements
          </h2>
          {sections.achievements.map((ach) => (
            <div className="ats-item" key={ach.id}>
              <div className="ats-item-head">
                <strong>{ach.title}</strong>
                {ach.date && <span className="ats-date">{ach.date}</span>}
              </div>
              {ach.description && <p className="ats-text">{ach.description}</p>}
            </div>
          ))}
        </section>
      )}

      {sections.languages.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Languages
          </h2>
          <ul className="ats-list">
            {sections.languages.map((lang) => (
              <li key={lang.id}>
                {lang.name} — {lang.proficiency}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
