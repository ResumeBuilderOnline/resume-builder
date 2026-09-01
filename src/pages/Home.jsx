import React from 'react';
import { Link } from 'react-router-dom';
import Heading from '../components/ui/Heading.jsx';
import { getAllTemplates } from '../features/templates/templateRegistry.js';
import { createSampleResume } from '../features/resume/resumeData.js';
import ResumePreview from '../features/preview/ResumePreview.jsx';

/**
 * Benefits shown in the "Why use our Resume Builder?" section.
 * Each benefit uses a lightweight inline SVG icon (no external deps).
 */
const benefits = [
  {
    title: 'Professional Templates',
    description:
      'Start with clean, recruiter-approved layouts designed for every career stage.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'ATS-Friendly Resumes',
    description:
      'Machine-readable, single-column output that parses cleanly through applicant tracking systems.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Live A4 Preview',
    description:
      'See a true-to-scale A4 preview update in real time as you type, exactly as it will print.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'One-Click PDF Export',
    description:
      'Download a polished, pixel-perfect PDF that matches your on-screen preview exactly.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
    ),
  },
];

/**
 * Hero / Landing page.
 *
 * This page is intentionally isolated from the Resume Builder. It reuses only
 * read-only preview components and routing Links, and never mutates resume
 * state. All styling is scoped with the `homep-` prefix to avoid affecting
 * the builder, templates, pagination, or PDF features.
 */
export default function Home() {
  const templates = getAllTemplates();
  const heroTemplateIds = ['modern', 'basic', 'ats'];

  return (
    <div className="homep">
      {/* ===== Hero ===== */}
      <header className="homep-hero">
        <div className="homep-hero-inner">
          <span className="homep-badge">Free online resume builder</span>
          <h1 className="homep-title">
            Create a <span className="homep-highlight">Professional Resume</span>{' '}
            Online in Minutes
          </h1>
          <p className="homep-subtitle">
            Create a professional, ATS-friendly resume online with modern templates,
            a live A4 preview, and one-click PDF download — no design skills needed.
          </p>
          <div className="homep-actions">
            <Link
              to="/builder"
              className="btn btn-primary btn-lg"
              aria-label="Create your professional resume online"
            >
              Create Your Resume
            </Link>
            <Link
              to="/templates"
              className="btn btn-outline btn-lg"
              aria-label="View professional resume templates"
            >
              View Templates
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Visual template previews ===== */}
      <section className="homep-visual">
        <div className="container">
          <Heading
            title="Professional Resume Templates"
            subtitle="Choose a professional resume template and customize it with our easy-to-use live editor."            align="center"
            className="mb-6"
          />
          <div className="homep-visual-grid">
            {heroTemplateIds.map((id) => {
              const meta = templates.find((t) => t.id === id);
              const sample = createSampleResume();
              return (
                <div className="homep-visual-card" key={id}>
                  <div className="homep-visual-preview">
                    <ResumePreview
                      resume={{ ...sample, templateId: id }}
                      templateId={id}
                    />
                  </div>
                  <div className="homep-visual-label">
                    <span className="homep-visual-dot" style={{ background: meta?.previewColor }} />
                    {meta?.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Why use our Resume Builder? ===== */}
      <section className="homep-benefits">
        <div className="container">
          <Heading
            title="Why Choose Our Resume Builder?"
            subtitle="Everything you need to land your next opportunity."
            align="center"
            className="mb-6"
          />
          <div className="homep-benefit-grid">
            {benefits.map((b) => (
              <div className="homep-benefit" key={b.title}>
                <div className="homep-benefit-icon">{b.icon}</div>
                <h3 className="homep-benefit-title">{b.title}</h3>
                <p className="homep-benefit-text">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Templates preview ===== */}
      <section className="homep-templates">
        <div className="container">
          <Heading
            title="Choose a Resume Template"
            subtitle="Choose from clean, professional, and ATS-friendly resume templates."
            align="center"
            className="mb-6"
          />
          <div className="homep-template-grid">
            {templates.map((t) => (
              <Link
                to="/templates"
                className="homep-template-card"
                key={t.id}
                aria-label={`View ${t.name} resume template`}
              >                <div
                  className="homep-template-preview"
                  style={{ backgroundColor: t.previewColor }}
                >
                  <span className="homep-template-name">{t.name}</span>
                </div>
                <div className="homep-template-body">
                  <h4>{t.name}</h4>
                  <p>{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="homep-cta">
        <div className="homep-cta-inner">
          <h2 className="homep-cta-title">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="homep-cta-text">
            Create an ATS-friendly resume in minutes with our easy-to-use online resume builder.
          </p>
          <Link
            to="/builder"
            className="btn btn-white btn-lg"
            aria-label="Create your professional resume online"
          >
            Create Your Resume
          </Link>
        </div>
      </section>

</div>
  );
}
