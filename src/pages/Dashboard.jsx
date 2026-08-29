import React from 'react';
import { Link } from 'react-router-dom';
import Heading from '../components/ui/Heading.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useResume } from '../hooks/useResume.js';
import { getProfileCompleteness } from '../features/resume/resumeUtils.js';
import { exportResumeJSON } from '../features/pdf/pdfService.js';

export default function Dashboard() {
  const { resumes, activeResumeId, setActiveResumeId, deleteResume, duplicateResume } =
    useResume();

  const confirmDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteResume(id);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <Heading
            title="My Resumes"
            subtitle={`${resumes.length} ${resumes.length === 1 ? 'resume' : 'resumes'} saved`}
          />
          <Link to="/builder" className="btn btn-primary">
            + New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No resumes yet"
            description="Create your first professional resume to get started."
            action={
              <Link to="/builder" className="btn btn-primary">
                Create Resume
              </Link>
            }
          />
        ) : (
          <div className="dashboard-grid">
            {resumes.map((resume) => {
              const completeness = getProfileCompleteness(resume);
              const isActive = resume.id === activeResumeId;
              return (
                <div
                  className={`card dashboard-card ${
                    isActive ? 'dashboard-card-active' : ''
                  }`}
                  key={resume.id}
                >
                  <div className="dashboard-card-top">
                    <div className="dashboard-card-icon">📄</div>
                    <div className="dashboard-card-info">
                      <h3 className="dashboard-card-title">
                        {resume.personal?.fullName || resume.title}
                      </h3>
                      <p className="text-muted dashboard-card-meta">
                        {resume.personal?.jobTitle || 'No job title'}
                      </p>
                    </div>
                  </div>

                  <div className="dashboard-card-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                    <span className="progress-label text-muted">
                      {completeness}% complete
                    </span>
                  </div>

                  <div className="dashboard-card-actions">
                    <Link
                      to="/builder"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveResumeId(resume.id)}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => duplicateResume(resume.id)}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => exportResumeJSON(resume)}
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmDelete(resume.id, resume.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
