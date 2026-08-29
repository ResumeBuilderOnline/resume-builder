import { useEffect, useState } from 'react';
import { useResumeStore } from '../features/resume/resumeStore.js';
import { createDefaultResume } from '../features/resume/resumeData.js';
import { STORAGE_KEYS, getItem, setItem } from '../services/storage.js';
import { validateResumes } from '../features/resume/resumeValidation.js';

/**
 * Custom hook for accessing and managing resume state.
 * Provides a convenient interface over the zustand store and a reactive
 * `resume` value (the active resume, or a stable default when none exists).
 */
export function useResume() {
  const store = useResumeStore();
  const [hasLoaded, setHasLoaded] = useState(false);

  // Reactive active resume: subscribe to the store so edits re-render.
  const activeResume = useResumeStore((s) =>
    s.resumes.find((r) => r.id === s.activeResumeId)
  );
          
  // Load saved resumes on mount
  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.RESUMES, []);
    const activeId = getItem(STORAGE_KEYS.ACTIVE_RESUME_ID, null);

    const validatedResumes = validateResumes(saved);

    if (validatedResumes.length && store.resumes.length === 0) {
      store.setResumes(validatedResumes);
    }
    if (
      typeof activeId === 'string' &&
      activeId.length <= 200 &&
      validatedResumes.some((resume) => resume.id === activeId) &&
      !store.activeResumeId
    ) {
      store.setActiveResumeId(activeId);
    }
    setHasLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save resumes whenever they change
  useEffect(() => {
    if (store.resumes.length > 0) {
      setItem(STORAGE_KEYS.RESUMES, store.resumes);
    }
  }, [store.resumes]);

  // Auto-save active resume id
  useEffect(() => {
    if (store.activeResumeId) {
      setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, store.activeResumeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.activeResumeId]);

  // Provide a stable-ish default only when there is genuinely no active resume.
  const resume = activeResume
    ? {
        ...createDefaultResume(),
        ...activeResume,
        personal: {
          ...createDefaultResume().personal,
          ...(activeResume.personal || {}),
        },
        sections: {
          ...createDefaultResume().sections,
          ...(activeResume.sections || {}),
        },
      }
    : createDefaultResume();
    return { ...store, resume, hasLoaded };
  }

export default useResume;
