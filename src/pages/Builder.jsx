import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../hooks/useResume.js';
import ResumePreview from '../features/preview/ResumePreview.jsx';
import PersonalInfoForm from '../features/resume/components/PersonalInfoForm.jsx';
import ExperienceForm from '../features/resume/components/ExperienceForm.jsx';
import InternshipForm from '../features/resume/components/InternshipForm.jsx';
import EducationForm from '../features/resume/components/EducationForm.jsx';
import SkillsForm from '../features/resume/components/SkillsForm.jsx';
import ProjectsForm from '../features/resume/components/ProjectsForm.jsx';
import CertificationsForm from '../features/resume/components/CertificationsForm.jsx';
import AchievementsForm from '../features/resume/components/AchievementsForm.jsx';
import LanguagesForm from '../features/resume/components/LanguagesForm.jsx';
import { getAllTemplates } from '../features/templates/templateRegistry.js';
import { exportResumeToPDF } from '../features/pdf/pdfService.js';
import { getProfileCompleteness } from '../features/resume/resumeUtils.js';

const tabs = [
  { id: 'personal', label: 'Personal' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'internships', label: 'Internships' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'languages', label: 'Languages' },
];

export default function Builder() {
  const navigate = useNavigate();
  const {
    resume,
    createResume,
    updateResume,
    updatePersonal,
    updateSection,
    activeResumeId,
    hasLoaded,
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  // Ensure there's an active resume (create once after mount / storage load)
  useEffect(() => {
    if (!hasLoaded) return;
    if (!activeResumeId) {
      createResume();
    }
  }, [activeResumeId, createResume, hasLoaded]);

  const templates = getAllTemplates();
  const completeness = getProfileCompleteness(resume);

  const handlePersonalChange = (personal) => {
    updatePersonal(resume.id, personal);
  };

  const handleSectionChange = (section) => (items) => {
    updateSection(resume.id, section, items);
  };

  const handleTemplateChange = (templateId) => {
    updateResume(resume.id, { templateId });
  };

  const handleAccentChange = (color) => {
    updateResume(resume.id, { accentColor: color });
  };

const handleExportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const pagesRoot = previewRef.current.querySelector('.a4-pages');
      const target = pagesRoot || previewRef.current;
      await exportResumeToPDF(target, resume);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert(`PDF export failed: ${error?.message || error}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="builder">
      <div className="builder-toolbar no-print">
        <div className="container builder-toolbar-inner">
          <div>
            <h2 className="builder-title">Resume Builder</h2>
            <p className="builder-progress text-muted">
              Profile completeness: {completeness}%
            </p>
          </div>
          <div className="builder-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : '⬇ Download PDF'}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/dashboard')}
            >
              Save & Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container builder-layout">
        {/* Editor column */}
        <div className="builder-editor">
          <div className="builder-settings">
            <div className="form-section">
              <h3 className="form-section-title">Template & Style</h3>
              <div className="template-selector">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`template-chip ${
                      resume.templateId === t.id ? 'template-chip-active' : ''
                    }`}
                    style={{ '--chip-color': t.previewColor }}
                    onClick={() => handleTemplateChange(t.id)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="form-field mt-3">
                <label className="form-label">Accent Color</label>
                <input
                  type="color"
                  className="color-input"
                  value={resume.accentColor}
                  onChange={(e) => handleAccentChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="builder-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`builder-tab ${
                  activeTab === tab.id ? 'builder-tab-active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="builder-form-body">

            {activeTab === 'personal' && (
              <PersonalInfoForm
                personal={resume.personal}
                onChange={handlePersonalChange}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                items={resume.sections.education}
                onChange={handleSectionChange('education')}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                items={resume.sections.skills}
                onChange={handleSectionChange('skills')}
              />
            )}         

            {activeTab === 'experience' && (
              <ExperienceForm
                items={resume.sections?.experience || []}
                onChange={handleSectionChange('experience')}
              />
            )}

            {activeTab === 'internships' && (
              <InternshipForm
                items={resume.sections?.internships || []}
                onChange={handleSectionChange('internships')}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsForm
                items={resume.sections.projects}
                onChange={handleSectionChange('projects')}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsForm
                items={resume.sections.certificates}
                onChange={handleSectionChange('certificates')}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsForm
                items={resume.sections.achievements}
                onChange={handleSectionChange('achievements')}
              />
            )}

            {activeTab === 'languages' && (
              <LanguagesForm
                items={resume.sections.languages}
                onChange={handleSectionChange('languages')}
              />
            )}

          </div>
        </div>

        {/* Preview column */}
        {showPreview && (
          <div className="builder-preview">
            <div className="preview-wrap" ref={previewRef}>
              <ResumePreview
                resume={resume}
                templateId={resume.templateId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
