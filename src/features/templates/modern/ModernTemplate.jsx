/**
 * Modern template - two-column layout with accent color and subtle sidebar.
 * A4, margin 15mm, name 24pt, body 10pt, section 12pt.
 */
import React from 'react';
import { getDateRange, getContactItems, getLinkLabel } from '../../resume/resumeUtils.js';
import { sanitizeExternalUrl } from '../../../utils/security.js';
import CustomSections from '../../resume/components/CustomSections.jsx';

export default function ModernTemplate({ resume }) {
  const { personal, sections } = resume;
  const accent = resume.accentColor || '#000000';
  const contact = getContactItems(personal);

  return (
    <div className="modern-template">
      {/* Main column */}
      <div className="modern-main" data-flow="main">
        <header className="modern-header" data-block data-block-kind="header">
          <h1 className="modern-name" style={{ color: accent }}>
            {personal.fullName}
          </h1>
          {personal.jobTitle && <p className="modern-jobtitle">{personal.jobTitle}</p>}
          {contact.length > 0 && (
            <p className="modern-contact">{contact.join('  •  ')}</p>
          )}
        </header>

        {personal.careerObjectives && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Career Objective
            </h2>
          </section>
        )}
        {personal.careerObjectives && (
          <div className="modern-item" data-block data-block-kind="entry">
            <p className="modern-text">{personal.careerObjectives}</p>
          </div>
        )}


        {sections.experience.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Experience
            </h2>
          </section>
        )}
        {sections.experience.map((exp) => (
          <div className="modern-item" data-block data-block-kind="entry" key={exp.id}>
            <div className="modern-item-head">
              <strong>{exp.role}</strong>
              <span className="modern-date">{getDateRange(exp.startDate, exp.endDate)}</span>
            </div>
            <div className="modern-sub">
              {exp.company}
              {exp.location ? `, ${exp.location}` : ''}
            </div>
            {exp.description && <p className="modern-text">{exp.description}</p>}
            {exp.achievements?.length > 0 && (
              <ul className="modern-list">
                {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )}
          </div>
        ))}

        {sections.internships.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Internships
            </h2>
          </section>
        )}
        {sections.internships.map((int) => (
          <div className="modern-item" data-block data-block-kind="entry" key={int.id}>
            <div className="modern-item-head">
              <strong>{int.company}</strong>
              <span className="modern-date">{getDateRange(int.startDate, int.endDate)}</span>
            </div>
            <div className="modern-sub">
              {int.role}
              {int.location ? `, ${int.location}` : ''}
            </div>
            {int.description && <p className="modern-text">{int.description}</p>}
          </div>
        ))}


        {sections.projects.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Projects
            </h2>
          </section>
        )}
        {sections.projects.map((proj) => {
          const safeProjectUrl = sanitizeExternalUrl(proj.link);

          return (
            <div className="modern-item" data-block data-block-kind="entry" key={proj.id}>
              <div className="modern-item-head">
                <strong>{proj.title}</strong>

                {safeProjectUrl && (
                  <a
                    className="modern-link"
                    href={safeProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getLinkLabel(safeProjectUrl)}
                  </a>
                )}
              </div>
              {proj.technologies?.length > 0 && (
                <div className="modern-tech">{proj.technologies.join(' • ')}</div>
              )}
              {proj.description && <p className="modern-text">{proj.description}</p>}
            </div>
          );
        })}


        {sections.achievements.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Achievements
            </h2>
          </section>
        )}
        {sections.achievements.map((ach) => (
          <div className="modern-item" data-block data-block-kind="entry" key={ach.id}>
            <div className="modern-item-head">
              <span>{ach.title}</span>
              {ach.date && <span className="modern-date">{ach.date}</span>}
            </div>
            {ach.description && <p className="modern-text">{ach.description}</p>}
          </div>
        ))}

        
        {/* Custom sections (user-defined) */}
        <CustomSections sections={sections.custom} prefix="modern" />
      </div>


      {/* Sidebar */}
      <div className="modern-side" data-flow="side" style={{ backgroundColor: `${accent}0d` }}>
        {sections.skills.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Skills
            </h2>
          </section>
        )}

        {sections.skills.length > 0 && (
          <div className="modern-item" data-block data-block-kind="entry">
            <div className="modern-skills-vertical">
              {sections.skills.map((skill) => (
                <span className="modern-skill" key={skill.id}>• {skill.name}</span>
              ))}
            </div>
          </div>
        )}


        {sections.education.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Education
            </h2>
          </section>
        )}
        
        {sections.education.map((edu) => (
          <div className="modern-item" data-block data-block-kind="entry" key={edu.id}>
            
            <div className="modern-education-degree">
              <strong>{edu.degree}</strong>
            </div>

            {edu.fieldOfStudy && (
              <div className="modern-education-branch">
                <strong>{edu.fieldOfStudy}</strong>
              </div>
            )}

            <div className="modern-sub">
              {edu.school}
            </div>

            <div className="modern-date">
              {getDateRange(edu.startDate, edu.endDate)}
            </div>

          </div>
        ))}


        {sections.certificates.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Certifications
            </h2>
          </section>
        )}
        {sections.certificates.map((cert) => (
          <div className="modern-item" data-block data-block-kind="entry" key={cert.id}>
            <div className="modern-item-head">
              <span>{cert.name} – {cert.issuer}</span>
              <span className="modern-date">{cert.date}</span>

            </div>
          </div>
        ))}



        {sections.languages.length > 0 && (
          <section className="modern-section" data-block data-block-kind="heading">
            <h2 className="modern-section-title" style={{ color: accent }}>
              Languages
            </h2>
          </section>
        )}
        {sections.languages.length > 0 && (
          <div className="modern-item" data-block data-block-kind="entry">
            <p className="modern-text">
              {sections.languages
                .map((l) => `• ${l.proficiency ? `${l.name} (${l.proficiency})` : l.name}`)
                .join('    ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
