export const REGISTRATION_STEPS = [
  {
    step: 1,
    title: 'Account Information',
    subtitle: 'Create your account credentials',
    icon: 'mdi-account',
  },
  {
    step: 2,
    title: 'Company Information',
    subtitle: 'Tell us about your company',
    icon: 'mdi-domain',
  },
  {
    step: 3,
    title: 'Review & Submit',
    subtitle: 'Verify your information',
    icon: 'mdi-check-circle',
  },
]

export const PARTICIPATION_TYPES = [
  { value: 'exhibitor', title: 'Exhibitor' },
  { value: 'buyer', title: 'Buyer' },
  { value: 'visitor', title: 'Visitor' },
]

export const FILE_CONFIG = {
  maxSizeMB: 2,
  maxSizeBytes: 2 * 1024 * 1024,
  allowedTypes: ['.pdf', '.doc', '.docx'],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
}

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
  },
  username: {
    minLength: 3,
    maxLength: 50,
  },
  yearEstablished: {
    min: 1800,
    max: new Date().getFullYear(),
  },
}
