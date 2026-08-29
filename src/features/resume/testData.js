/**
 * Edge-case test data for verifying all three templates
 * (Basic, Modern, ATS) across content scenarios.
 *
 * These are realistic resumes used to compare rendering across templates:
 * short, normal fresher, long, and edge-case.
 */
import { createDefaultResume } from './resumeData.js';

/**
 * SHORT resume - minimal content (very short).
 */
export const shortResume = createDefaultResume({
  id: 'test-short',
  title: 'Short Resume',
  templateId: 'basic',
  personal: {
    fullName: 'John Doe',
    jobTitle: 'Student',
    email: 'john@email.com',
    phone: '+1 555 0001',
    city: 'Boston, MA',
  },
  sections: {
    experience: [],
    education: [
      {
        id: 'edu1',
        school: 'Boston University',
        degree: 'BSc',
        fieldOfStudy: 'Economics',
        startDate: '2020-09',
        endDate: '',
        present: true,
      },
    ],
    skills: [{ id: 's1', name: 'Excel' }, { id: 's2', name: 'Communication' }],
  },
});

/**
 * NORMAL fresher resume - typical entry-level content.
 */
export const fresherResume = createDefaultResume({
  id: 'test-fresher',
  title: 'Fresher Resume',
  templateId: 'modern',
  personal: {
    fullName: 'Priya Sharma',
    jobTitle: 'Frontend Developer (Fresher)',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    city: 'Mumbai, India',
    website: 'priyasharma.dev',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
    careerObjectives:
      'Motivated computer science graduate seeking a challenging frontend developer role. Passionate about building responsive, accessible web applications and continuously learning modern JavaScript.',
  },
  sections: {
    experience: [],
    internships: [
      {
        id: 'int1',
        company: 'WebSolutions Pvt Ltd',
        role: 'Frontend Intern',
        startDate: '2023-06',
        endDate: '2023-08',
        description: 'Built reusable React components and participated in daily standups.',
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'Mumbai University',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        startDate: '2019-08',
        endDate: '2023-05',
        description: 'CGPA 8.7/10. Led the departmental tech club.',
      },
    ],
    skills: [
      { id: 's1', name: 'JavaScript' },
      { id: 's2', name: 'React' },
      { id: 's3', name: 'HTML/CSS' },
      { id: 's4', name: 'Git' },
      { id: 's5', name: 'Bootstrap' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'Weather Dashboard',
        description: 'A weather app fetching live data from a public API.',
        link: 'github.com/priyasharma/weather-dashboard',
        technologies: ['React', 'REST API', 'CSS'],
      },
    ],
    certificates: [
      { id: 'c1', name: 'JavaScript Certification', issuer: 'freeCodeCamp', date: '2023-01' },
    ],
    achievements: [
      { id: 'a1', title: 'Winner, College Hackathon 2022', date: '2022' },
    ],
    languages: [{ id: 'l1', name: 'English', proficiency: 'Fluent' }],
  },
});

/**
 * LONG resume - many sections, many items, multiple pages.
 */
