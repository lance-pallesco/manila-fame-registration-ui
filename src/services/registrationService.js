/**
 * Registration Service
 *
 * Handles registration API communication with the Laravel backend.
 * Uses a single endpoint: POST /api/register
 */

import apiClient from './apiClient'

/**
 * Convert camelCase to snake_case
 * @param {string} str - camelCase string
 * @returns {string} snake_case string
 */
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Build FormData with nested field names for Laravel
 * 
 * Converts the frontend data structure to Laravel's expected format:
 * { accountInfo: { firstName: 'John' } } → FormData with 'account_info[first_name]' = 'John'
 * 
 * @param {object} data - Registration data object
 * @param {File|null} brochure - Optional brochure file
 * @returns {FormData}
 */
const buildFormData = (data, brochure = null) => {
  const formData = new FormData()

  // Add account_info fields
  if (data.accountInfo) {
    Object.entries(data.accountInfo).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const snakeKey = toSnakeCase(key)
        formData.append(`account_info[${snakeKey}]`, value)
      }
    })
  }

  // Add company_info fields
  if (data.companyInfo) {
    Object.entries(data.companyInfo).forEach(([key, value]) => {
      // Skip brochure and brochurePath - handled separately
      if (key === 'brochure' || key === 'brochurePath') return
      
      if (value !== undefined && value !== null && value !== '') {
        const snakeKey = toSnakeCase(key)
        formData.append(`company_info[${snakeKey}]`, value)
      }
    })
  }

  // Add brochure file if provided
  if (brochure) {
    formData.append('brochure', brochure)
  }

  return formData
}

/**
 * Submit complete registration
 * 
 * Sends all registration data to the Laravel backend as multipart/form-data.
 * The backend validates all fields and returns:
 * - 201: Registration successful
 * - 422: Validation errors (field-level errors)
 * - 500: Server error
 * 
 * @param {object} registrationData - Complete registration data from store
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const submitRegistration = async (registrationData) => {
  // Get the brochure file from companyInfo (if any)
  const brochure = registrationData.companyInfo?.brochure || null

  // Build FormData with proper field naming for Laravel
  const formData = buildFormData(registrationData, brochure)

  // Send as multipart/form-data to the single registration endpoint
  const response = await apiClient.post('/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
