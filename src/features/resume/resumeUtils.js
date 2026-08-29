/**
 * Resume utility functions for data manipulation and formatting.
 */
import { formatDate } from '../../utils/helpers.js';

/**
 * Compute the years/months between two dates.
 * @param {string} start - ISO date string
 * @param {string} end - ISO date string
 * @returns {string}
 */
export function getDateRange(start, end) {
  const startFmt = formatDate(start);
  const endFmt = end ? formatDate(end) : 'Present';
  // Use a real em dash so date ranges do not render as mojibake in the PDF.
  if (startFmt) return `${startFmt} \u2014 ${endFmt}`;
  if (!startFmt) return endFmt;
  return `${startFmt} — ${endFmt}`;
}

/**
 * Get a list of all section keys in order.
 */
export function getSectionOrder() {
  return [
    'careerObjectives',
    'experience',
    'internships',
    'education',
    'skills',
    'projects',
    'certificates',
    'achievements',
    'languages',
    'custom',
  ];
}

/**
 * Check if a resume has any content in a given section.
 * @param {object} resume
 * @param {string} section
 * @returns {boolean}
 */
export function hasSectionContent(resume, section) {
  const items = resume?.sections?.[section];
  return Array.isArray(items) && items.length > 0;
}

/**
 * Get the count of all sections that have content.
 * @param {object} resume
 * @returns {number}
 */
export function getFilledSectionsCount(resume) {
  if (!resume?.sections) return 0;
  return getSectionOrder().filter((s) => hasSectionContent(resume, s)).length;
}

/**
 * Get a list of all skills as plain strings.
 * @param {object} resume
 * @returns {string[]}
 */
export function getSkillsList(resume) {
  return (resume?.sections?.skills || []).map((s) => s.name);
}

/**
 * Build a tech stack string from an array of technologies.
 * @param {string[]} technologies
 * @returns {string}
 */
export function technologiesToString(technologies = []) {
  return technologies.join(', ');
}

/**
 * Build the ordered list of contact items, omitting empty fields.
 * Used by templates to render the header contact line dynamically.
 * @param {object} personal
 * @returns {string[]}
 */
export function getContactItems(personal = {}) {
  const items = [];
  if (personal.phone) items.push(personal.phone);
  if (personal.email) items.push(personal.email);
  const location = [personal.address, personal.city, personal.postalCode]
    .filter(Boolean)
    .join(', ');
  if (location) items.push(location);
  if (personal.website) items.push(personal.website);
  if (personal.linkedin) items.push(personal.linkedin);
  if (personal.github) items.push(personal.github);
  return items;
}

/**
 * Derive a short, readable label for a URL (e.g. "GitHub", "Portfolio",
 * or the hostname) instead of exposing a raw link alt text.
 * @param {string} url
 * @returns {string}
 */
export function getLinkLabel(url) {
  if (!url) return '';
  const lower = url.toLowerCase();
  if (lower.includes('github')) return 'GitHub';
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('portfolio')) return 'Portfolio';
  try {
    const withProtocol = url.includes('://') ? url : `https://${url}`;
    const host = new URL(withProtocol).hostname.replace(/^www\./, '');
    return host || url;
  } catch {
    return url;
  }
}

/**
 * Extract keywords from resume text for ATS analysis.
 * @param {object} resume
 * @returns {string[]}
 */
export function extractKeywords(resume) {
  const text = [
    resume?.personal?.jobTitle,
    resume?.personal?.careerObjectives,
    ...(resume?.sections?.skills || []).map((s) => s.name),
    ...(resume?.sections?.experience || []).map((e) => e.role),
  ]
    .filter(Boolean)
    .join(' ');
  return text
    .toLowerCase()
    .match(/\b[a-z][a-z0-9+#.-]{2,}\b/g)
    .filter((w) => w.length > 2) || [];
}

/**
 * Compute resume "profile completeness" percentage.
 * @param {object} resume
 * @returns {number}
 */
export function getProfileCompleteness(resume) {
  if (!resume) return 0;
  let score = 0;
  const p = resume.personal || {};
  const checks = [
    p.fullName,
    p.jobTitle,
    p.email,
    p.phone,
    p.careerObjectives,
    resume.sections?.experience?.length > 0,
    resume.sections?.education?.length > 0,
    resume.sections?.skills?.length > 0,
  ];
  const total = checks.length;
  checks.forEach((c) => {
    if (c) score += 1;
  });
  return Math.round((score / total) * 100);
}
