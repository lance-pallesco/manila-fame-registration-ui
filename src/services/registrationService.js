/**
 * Registration Service
 *
 * API functions for registration-related operations.
 * Currently uses mock responses; switch to apiClient when backend is ready.
 *
 * To switch to real API:
 * 1. Import apiClient instead of mock functions
 * 2. Replace mock function calls with apiClient.post/get calls
 * 3. Adjust response handling as needed
 */

import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/constants/registration'
import {
  mockCheckEmailUnique,
  mockCheckUsernameUnique,
  mockUploadBrochure,
  mockValidateStep,
  mockSubmitRegistration,
} from './mockService'

// Set to false to use real API (when Laravel backend is ready)
const USE_MOCK = true

/**
 * Check if email is unique/available
 * @param {string} email - Email to check
 * @returns {Promise<{data: {isUnique: boolean}, message: string}>}
 */
export const checkEmailUnique = async (email) => {
  if (USE_MOCK) {
    return mockCheckEmailUnique(email)
  }

  // Real API call (uncomment when backend is ready)
  const response = await apiClient.post(API_ENDPOINTS.validateEmail, { email })
  return response.data
}

/**
 * Check if username is unique/available
 * @param {string} username - Username to check
 * @returns {Promise<{data: {isUnique: boolean}, message: string}>}
 */
export const checkUsernameUnique = async (username) => {
  if (USE_MOCK) {
    return mockCheckUsernameUnique(username)
  }

  const response = await apiClient.post(API_ENDPOINTS.validateUsername, { username })
  return response.data
}

export const uploadBrochure = async (file, onProgress = null) => {
  if (USE_MOCK) {
    return mockUploadBrochure(file)
  }

  // Real API call with FormData for file upload
  const formData = new FormData()
  formData.append('brochure', file)

  const response = await apiClient.post(API_ENDPOINTS.uploadBrochure, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    },
  })

  return response.data
}

/**
 * Validate a specific registration step
 * @param {number} step - Step number (1, 2, or 3)
 * @param {object} data - Step data to validate
 * @returns {Promise<{data: {isValid: boolean, errors: object}, message: string}>}
 */
export const validateStep = async (step, data) => {
  if (USE_MOCK) {
    return mockValidateStep(step, data)
  }

  // Real API call
  const response = await apiClient.post(`${API_ENDPOINTS.register}/validate/${step}`, data)
  return response.data
}

/**
 * Submit complete registration
 * @param {object} registrationData - Complete registration data
 * @returns {Promise<{data: {registrationId: string, ...}, message: string}>}
 */
export const submitRegistration = async (registrationData) => {
  if (USE_MOCK) {
    return mockSubmitRegistration(registrationData)
  }

  // Real API call
  const response = await apiClient.post(API_ENDPOINTS.register, registrationData)
  return response.data
}

/**
 * Get registration status (for future use)
 * @param {string} registrationId - Registration ID
 * @returns {Promise<{data: object, message: string}>}
 */
export const getRegistrationStatus = async (registrationId) => {
  if (USE_MOCK) {
    // Mock implementation
    return {
      data: {
        registrationId,
        status: 'pending',
        message: 'Your registration is being processed',
      },
    }
  }

  const response = await apiClient.get(`${API_ENDPOINTS.register}/${registrationId}`)
  return response.data
}
