/**
 * Default resume data structure and factory functions.
 */

/**
 * Create a blank section item.
 */
export function createExperience(overrides = {}) {
  return {
    id: '',
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    ...overrides,
  };
}

export function createInternship(overrides = {}) {
  return {
    id: '',
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    ...overrides,
  };
}

export function createEducation(overrides = {}) {
  return {
    id: '',
    school: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    present: false,
    description: '',
    ...overrides,
  };
}

export function createSkill(overrides = {}) {
  return {
    id: '',
    name: '',
    level: 3, // 1-5
    ...overrides,
  };
}

export function createProject(overrides = {}) {
  return {
    id: '',
    title: '',
    description: '',
    link: '',
    technologies: [],
    startDate: '',
    endDate: '',
    ...overrides,
  };
}

export function createAchievement(overrides = {}) {
  return {
    id: '',
    title: '',
    description: '',
    date: '',
    ...overrides,
  };
}

export function createCertificate(overrides = {}) {
  return {
    id: '',
    name: '',
    issuer: '',
    date: '',
    link: '',
    ...overrides,
  };
}

export function createLanguage(overrides = {}) {
  return {
    id: '',
    name: '',
    proficiency: 'Fluent',
    ...overrides,
  };
}

export function createCustomSection(overrides = {}) {
  return {
    id: '',
    title: '',
    items: [],
    ...overrides,
  };
}

/**
 * Create a default (empty) resume.
 * @param {object} [overrides]
 * @returns {object}
 */
export function createDefaultResume(overrides = {}) {
  return {
    id: '',
    title: 'Untitled Resume',
    templateId: 'modern',
    accentColor: '#000000',
    fontSize: 14,
    spacing: 16,
    updatedAt: new Date().toISOString(),
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      website: '',
      linkedin: '',
      github: '',
      careerObjectives: '',
      photo: '',
    },
    sections: {
      careerObjectives: [],
      experience: [],
      internships: [],
      education: [],
      skills: [],
      projects: [],
      certificates: [],
      achievements: [],
      languages: [],
      custom: [],
    },
    ...overrides,
  };
}

/**
 * Sample/demo resume data for quick preview.
 * @returns {object}
 */
export function createSampleResume() {
  return createDefaultResume({
    id: 'sample',
    title: 'Alex Johnson',
    templateId: 'modern',
    accentColor: '#000000',
    personal: {
      fullName: 'Alex Johnson',
      jobTitle: 'Senior Frontend Developer',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street',
      city: 'San Francisco, CA',
      postalCode: '94105',
      website: 'alexjohnson.dev',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson',
      careerObjectives:
        'Results-driven frontend developer with 6+ years of experience building responsive, accessible web applications. Passionate about crafting elegant user interfaces and optimizing performance.',
    },
    sections: {
      experience: [
        {
          id: 'exp1',
          company: 'TechNova Inc.',
          role: 'Senior Frontend Developer',
          location: 'San Francisco, CA',
          startDate: '2021-03',
          endDate: '',
          current: true,
          description:
            'Leading a team of 5 developers building a SaaS dashboard used by 50k+ users.',
          achievements: [
            'Reduced page load time by 40% through code-splitting and lazy loading.',
            'Implemented design system adopted across 3 product teams.',
          ],
        },
        {
          id: 'exp2',
          company: 'PixelWorks Studio',
          role: 'Frontend Developer',
          location: 'Remote',
          startDate: '2018-06',
          endDate: '2021-02',
          current: false,
          description:
            'Developed and maintained customer-facing marketing sites and e-commerce platforms.',
          achievements: [
            'Built 20+ responsive landing pages with 98+ Lighthouse scores.',
            'Integrated third-party APIs for payments and analytics.',
          ],
        },
      ],
      internships: [
        {
          id: 'int1',
          company: 'CodeCraft Labs',
          role: 'Frontend Developer Intern',
          location: 'San Jose, CA',
          startDate: '2017-06',
          endDate: '2017-08',
          current: false,
          description:
            'Assisted in building internal tools and polished UI components for client projects.',
          achievements: [
            'Shipped 3 reusable React components used across the team.',
          ],
        },
      ],
      education: [
        {
          id: 'edu1',
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2014-08',
          endDate: '2018-05',
          present: false,
          description: 'Graduated with honors.',
        },
      ],
      skills: [
        { id: 'skill1', name: 'JavaScript / TypeScript', level: 5 },
        { id: 'skill2', name: 'React', level: 5 },
        { id: 'skill3', name: 'Node.js', level: 4 },
        { id: 'skill4', name: 'CSS / Tailwind', level: 4 },
        { id: 'skill5', name: 'GraphQL', level: 3 },
      ],
      projects: [
        {
          id: 'proj1',
          title: 'Open Source UI Library',
          description: 'A component library with 2k+ GitHub stars.',
          link: 'github.com/alexjohnson/ui-library',
          technologies: ['React', 'TypeScript', 'Storybook'],
        },
      ],
      certificates: [
        {
          id: 'cert1',
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: '2022-08',
        },
      ],
      achievements: [
        {
          id: 'ach1',
          title: 'Employee of the Quarter',
          description: 'Recognized for outstanding performance in Q3 2022.',
          date: '2022-09',
        },
      ],
      languages: [{ id: 'lang1', name: 'English', proficiency: 'Native' }],
      custom: [],
    },
  });
}

export default createDefaultResume;