export const longResume = createDefaultResume({
  id: 'test-long',
  title: 'Long Resume',
  templateId: 'ats',
  personal: {
    fullName: 'Alexandra Montgomery-Peterson III',
    jobTitle: 'Senior Staff Software Engineering Manager',
    email: 'alexandra.m.g.peterson@corporate-enterprise-domain.com',
    phone: '+1 (415) 555-0199',
    city: 'San Francisco Bay Area, California',
    website: 'alexandra-montgomery-peterson-portfolio.io',
    linkedin: 'linkedin.com/in/alexandramontgomerypeterson',
    github: 'github.com/alexandramontgomerypeterson',
    careerObjectives:
      'Accomplished engineering leader with 15+ years of experience scaling distributed systems and building high-performing teams. Proven track record of delivering mission-critical platforms used by millions of users while mentoring engineers and driving architectural excellence across the organization.',
  },
  sections: {
    experience: [
      {
        id: 'exp1',
        company: 'Global Enterprise Technology Holdings Incorporated',
        role: 'Senior Staff Software Engineering Manager',
        location: 'San Francisco, CA',
        startDate: '2019-04',
        endDate: '',
        current: true,
        description:
          'Lead a multidisciplinary team of 25 engineers building a cloud-native platform serving 40M+ monthly active users across three continents.',
        achievements: [
          'Reduced infrastructure costs by 35% through a major microservices-to-serverless migration.',
          'Drove a 4x improvement in on-call efficiency by implementing automated alerting and runbook automation.',
          'Mentored 12 engineers to senior roles and established a company-wide engineering onboarding program.',
          'Championed accessibility and design-system adoption, improving Lighthouse scores to 98+ across product surfaces.',
        ],
      },
      {
        id: 'exp2',
        company: 'NextGen Cloud Systems Ltd.',
        role: 'Principal Software Engineer',
        location: 'Austin, TX',
        startDate: '2015-01',
        endDate: '2019-03',
        description:
          'Architected and delivered scalable backend services and APIs serving high-throughput, low-latency workloads.',
        achievements: [
          'Designed a distributed event-driven architecture processing 1.2B events/day with 99.99% uptime.',
          'Introduced a typed contract-first API development workflow adopted by 8 product squads.',
          'Authored RFCs and led technical design reviews for cross-cutting infrastructure initiatives.',
        ],
      },
      {
        id: 'exp3',
        company: 'Innovative Mobile Applications Corporation',
        role: 'Senior Software Engineer',
        location: 'Seattle, WA',
        startDate: '2011-06',
        endDate: '2014-12',
        description:
          'Developed and maintained mobile and web applications for enterprise clients.',
        achievements: [
          'Shipped a flagship mobile app with 1M+ downloads and a 4.8-star average rating.',
          'Reduced app crash rate by 60% through robust error tracking and performance profiling.',
        ],
      },
    ],
    internships: [
      {
        id: 'int1',
        company: 'Startups Inc.',
        role: 'Software Engineering Intern',
        startDate: '2010-05',
        endDate: '2010-08',
        description: 'Assisted in building a reporting dashboard using Python and JavaScript.',
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2009-09',
        endDate: '2011-06',
        description: 'Specialized in distributed systems and human-computer interaction.',
      },
      {
        id: 'edu2',
        school: 'University of California, Los Angeles',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science and Engineering',
        startDate: '2005-09',
        endDate: '2009-06',
        description: 'Graduated with High Honors. Dean\'s List all four years.',
      },
    ],
    skills: [
      { id: 's1', name: 'System Architecture' },
      { id: 's2', name: 'Distributed Systems' },
      { id: 's3', name: 'TypeScript' },
      { id: 's4', name: 'Node.js' },
      { id: 's5', name: 'Go' },
      { id: 's6', name: 'Kubernetes' },
      { id: 's7', name: 'AWS' },
      { id: 's8', name: 'Leadership' },
      { id: 's9', name: 'Strategic Planning' },
      { id: 's10', name: 'Public Speaking' },
      { id: 's11', name: 'Technical Writing' },
      { id: 's12', name: 'Mentoring' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'Enterprise Observability Platform',
        description: 'A unified observability solution consolidating logs, metrics, and traces for 200+ services.',
        link: 'github.com/alexandra/observability-platform',
        technologies: ['Go', 'Prometheus', 'Grafana', 'Kafka', 'Kubernetes'],
      },
      {
        id: 'p2',
        title: 'Open Source Command-Line Interview Automation Toolkit',
        description: 'A CLI tool for automating infrastructure provisioning across multi-cloud environments.',
        link: 'github.com/alexandra/iac-toolkit',
        technologies: ['TypeScript', 'Terraform', 'Docker'],
      },
      {
        id: 'p3',
        title: 'Real-Time Collaboration Whiteboard Web Application',
        description: 'A collaborative whiteboarding app with live cursors and presence.',
        link: 'github.com/alexandra/whiteboard',
        technologies: ['React', 'WebSockets', 'Node.js'],
      },
      {
        id: 'p4',
        title: 'Machine Learning Model Performance Monitoring Dashboard',
        description: 'A dashboard to monitor drift and performance of production ML models.',
        link: 'github.com/alexandra/ml-monitoring',
        technologies: ['Python', 'React', 'MLflow'],
      },
    ],
    certificates: [
      { id: 'c1', name: 'Google Cloud Professional Cloud Architect', issuer: 'Google Cloud', date: '2022-11' },
      { id: 'c2', name: 'AWS Certified Solutions Architect - Professional', issuer: 'Amazon Web Services', date: '2021-05' },
      { id: 'c3', name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2020-08' },
      { id: 'c4', name: 'Project Management Professional', issuer: 'PMI', date: '2019-03' },
      { id: 'c5', name: 'Certified Scrum Master', issuer: 'Scrum Alliance', date: '2018-06' },
    ],
    achievements: [
      { id: 'a1', title: 'Speaker, VelocityConf 2023', date: '2023' },
      { id: 'a2', title: 'Author, "Serverless in Practice"', date: '2022' },
      { id: 'a3', title: 'Engineering Excellence Award, 2021', date: '2021' },
    ],
    languages: [
      { id: 'l1', name: 'English', proficiency: 'Native' },
      { id: 'l2', name: 'Spanish', proficiency: 'Conversational' },
      { id: 'l3', name: 'French', proficiency: 'Basic' },
    ],
  },
});

/**
 * EDGE-CASE resume - very long names, long titles, long URLs, many skills,
 * special characters, missing optional fields, different date formats.
 */
export const edgeCaseResume = createDefaultResume({
  id: 'test-edge',
  title: 'Edge Case Resume',
  templateId: 'modern',
  personal: {
    fullName: 'Maximilian Alexander von Braunschweig-Volpertshausen',
    jobTitle: 'Principal Distinguished Lead Senior Full-Stack Cloud Architect Engineer',
    email: 'maximilian.alexander.von.a.very.long.email.address@someverylongdomainname.example.com',
    phone: '+1 (999) 555-0123 ext. 45678',
    city: 'New York',
    address: '1234 Very Long Street Name Avenue Boulevard',
    website: 'https://www.this-is-a-very-long-portfolio-domain-name-that-goes-on-for-a-while.example.com',
    linkedin: 'https://www.linkedin.com/in/maximilian-alexander-von-braunschweig-volpertshausen',
    github: 'https://github.com/maximilian-von-braunschweig-volpertshausen-engineering',
    careerObjectives:
      'Results-oriented engineer with special characters in focus: C++, C#, .NET, Objective-C++, Rust# — proficient in SQL, NoSQL, and GraphQL. Handles unicode: üñïçødé, 中文, العربية, and emoji-free professional text. Focused on ♥ quality and ♦ resilience.',
  },
  sections: {
    experience: [
      {
        id: 'exp1',
        company: 'International Consortium of Very Long Named Enterprises and Associates & Co. Ltd.',
        role: 'Principal Distinguished Lead Senior Full-Stack Cloud Architect Engineer',
        location: 'New York, NY',
        startDate: '2018-01-15',
        endDate: 'Present',
        description:
          'A very long job description containing a ridiculously long sentence that goes on and on about the responsibilities, the scope, the expected outcomes, and the day-to-day activities of this senior engineering position, intended to test text wrapping and pagination across multiple lines and potentially pushing content to the next page when combined with all the other content in this edge-case resume.',
        achievements: [
          'This is an extremely long achievement bullet point that is designed to test how the template handles very long single lines of text that might otherwise overflow the page boundaries or cause awkward wrapping behaviour in the resume layout.',
          'Reduced build times by 99.9% using a veryLongUnbrokenSingleWordTokenThatShouldNotOverflowThePageWidthInAnyTemplate.',
          'Increased team velocity by 2.5x; improved quarterly NPS from 40 to 75 across a 12-quarter window.',
        ],
      },
      {
        id: 'exp2',
        company: 'A', // very short company
        role: 'Engineer',
        location: '',
        startDate: '2015',
        endDate: '2017',
        description: 'Short role with minimal details and no location.',
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'The University of Supercalifragilisticexpialidocious Advanced Studies',
        degree: 'Doctor of Philosophy in Computer Science and Artificial Intelligence and Machine Learning and Robotics',
        fieldOfStudy: 'Distributed Systems and Human-Computer Interaction and Cloud Computing',
        location: 'Somewhere, USA',
        startDate: '2013-09-01',
        endDate: '2018-05-30',
        description: 'A very long degree name and field of study intended to test wrapping and layout stability.',
      },
    ],
    skills: [
      { id: 's1', name: 'React' },
      { id: 's2', name: 'TypeScript' },
      { id: 's3', name: 'Node.js' },
      { id: 's4', name: 'GraphQL' },
      { id: 's5', name: 'PostgreSQL' },
      { id: 's6', name: 'Redis' },
      { id: 's7', name: 'Docker' },
      { id: 's8', name: 'Kubernetes' },
      { id: 's9', name: 'AWS Serverless' },
      { id: 's10', name: 'CI/CD' },
      { id: 's11', name: 'Microservices' },
      { id: 's12', name: 'Event-Driven Architecture' },
      { id: 's13', name: 'System Design' },
      { id: 's14', name: 'Security Best Practices' },
      { id: 's15', name: 'Performance Optimization' },
      { id: 's16', name: 'Technical Leadership' },
      { id: 's17', name: 'Mentoring' },
      { id: 's18', name: 'Agile / Scrum' },
      { id: 's19', name: 'Communication' },
      { id: 's20', name: 'Problem Solving' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'An Extremely Long Project Title That Goes On For Quite A While To Test Wrapping And Layout Stability Across All Template Designs',
        description: 'This project description is intentionally very long to test how the resume templates handle paragraphs that span multiple lines and wrap gracefully within the available column width.',
        link: 'https://github.com/maximilian-von-braunschweig-volpertshausen/some-extremely-long-project-repository-name-that-goes-on-forever',
        technologies: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      },
      {
        id: 'p2',
        title: 'Short Project',
        description: 'Short.',
        link: 'github.com/short',
        technologies: ['React'],
      },
      {
        id: 'p3',
        title: 'Another Project With A Lengthy Name Meant To Stress The Item Head Layout',
        description: '',
        link: '',
        technologies: [],
      },
    ],
    certificates: [
      { id: 'c1', name: 'Certified Supercalifragilisticexpialidocious Professional', issuer: 'An Extremely Long Certification Issuing Body Institution Name', date: '2023-01-15' },
      { id: 'c2', name: 'Second Certification', issuer: 'Issuer', date: '2022' },
      { id: 'c3', name: 'Third Certification', issuer: 'Another Issuer', date: '2021' },
      { id: 'c4', name: 'Fourth Certification', issuer: 'Issuer Four', date: '2020' },
      { id: 'c5', name: 'Fifth Certification', issuer: 'Issuer Five', date: '2019' },
      { id: 'c6', name: 'Sixth Certification', issuer: 'Issuer Six', date: '2018' },
    ],
    achievements: [
      { id: 'a1', title: 'An Extremely Long Achievement Title That Goes On For Several Lines To Test Layout Handling', date: '2023' },
      { id: 'a2', title: 'Second Achievement', date: '2022' },
      { id: 'a3', title: 'Third Achievement', date: '2021' },
    ],
    languages: [
      { id: 'l1', name: 'English', proficiency: 'Native' },
      { id: 'l2', name: 'Deutsch', proficiency: 'Fluent' },
      { id: 'l3', name: 'Français', proficiency: 'Professional' },
      { id: 'l4', name: 'Español', proficiency: 'Conversational' },
      { id: 'l5', name: '中文', proficiency: 'Basic' },
    ],
    custom: [
      {
        id: 'cs1',
        title: 'Volunteer Experience',
        items: [
          'Mentored junior developers in open source communities for 5+ years.',
          'Organized and led local tech meetups with 200+ attendees.',
        ],
      },
      {
        id: 'cs2',
        title: 'Publications',
        items: [
          {
            title: 'Scaling Distributed Systems: A Practical Guide',
            subtitle: 'O\'Reilly Media',
            date: '2022',
            description: 'Co-authored a 300-page engineering book on distributed systems architecture.',
          },
        ],
      },
    ],
  },
});

/**
 * SECTION-OVERFLOW resume - a single section has enough entries to span
 * multiple pages, forcing heading + first-entry orphan protection and
 * "move only overflowing entries" behavior.
 */
export const sectionOverflowResume = createDefaultResume({
  id: 'test-section-overflow',
  title: 'Section Overflow Resume',
  templateId: 'basic',
  personal: {
    fullName: 'Zara Patel',
    jobTitle: 'Software Engineer',
    email: 'zara@email.com',
    phone: '+1 555 0100',
    city: 'Denver, CO',
    careerObjectives:
      'Engineer focused on building reliable, testable software systems.',
  },
  sections: {
    experience: Array.from({ length: 14 }, (_, i) => ({
      id: `exp${i + 1}`,
      company: `Company ${i + 1}`,
      role: `Software Engineer ${i + 1}`,
      location: 'Denver, CO',
      startDate: '2019-01',
      endDate: '2020-01',
      description:
        'Designed and delivered scalable microservices and APIs. Collaborated with cross-functional teams to improve reliability and reduce latency across core product surfaces.',
      achievements: [
        'Reduced p95 latency by 30% through targeted optimization.',
        'Led a migration that cut monthly infrastructure costs by 20%.',
      ],
    })),
    education: [
      {
        id: 'edu1',
        school: 'University of Colorado',
        degree: 'BSc',
        fieldOfStudy: 'Computer Science',
        startDate: '2014-08',
        endDate: '2018-05',
      },
    ],
    skills: [
      { id: 's1', name: 'TypeScript' },
      { id: 's2', name: 'Node.js' },
      { id: 's3', name: 'AWS' },
    ],
  },
});

/**
 * LONG-ENTRY resume - contains entries that are taller than a single A4
 * content area, forcing the split/slice logic so nothing is ever clipped.
 */
export const longEntryResume = createDefaultResume({
  id: 'test-long-entry',
  title: 'Long Entry Resume',
  templateId: 'basic',
  personal: {
    fullName: 'Kai Nakamura',
    jobTitle: 'Principal Engineer',
    email: 'kai@email.com',
    phone: '+1 555 0101',
    city: 'Seattle, WA',
    careerObjectives:
      'Seasoned engineer with deep experience in large-scale distributed systems.',
  },
  sections: {
    experience: [
      {
        id: 'exp-big',
        company: 'MegaCorp Systems',
        role: 'Principal Staff Engineer',
        location: 'Seattle, WA',
        startDate: '2015-01',
        endDate: '',
        current: true,
        description:
          'A deliberately enormous description spanning many paragraphs to simulate an entry that overflows a single A4 page. '.repeat(40),
        achievements: [
          'Architected a platform processing billions of events daily. '.repeat(20),
          'Led a team of 40 across 6 squads. '.repeat(20),
        ],
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'University of Washington',
        degree: 'MS',
        fieldOfStudy: 'Computer Science',
        startDate: '2010-09',
        endDate: '2012-06',
      },
    ],
    skills: [
      { id: 's1', name: 'Go' },
      { id: 's2', name: 'Kubernetes' },
      { id: 's3', name: 'Architecture' },
    ],
  },
});

/**
 * HEADING-ORPHAN resume - drives heading + first-entry protection: enough
 * entries so that a heading would otherwise land at the bottom of a page.
 */
export const headingOrphanResume = createDefaultResume({
  id: 'test-heading-orphan',
  title: 'Heading Orphan Resume',
  templateId: 'ats',
  personal: {
    fullName: 'Maya Singh',
    jobTitle: 'Product Manager',
    email: 'maya@email.com',
    phone: '+1 555 0102',
    city: 'Austin, TX',
    careerObjectives:
      'Product leader who ships user-centered software at scale.',
  },
  sections: {
    experience: [
      {
        id: 'exp1',
        company: 'ProductCo',
        role: 'Senior PM',
        location: 'Austin, TX',
        startDate: '2018-01',
        endDate: '',
        current: true,
        description:
          'Owned roadmap and delivery for a platform serving millions of users.',
      },
      {
        id: 'exp2',
        company: 'ProductCo',
        role: 'PM',
        location: 'Austin, TX',
        startDate: '2015-01',
        endDate: '2017-12',
        description: 'Shipped multiple features end to end.',
      },
    ],
    education: [
      {
        id: 'edu1',
        school: 'UT Austin',
        degree: 'MBA',
        fieldOfStudy: 'Business',
        startDate: '2013-08',
        endDate: '2015-05',
      },
    ],
    skills: [
      { id: 's1', name: 'Roadmapping' },
      { id: 's2', name: 'Agile' },
      { id: 's3', name: 'SQL' },
      // A long list to push the heading lower on the page.
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `s${i + 4}`,
        name: `Skill Keyword ${i + 1}`,
      })),
    ],
  },
});

/**
 * All test resumes keyed by scenario name.
 */
export const testResumes = {
  short: shortResume,
  fresher: fresherResume,
  long: longResume,
  edge: edgeCaseResume,
  sectionOverflow: sectionOverflowResume,
  longEntry: longEntryResume,
  headingOrphan: headingOrphanResume,
};

/**
 * The three template IDs to render each scenario with.
 */
export const testTemplateIds = ['basic', 'modern', 'ats'];

export default testResumes;
