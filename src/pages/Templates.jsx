import React from 'react';
import { Link } from 'react-router-dom';
import Heading from '../components/ui/Heading.jsx';
import { getAllTemplates } from '../features/templates/templateRegistry.js';
import ResumePreview from '../features/preview/ResumePreview.jsx';
import { useResume } from '../hooks/useResume.js';
import { createSampleResume } from '../features/resume/resumeData.js';

export default function Templates() {
  const { createResume } = useResume();
  const templates = getAllTemplates();

  const handleUseTemplate = (templateId) => {
    createResume({ templateId, title: `${templateId} Resume` });
  };

  return (
    <main className="templates-page">
      <div className="container">
        <Heading
          title="Choose a Resume Template"
          subtitle="Choose a professional, ATS-friendly resume template and customize it for your next job application."
          align="center"
          className="mt-6 mb-6"
        />

        <div className="template-grid">
          {templates.map((template) => {
            const sample = createSampleResume();

            return (
              <article
                className="template-showcase card"
                key={template.id}
              >
                <div
                  className="template-preview"
                  aria-label={`${template.name} resume template preview`}
                >
                  <ResumePreview
                    resume={{ ...sample, templateId: template.id }}
                    templateId={template.id}
                  />
                </div>

                <div className="template-showcase-body">
                  <h2>{template.name}</h2>

                  <p className="text-muted">
                    {template.description}
                  </p>

                  <div className="template-showcase-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUseTemplate(template.id)}
                      aria-label={`Use the ${template.name} resume template`}
                    >
                      Use Template
                    </button>

                    <Link
                      to="/builder"
                      className="btn btn-outline btn-sm"
                      state={{ templateId: template.id }}
                      aria-label={`Preview the ${template.name} resume template`}
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="templates-seo-content">
          <h2>Professional Resume Templates</h2>

          <p>
            Create a professional resume with our collection of clean,
            ATS-friendly resume templates. Choose a layout that fits your
            career goals, customize your information in the resume builder,
            preview your resume in real time, and download it as a PDF.
          </p>

          <p>
            Whether you are applying for your first job, an internship, or
            your next career opportunity, these resume templates provide a
            simple and professional starting point for your application.
          </p>

          <div className="templates-seo-actions">
            <Link
              to="/builder"
              className="btn btn-primary"
              aria-label="Create a resume using the online resume builder"
            >
              Create Your Resume
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}