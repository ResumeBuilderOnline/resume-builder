/**
 * Zustand store for managing resume state.
 */
import { create } from 'zustand';
import { createDefaultResume } from './resumeData.js';
import { generateId } from '../../utils/helpers.js';

export const useResumeStore = create((set, get) => ({
  // State
  resumes: [],
  activeResumeId: null,
  activeTemplateId: 'modern',
  loading: false,
  error: null,

// Selectors / helpers
  getActiveResume: () => {
    const { resumes, activeResumeId } = get();
    return resumes.find((r) => r.id === activeResumeId) || null;
  },

  // Actions
  setResumes: (resumes) => set({ resumes }),

  setActiveResumeId: (id) => set({ activeResumeId: id }),

  setActiveTemplateId: (templateId) =>
    set({ activeTemplateId, activeResumeId: null }),

  createResume: (data = {}) => {
    const id = generateId('resume');
    const resume = createDefaultResume({ id, ...data });
    set((state) => ({
      resumes: [resume, ...state.resumes],
      activeResumeId: id,
    }));
    return id;
  },

  updateResume: (id, updates) => {
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },

  updatePersonal: (id, personal) => {
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id
          ? {
              ...r,
              personal: { ...r.personal, ...personal },
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  updateSection: (id, sectionName, items) => {
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id
          ? {
              ...r,
              sections: { ...r.sections, [sectionName]: items },
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }));
  },

  deleteResume: (id) =>
    set((state) => {
      const resumes = state.resumes.filter((r) => r.id !== id);
      return {
        resumes,
        activeResumeId:
          state.activeResumeId === id
            ? resumes[0]?.id || null
            : state.activeResumeId,
      };
    }),

  duplicateResume: (id) => {
    const resume = get().resumes.find((r) => r.id === id);
    if (!resume) return null;
    const newResume = {
      ...JSON.parse(JSON.stringify(resume)),
      id: generateId('resume'),
      title: `${resume.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      resumes: [newResume, ...state.resumes],
      activeResumeId: newResume.id,
    }));
    return newResume.id;
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useResumeStore;
