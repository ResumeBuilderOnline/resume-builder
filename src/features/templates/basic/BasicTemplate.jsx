/**
 * Basic template - clean, minimal, professional single-column.
 * A4, margin 17mm. Renders only available content (no placeholders).
 */
import React from 'react';
import { getDateRange, getContactItems, getLinkLabel } from '../../resume/resumeUtils.js';
import { sanitizeExternalUrl } from '../../../utils/security.js';
import CustomSections from '../../resume/components/CustomSections.jsx';

export default function BasicTemplate({ resume }) {
  const { personal, sections } = resume;
  const contact = getContactItems(personal);

  return (
    <div className="basic-template" data-flow="main">
      {/* Header */}
      <header className="basic-header" data-block data-block-kind="header">
        <h1 className="basic-name">{personal.fullName}</h1>
        {personal.jobTitle && <p className="basic-jobtitle">{personal.jobTitle}</p>}
        {contact.length > 0 && (
          <p className="basic-contact">{contact.join('  •  ')}</p>
        )}
      </header>

      {/* Career Objective */}
      {personal.careerObjectives && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Career Objective</h2>
        </section>
      )}
      {personal.careerObjectives && (
        <div className="basic-block" data-block data-block-kind="entry">
          <p className="basic-text">{personal.careerObjectives}</p>
        </div>
      )}


      {/* Education */}
      {sections.education.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Education</h2>
        </section>
      )}
      {sections.education.map((edu) => (
        <div className="basic-item" data-block data-block-kind="entry" key={edu.id}>
          <div className="basic-item-head">
            <strong>
              {edu.degree}
            </strong>
            <div className="basic-education-branch">
              {edu.branch}
            </div>
            <span className="basic-date">{getDateRange(edu.startDate, edu.endDate)}</span>
          </div>
          <div className="basic-sub">
            {edu.school}
            {edu.location ? `, ${edu.location}` : ''}
          </div>
        </div>
      ))}


      {/* Skills */}
      {sections.skills.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Skills</h2>
        </section>
      )}
      {sections.skills.length > 0 && (
        <div className="basic-block" data-block data-block-kind="entry">
          <p className="basic-text">
            {sections.skills.map((s) => s.name).join('  •  ')}
          </p>
        </div>
      )}


      {/* Experience */}
      {sections.experience.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Experience</h2>
        </section>
      )}
      {sections.experience.map((exp) => (
        <div className="basic-item" data-block data-block-kind="entry" key={exp.id}>
          <div className="basic-item-head">
            <strong>{exp.role}</strong>
            <span className="basic-date">{getDateRange(exp.startDate, exp.endDate)}</span>
          </div>
          <div className="basic-sub">
            {exp.company}
            {exp.location ? `, ${exp.location}` : ''}
          </div>
          {exp.description && <p className="basic-text">{exp.description}</p>}
          {exp.achievements?.length > 0 && (
            <ul className="basic-list">
              {exp.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      ))}


      {/* Internships */}
      {sections.internships.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Internships</h2>
        </section>
      )}
      {sections.internships.map((int) => (
        <div className="basic-item" data-block data-block-kind="entry" key={int.id}>
          <div className="basic-item-head">
            <strong>{int.company}</strong>
            <span className="basic-date">{getDateRange(int.startDate, int.endDate)}</span>
          </div>
          <div className="basic-sub">
            {int.role}
            {int.location ? `, ${int.location}` : ''}
          </div>
          {int.description && <p className="basic-text">{int.description}</p>}
        </div>
      ))}


      {/* Projects */}
      {sections.projects.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Projects</h2>
        </section>
      )}
      {sections.projects.map((proj) => {
        const safeProjectUrl = sanitizeExternalUrl(proj.link);

        return (
          <div
            className="basic-item"
            data-block
            data-block-kind="entry"
            key={proj.id}
          >
            <div className="basic-item-head">
              <strong>{proj.title}</strong>

              {safeProjectUrl && (
                <a
                  className="basic-link"
                  href={safeProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getLinkLabel(safeProjectUrl)}
                </a>
              )}
            </div>

            {proj.technologies?.length > 0 && (
              <div className="basic-tech">
                {proj.technologies.join(' • ')}
              </div>
            )}

            {proj.description && (
              <p className="basic-text">{proj.description}</p>
            )}
          </div>
        );
      })}


      {/* Certifications */}
      {sections.certificates.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Certifications</h2>
        </section>
      )}
      {sections.certificates.map((cert) => (
        <div className="basic-item" data-block data-block-kind="entry" key={cert.id}>
          <div className="basic-item-head">
            <span>{cert.name} – {cert.issuer}</span>
            
            <span className="basic-date">{cert.date}</span>
          </div>
        </div>
      ))}


      {/* Achievements */}
      {sections.achievements.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Achievements</h2>
        </section>
      )}
      {sections.achievements.map((ach) => (
        <div className="basic-item" data-block data-block-kind="entry" key={ach.id}>
          <div className="basic-item-head">
            <span>{ach.title}</span>
            {ach.date && <span className="basic-date">{ach.date}</span>}
          </div>
          {ach.description && <p className="basic-text">{ach.description}</p>}
        </div>
      ))}


{/* Languages */}
      {sections.languages.length > 0 && (
        <section className="basic-section" data-block data-block-kind="heading">
          <h2 className="basic-section-title">Languages</h2>
        </section>
      )}
      {sections.languages.length > 0 && (
        <div className="basic-block" data-block data-block-kind="entry">
          <p className="basic-text">
            {sections.languages
              .map((l) => `• ${l.proficiency ? `${l.name} (${l.proficiency})` : l.name}`)
              .join('  ')}
          </p>
        </div>
      )}

      {/* Custom sections (user-defined) */}
      <CustomSections sections={sections.custom} prefix="basic" />
    </div>
  );
}
