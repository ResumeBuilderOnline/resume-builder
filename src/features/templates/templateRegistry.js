/**
 * Template registry.
 * Maps template IDs to their metadata, lazy-loaded component, and layout config.
 *
 * `config` describes the physical page layout used by the pagination + preview
 * system. A template only controls presentation/layout; resume data stays
 * independent of template-specific structures.
 */
import { lazy } from 'react';

const BasicTemplate = lazy(() => import('./basic/BasicTemplate.jsx'));
const ModernTemplate = lazy(() => import('./modern/ModernTemplate.jsx'));
const AtsTemplate = lazy(() => import('./ats/AtsTemplate.jsx'));

// A4 portrait: 210mm x 297mm
const templates = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Clean, minimal, professional single-column for students and freshers.',
    component: BasicTemplate,
    previewColor: '#000000',
    config: {
      columns: 'single', // 'single' | 'dual'
      page: {
        // margins in mm
        marginTop: 17,
        marginBottom: 17,
        marginLeft: 17,
        marginRight: 17,
      },
      theme: {
        primary: '#000000',
        text: '#000000',
        secondaryText: '#000000',
        border: '#000000',
        background: '#ffffff',
      },
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary two-column layout with a subtle sidebar.',
    component: ModernTemplate,
    previewColor: '#000000',
    config: {
      columns: 'dual',
      page: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
      },
      columnsConfig: {
        main: 0.62, // fraction of content width
        side: 0.38,
      },
      theme: {
        primary: '#000000',
        text: '#000000',
        secondaryText: '#000000',
        border: '#000000',
        background: '#ffffff',
      },
    },
  },
  {
    id: 'ats',
    name: 'ATS',
    description: 'Machine-readable, single-column layout optimized for ATS parsing.',
    component: AtsTemplate,
    previewColor: '#000000',
    config: {
      columns: 'single',
      page: {
        marginTop: 18,
        marginBottom: 18,
        marginLeft: 18,
        marginRight: 18,
      },
      theme: {
        primary: '#000000',
        text: '#000000',
        secondaryText: '#000000',
        border: '#000000',
        background: '#ffffff',
      },
    },
  },
];

export function getTemplateById(id) {
  return templates.find((t) => t.id === id) || templates[1];
}

export function getTemplateComponent(id) {
  return getTemplateById(id).component;
}

export function getTemplateConfig(id) {
  return getTemplateById(id).config;
}

export function getAllTemplates() {
  return templates;
}

export default templates;
