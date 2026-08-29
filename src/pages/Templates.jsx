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
    <div className="templates-page">
      <div className="container">
        <Heading
          title="Choose a Template"
          subtitle="Start with a professionally designed layout and make it your own."
          align="center"
          className="mt-6 mb-6"
        />

        <div className="template-grid">
          {templates.map((template) => {
            const sample = createSampleResume();
            return (
              <div className="template-showcase card" key={template.id}>
                <div className="template-preview">
                  <ResumePreview
                    resume={{ ...sample, templateId: template.id }}
                    templateId={template.id}
                  />
                </div>
                <div className="template-showcase-body">
                  <h3>{template.name}</h3>
                  <p className="text-muted">{template.description}</p>
                  <div className="template-showcase-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </button>
                    <Link
                      to="/builder"
                      className="btn btn-outline btn-sm"
                      state={{ templateId: template.id }}
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
