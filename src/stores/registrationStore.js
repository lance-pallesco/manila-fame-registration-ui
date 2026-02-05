/**
 * Registration Store (Pinia)
 *
 * Central state management for the multi-step registration process.
 * Maintains form data across steps and handles submission state.
 *
 * State persists when navigating between steps, allowing users to
 * go back and modify previous entries without losing data.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { submitRegistration } from '@/services/registrationService'
import { REGISTRATION_STEPS } from '@/constants/registration'

export const useRegistrationStore = defineStore('registration', () => {
  const currentStep = ref(1)

  const accountInfo = ref({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirmation: '',
    participationType: '',
  })

  const companyInfo = ref({
    companyName: '',
    addressLine: '',
    city: '',
    region: '',
    country: '',
    yearEstablished: '',
    website: '',
    brochure: null,
    brochurePath: '',
  })

  const isLoading = ref(false)
  const isSubmitted = ref(false)
  const errors = ref({})
  const submitError = ref('')
  const submissionResult = ref(null)

  const totalSteps = computed(() => REGISTRATION_STEPS.length)
  const currentStepConfig = computed(() =>
    REGISTRATION_STEPS.find((s) => s.step === currentStep.value),
  )

  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === totalSteps.value)
  const isComplete = computed(() => currentStep.value > totalSteps.value)
  const fullName = computed(() =>
    `${accountInfo.value.firstName} ${accountInfo.value.lastName}`.trim(),
  )

  const registrationData = computed(() => ({
    accountInfo: { ...accountInfo.value },
    companyInfo: {
      ...companyInfo.value,
      brochure: undefined,
    },
  }))

  const hasError = computed(() => (field) => {
    return !!errors.value[field]
  })

  const getError = computed(() => (field) => {
    const fieldErrors = errors.value[field]
    return Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
  })

  function nextStep() {
    if (currentStep.value < totalSteps.value + 1) {
      currentStep.value++
      clearErrors()
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
      clearErrors()
    }
  }

  function goToStep(step) {
    if (step >= 1 && step <= totalSteps.value + 1) {
      currentStep.value = step
      clearErrors()
    }
  }

  function updateAccountInfo(data) {
    accountInfo.value = { ...accountInfo.value, ...data }
  }

  function updateCompanyInfo(data) {
    companyInfo.value = { ...companyInfo.value, ...data }
  }

  function setErrors(fieldErrors) {
    errors.value = { ...fieldErrors }
  }

  function setFieldError(field, error) {
    errors.value = {
      ...errors.value,
      [field]: Array.isArray(error) ? error : [error],
    }
  }

  function clearErrors() {
    errors.value = {}
    submitError.value = ''
  }

  function clearFieldError(field) {
    const newErrors = { ...errors.value }
    delete newErrors[field]
    errors.value = newErrors
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  async function submit() {
    isLoading.value = true
    submitError.value = ''

    try {
      const result = await submitRegistration(registrationData.value)

      submissionResult.value = result.data
      isSubmitted.value = true
      currentStep.value = totalSteps.value + 1

      return true
    } catch (error) {
      if (error.isValidationError) {
        setErrors(error.errors)
        submitError.value = error.message
      } else {
        submitError.value = error.message || 'An unexpected error occurred. Please try again.'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  function resetForm() {
    currentStep.value = 1
    accountInfo.value = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      participationType: '',
    }
    companyInfo.value = {
      companyName: '',
      addressLine: '',
      city: '',
      region: '',
      country: '',
      yearEstablished: '',
      website: '',
      brochure: null,
      brochurePath: '',
    }
    isLoading.value = false
    isSubmitted.value = false
    errors.value = {}
    submitError.value = ''
    submissionResult.value = null
  }

  return {
    currentStep,
    accountInfo,
    companyInfo,
    isLoading,
    isSubmitted,
    errors,
    submitError,
    submissionResult,

    totalSteps,
    currentStepConfig,
    isFirstStep,
    isLastStep,
    isComplete,
    fullName,
    registrationData,
    hasError,
    getError,

    nextStep,
    prevStep,
    goToStep,
    updateAccountInfo,
    updateCompanyInfo,
    setErrors,
    setFieldError,
    clearErrors,
    clearFieldError,
    setLoading,
    submit,
    resetForm,
  }
})
