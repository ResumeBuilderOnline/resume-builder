/**
 * ResumePreview - renders the active resume using the selected template,
 * paginated into strict A4 pages that correspond 1:1 to PDF pages.
 */
import React, { Suspense } from 'react';
import { getTemplateComponent, getTemplateConfig } from '../templates/templateRegistry.js';
import { createDefaultResume } from '../resume/resumeData.js';
import PaginatedResume from './PaginatedResume.jsx';

export default function ResumePreview({ resume, templateId }) {
  const Template = getTemplateComponent(templateId);
  const config = getTemplateConfig(templateId);
  const data = resume || createDefaultResume();

  return (
    <Suspense fallback={<div className="preview-loading">Loading template...</div>}>
      <PaginatedResume templateId={templateId} config={config}>
        <Template resume={data} />
      </PaginatedResume>
    </Suspense>
  );
}
