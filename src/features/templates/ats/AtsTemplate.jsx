/**
 * ATS template - machine-readable, single-column, plain text.
 * A4, margin 18mm, name 20pt, body 10pt, section 11pt.
 * No columns, no icons, no decorative chips, standard section names.
 */
import React from 'react';
import { getDateRange, getLinkLabel, getContactItems } from '../../resume/resumeUtils.js';
import CustomSections from '../../resume/components/CustomSections.jsx';

export default function AtsTemplate({ resume }) {
  const { personal, sections } = resume;
  const accent = resume.accentColor || '#000000';
  const contact = getContactItems(personal);

  return (
    <div className="ats-template" data-flow="main">
      <header className="ats-header" data-block data-block-kind="header">
        <h1 className="ats-name">{personal.fullName}</h1>
        {personal.jobTitle && <p className="ats-jobtitle">{personal.jobTitle}</p>}
        {contact.length > 0 && (
          <p className="ats-contact">{contact.join('  |  ')}</p>
        )}
      </header>
      <div className="ats-rule" style={{ backgroundColor: accent }} />

      {personal.careerObjectives && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            CAREER OBJECTIVE
          </h2>
        </section>
      )}
      {personal.careerObjectives && (
        <div className="ats-item" data-block data-block-kind="entry">
          <p className="ats-text">{personal.careerObjectives}</p>
        </div>
      )}

      {sections.education.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Education
          </h2>
        </section>
      )}
      {sections.education.map((edu) => (
        <div className="ats-item" data-block data-block-kind="entry" key={edu.id}>
          <div className="ats-item-head">
            <strong>{edu.school}</strong>
            <span className="ats-date">{getDateRange(edu.startDate, edu.endDate)}</span>
          </div>
          <div className="ats-sub">
            <div>{edu.degree}</div>

            {edu.fieldOfStudy && (
              <div>{edu.fieldOfStudy}</div>
            )}
          </div>
        </div>
      ))}

      {sections.skills.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Skills
          </h2>
        </section>
      )}

      {sections.skills.length > 0 && (
        <div className="ats-item" data-block data-block-kind="entry">
          <div className="ats-text">
            {sections.skills.map((s) => (
              <div key={s.id}>• {s.name}</div>
            ))}
          </div>
        </div>
      )}

      {sections.experience.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Experience
          </h2>
        </section>
      )}
      {sections.experience.map((exp) => (
        <div className="ats-item" data-block data-block-kind="entry" key={exp.id}>
          <div className="ats-item-head">
            <strong>{exp.role}</strong>
            <span className="ats-date">{getDateRange(exp.startDate, exp.endDate)}</span>
          </div>
          <div className="ats-sub">
            {exp.company}
            {exp.location ? ` — ${exp.location}` : ''}
          </div>
          {exp.description && <p className="ats-text">{exp.description}</p>}
          {exp.achievements?.length > 0 && (
            <ul className="ats-list">
              {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          )}
        </div>
      ))}

      {sections.internships.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Internships
          </h2>
        </section>
      )}
      {sections.internships.map((int) => (
        <div className="ats-item" data-block data-block-kind="entry" key={int.id}>
          <div className="ats-item-head">
            <strong>{int.company}</strong>
            <span className="ats-date">{getDateRange(int.startDate, int.endDate)}</span>
          </div>
          <div className="ats-sub">
            <strong>{int.role}</strong>
            {int.location ? ` — ${int.location}` : ''}
          </div>
          {int.description && <p className="ats-text">{int.description}</p>}
        </div>
      ))}

      {sections.projects.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Projects
          </h2>
        </section>
      )}
      {sections.projects.map((proj) => (
        <div className="ats-item" data-block data-block-kind="entry" key={proj.id}>
          <div className="ats-item-head">
       
            <strong>{proj.title}</strong>
            {proj.link && <span className="ats-sub">{getLinkLabel(proj.link)}</span>}
          </div>
          {proj.technologies?.length > 0 && (
            <div className="ats-sub">Technologies: {proj.technologies.join(', ')}</div>
          )}
          {proj.description && <p className="ats-text">{proj.description}</p>}
        </div>
      ))}

      {sections.certificates.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Certifications
          </h2>
        </section>
      )}
      {sections.certificates.map((cert) => (
        <div className="ats-item" data-block data-block-kind="entry" key={cert.id}>
          <div className="ats-item-head">
            <span>{cert.name} – {cert.issuer}</span>
            <span className="ats-date">{cert.date}</span>
          </div>
        </div>
      ))}

      {sections.achievements.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Achievements
          </h2>
        </section>
      )}
      {sections.achievements.map((ach) => (
        <div className="ats-item" data-block data-block-kind="entry" key={ach.id}>
          <div className="ats-item-head">
            <span>{ach.title}</span>
            {ach.date && <span className="ats-date">{ach.date}</span>}
          </div>
          {ach.description && <p className="ats-text">{ach.description}</p>}
        </div>
      ))}

      {sections.languages.length > 0 && (
        <section className="ats-section" data-block data-block-kind="heading">
          <h2 className="ats-section-title" style={{ color: accent }}>
            Languages
          </h2>
        </section>
      )}
      {sections.languages.length > 0 && (
        <div className="ats-item" data-block data-block-kind="entry">
          <div className="ats-text">
            {sections.languages.map((l) => (
              <div key={l.id}>
                • {l.proficiency ? `${l.name} (${l.proficiency})` : l.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom sections (user-defined) */}
      <CustomSections sections={sections.custom} prefix="ats" />
    </div>
  );
}
