const MAX_RESUMES = 50;

const MAX_TEXT_LENGTH = 5000;

const MAX_TOTAL_TEXT_LENGTH = 100000;

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 32;

const MIN_SPACING = 0;
const MAX_SPACING = 64;

const MAX_SECTION_ITEMS = {
  careerObjectives: 1,
  experience: 20,
  internships: 20,
  education: 10,
  skills: 50,
  projects: 20,
  certificates: 30,
  achievements: 30,
  languages: 20,
  custom: 20,
};

const ALLOWED_SECTION_NAMES = new Set(
  Object.keys(MAX_SECTION_ITEMS)
);

function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isSafeString(value, maxLength = MAX_TEXT_LENGTH) {
  return (
    typeof value === 'string' &&
    value.length <= maxLength
  );
}

function validateNestedText(value, depth = 0) {
  // Prevent excessively deep nested objects.
  if (depth > 5) {
    return false;
  }

  if (typeof value === 'string') {
    return isSafeString(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (!validateNestedText(item, depth + 1)) {
        return false;
      }
    }

    return true;
  }

  if (isPlainObject(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      // Nested IDs get the same smaller ID limit.
      if (key === 'id') {
        if (
          nestedValue !== undefined &&
          !isSafeString(nestedValue, 200)
        ) {
          return false;
        }

        continue;
      }

      if (!validateNestedText(nestedValue, depth + 1)) {
        return false;
      }
    }

    return true;
  }

  // Numbers, booleans, null, etc. are handled elsewhere.
  return true;
}

function getTotalTextLength(value, depth = 0) {
  if (depth > 5) {
    return 0;
  }

  if (typeof value === 'string') {
    return value.length;
  }

  if (Array.isArray(value)) {
    let total = 0;

    for (const item of value) {
      total += getTotalTextLength(item, depth + 1);

      if (total > MAX_TOTAL_TEXT_LENGTH) {
        return total;
      }
    }

    return total;
  }

  if (isPlainObject(value)) {
    let total = 0;

    for (const [key, nestedValue] of Object.entries(value)) {
      // IDs are already limited separately.
      if (key === 'id') {
        continue;
      }

      total += getTotalTextLength(nestedValue, depth + 1);

      if (total > MAX_TOTAL_TEXT_LENGTH) {
        return total;
      }
    }

    return total;
  }

  return 0;
}

function isSafeBoolean(value) {
  return typeof value === 'boolean';
}

function isSafeNumber(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  );
}

function validatePersonal(personal) {
  if (!isPlainObject(personal)) {
    return false;
  }

  const textFields = [
    'fullName',
    'jobTitle',
    'email',
    'phone',
    'address',
    'city',
    'postalCode',
    'website',
    'linkedin',
    'github',
    'careerObjectives',
    'photo',
  ];

  return textFields.every((field) => {
    const value = personal[field];

    return (
      value === undefined ||
      isSafeString(value)
    );
  });
}

function validateSectionItems(sections) {
  if (!isPlainObject(sections)) {
    return false;
  }

  // Reject unknown section names.
  for (const sectionName of Object.keys(sections)) {
    if (!ALLOWED_SECTION_NAMES.has(sectionName)) {
      return false;
    }
  }

  for (const [sectionName, maxItems] of Object.entries(MAX_SECTION_ITEMS)) {
    const items = sections[sectionName];

    if (items === undefined) {
      continue;
    }

    if (!Array.isArray(items)) {
      return false;
    }

    if (items.length > maxItems) {
      return false;
    }

    for (const item of items) {
      if (!isPlainObject(item)) {
        return false;
      }

      for (const [key, value] of Object.entries(item)) {
        // IDs have a smaller dedicated limit
        if (key === 'id') {
          if (
            value !== undefined &&
            !isSafeString(value, 200)
          ) {
            return false;
          }

          continue;
        }

        // Validate strings recursively, including strings
        // inside arrays and nested objects.
        if (!validateNestedText(value)) {
          return false;
        }
      }
    }
  }

  return true;
}

export function validateResume(resume) {
  if (!isPlainObject(resume)) {
    return false;
  }

  if (!isSafeString(resume.id, 200)) {
    return false;
  }

  if (
    resume.title !== undefined &&
    !isSafeString(resume.title, 200)
  ) {
    return false;
  }

  if (
    resume.templateId !== undefined &&
    !isSafeString(resume.templateId, 100)
  ) {
    return false;
  }

  if (
    resume.accentColor !== undefined &&
    !isSafeString(resume.accentColor, 20)
  ) {
    return false;
  }

  if (
    resume.fontSize !== undefined &&
    (!isSafeNumber(resume.fontSize) ||
      resume.fontSize < MIN_FONT_SIZE ||
      resume.fontSize > MAX_FONT_SIZE)
  ) {
    return false;
  }

  if (
    resume.spacing !== undefined &&
    (!isSafeNumber(resume.spacing) ||
      resume.spacing < MIN_SPACING ||
      resume.spacing > MAX_SPACING)
  ) {
    return false;
  }

  if (
    resume.updatedAt !== undefined &&
    !isSafeString(resume.updatedAt, 100)
  ) {
    return false;
  }

  if (!validatePersonal(resume.personal)) {
    return false;
  }

  if (!validateSectionItems(resume.sections)) {
    return false;
  }

  if (getTotalTextLength(resume) > MAX_TOTAL_TEXT_LENGTH) {
    return false;
  }
  return true;

}

export function validateResumes(resumes) {
  if (!Array.isArray(resumes)) {
    return [];
  }

  if (resumes.length > MAX_RESUMES) {
    return [];
  }

  return resumes.filter(validateResume);
}
