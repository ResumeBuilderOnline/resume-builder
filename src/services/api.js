/**
 * API service layer.
 * Handles communication with backend endpoints.
 * Falls back to local/mock mode when no API URL is configured.
 */

const API_URL = import.meta.env.VITE_API_URL || '';
const AI_API_URL = import.meta.env.VITE_AI_API_URL || '';

/**
 * Generic request helper.
 * @param {string} path
 * @param {object} [options]
 * @returns {Promise<any>}
 */
async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) =>
    request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/**
 * AI features (placeholder - requires backend).
 */
export const aiService = {
  /**
   * Generate resume content from a job description.
   * @param {object} payload
   * @returns {Promise<any>}
   */
  async generateContent(payload) {
    if (!AI_API_URL) {
      // Mock response when no backend is configured
      const suggestions = [
        'Led cross-functional teams to deliver projects on time and within budget.',
        'Improved key metrics by 25% through data-driven process optimization.',
        'Collaborated with stakeholders to define and implement strategic roadmaps.',
      ];
      return { suggestions };
    }
    const response = await fetch(`${AI_API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('AI generation failed');
    return response.json();
  },

  /**
   * Analyze a resume for ATS compatibility.
   * @param {object} resume
   * @returns {Promise<any>}
   */
  async analyzeATS(resume) {
    if (!AI_API_URL) {
      return {
        score: 82,
        suggestions: [
          'Add more keywords from the job description.',
          'Include quantifiable achievements in work experience.',
          'Use a standard section heading for "Work Experience".',
        ],
      };
    }
    const response = await fetch(`${AI_API_URL}/ats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
    if (!response.ok) throw new Error('ATS analysis failed');
    return response.json();
  },
};

export default api;
