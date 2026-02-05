import { computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrationStore'
import {
  isRequired,
  isValidEmail,
  hasMinLength,
  isValidUsername,
  passwordsMatch,
  isValidYear,
  isValidUrl,
  isValidFileSize,
  isValidFileType,
} from '@/utils/validators'
import { VALIDATION_RULES, FILE_CONFIG } from '@/constants/registration'

export function useRegistration() {
  const store = useRegistrationStore()

  const rules = {
    required: (v) => isRequired(v) || 'This field is required',

    email: (v) => isValidEmail(v) || 'Please enter a valid email address',

    username: (v) =>
      isValidUsername(v) || 'Username can only contain letters, numbers, underscores, and hyphens',

    usernameLength: (v) =>
      hasMinLength(v, VALIDATION_RULES.username.minLength) ||
      `Username must be at least ${VALIDATION_RULES.username.minLength} characters`,

    passwordLength: (v) =>
      hasMinLength(v, VALIDATION_RULES.password.minLength) ||
      `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,

    passwordMatch: (password) => (v) => passwordsMatch(v, password) || 'Passwords do not match',

    year: (v) => {
      if (!v) return true // Optional field
      return (
        isValidYear(v) ||
        `Year must be between ${VALIDATION_RULES.yearEstablished.min} and ${VALIDATION_RULES.yearEstablished.max}`
      )
    },

    url: (v) => isValidUrl(v) || 'Please enter a valid URL',

    fileSize: (v) => {
      if (!v || !v.length) return true
      return isValidFileSize(v[0]) || `File size must be less than ${FILE_CONFIG.maxSizeMB}MB`
    },

    fileType: (v) => {
      if (!v || !v.length) return true
      return isValidFileType(v[0]) || `Allowed file types: ${FILE_CONFIG.allowedTypes.join(', ')}`
    },
  }

  const validateStep1 = () => {
    const errors = {}
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      passwordConfirmation,
      participationType,
    } = store.accountInfo

    if (!isRequired(firstName)) errors.firstName = ['First name is required']
    if (!isRequired(lastName)) errors.lastName = ['Last name is required']

    if (!isRequired(email)) {
      errors.email = ['Email is required']
    } else if (!isValidEmail(email)) {
      errors.email = ['Please enter a valid email address']
    }

    if (!isRequired(username)) {
      errors.username = ['Username is required']
    } else if (!isValidUsername(username)) {
      errors.username = ['Username can only contain letters, numbers, underscores, and hyphens']
    } else if (!hasMinLength(username, VALIDATION_RULES.username.minLength)) {
      errors.username = [
        `Username must be at least ${VALIDATION_RULES.username.minLength} characters`,
      ]
    }

    if (!isRequired(password)) {
      errors.password = ['Password is required']
    } else if (!hasMinLength(password, VALIDATION_RULES.password.minLength)) {
      errors.password = [
        `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,
      ]
    }

    if (!passwordsMatch(password, passwordConfirmation)) {
      errors.passwordConfirmation = ['Passwords do not match']
    }

    if (!isRequired(participationType)) {
      errors.participationType = ['Please select a participation type']
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const validateStep2 = () => {
    const errors = {}
    const { companyName, addressLine, city, country, yearEstablished, website, brochure } =
      store.companyInfo

    if (!isRequired(companyName)) errors.companyName = ['Company name is required']
    if (!isRequired(addressLine)) errors.addressLine = ['Address is required']
    if (!isRequired(city)) errors.city = ['City is required']
    if (!isRequired(country)) errors.country = ['Country is required']

    if (yearEstablished && !isValidYear(yearEstablished)) {
      errors.yearEstablished = [
        `Year must be between ${VALIDATION_RULES.yearEstablished.min} and ${VALIDATION_RULES.yearEstablished.max}`,
      ]
    }

    if (website && !isValidUrl(website)) {
      errors.website = ['Please enter a valid URL']
    }

    if (brochure) {
      if (!isValidFileSize(brochure)) {
        errors.brochure = [`File size must be less than ${FILE_CONFIG.maxSizeMB}MB`]
      } else if (!isValidFileType(brochure)) {
        errors.brochure = [`Allowed file types: ${FILE_CONFIG.allowedTypes.join(', ')}`]
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const validateCurrentStep = () => {
    switch (store.currentStep) {
      case 1:
        return validateStep1()
      case 2:
        return validateStep2()
      case 3:
        return { isValid: true, errors: {} }
      default:
        return { isValid: true, errors: {} }
    }
  }

  const goNext = () => {
    const { isValid, errors } = validateCurrentStep()

    if (!isValid) {
      store.setErrors(errors)
      return false
    }

    store.clearErrors()
    store.nextStep()
    return true
  }

  const goBack = () => {
    store.clearErrors()
    store.prevStep()
  }

  const goToStep = (step) => {
    if (step < store.currentStep) {
      store.goToStep(step)
      return true
    }

    const { isValid, errors } = validateCurrentStep()
    if (!isValid) {
      store.setErrors(errors)
      return false
    }

    store.goToStep(step)
    return true
  }

  const submitRegistration = async () => {
    const step1 = validateStep1()
    const step2 = validateStep2()

    if (!step1.isValid || !step2.isValid) {
      store.setErrors({ ...step1.errors, ...step2.errors })
      return false
    }

    return await store.submit()
  }

  const canGoBack = computed(() => !store.isFirstStep && !store.isLoading)
  const canGoNext = computed(() => !store.isLastStep && !store.isLoading)
  const canSubmit = computed(() => store.isLastStep && !store.isLoading)
  const isComplete = computed(() => store.isComplete)
  const progress = computed(() => (store.currentStep / store.totalSteps) * 100)

  return {
    currentStep: computed(() => store.currentStep),
    totalSteps: computed(() => store.totalSteps),
    currentStepConfig: computed(() => store.currentStepConfig),
    accountInfo: computed(() => store.accountInfo),
    companyInfo: computed(() => store.companyInfo),
    isLoading: computed(() => store.isLoading),
    isSubmitted: computed(() => store.isSubmitted),
    errors: computed(() => store.errors),
    submitError: computed(() => store.submitError),
    submissionResult: computed(() => store.submissionResult),
    fullName: computed(() => store.fullName),

    canGoBack,
    canGoNext,
    canSubmit,
    isComplete,
    progress,

    rules,

    validateStep1,
    validateStep2,
    validateCurrentStep,

    goNext,
    goBack,
    goToStep,

    submitRegistration,
    updateAccountInfo: store.updateAccountInfo,
    updateCompanyInfo: store.updateCompanyInfo,
    clearFieldError: store.clearFieldError,
    resetForm: store.resetForm,
  }
}
