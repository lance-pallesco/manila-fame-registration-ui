/**
 * Axios API Client
 * 
 * Configured axios instance for API communication with Laravel backend.
 * Includes request/response interceptors for error handling.
 */

import axios from 'axios'

// Base URL - reads from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Accept': 'application/json'
  }
})

/**
 * Convert snake_case to camelCase
 * @param {string} str - snake_case string
 * @returns {string} camelCase string
 */
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * Transform Laravel validation error keys to frontend field names
 * Converts 'account_info.first_name' to 'firstName'
 * 
 * @param {object} errors - Laravel validation errors
 * @returns {object} Transformed errors with camelCase field names
 */
const transformValidationErrors = (errors) => {
  const transformed = {}
  
  for (const [key, messages] of Object.entries(errors)) {
    // Remove 'account_info.' or 'company_info.' prefix and convert to camelCase
    let fieldName = key
      .replace(/^account_info\./, '')
      .replace(/^company_info\./, '')
    
    // Convert snake_case to camelCase
    fieldName = toCamelCase(fieldName)
    
    transformed[fieldName] = messages
  }
  
  return transformed
}

/**
 * Request Interceptor
 * 
 * Runs before every request. Use this to:
 * - Add authentication tokens
 * - Log requests in development
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage (if using token-based auth)
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * 
 * Runs after every response. Use this to:
 * - Handle common error responses
 * - Transform Laravel validation errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API] Response:`, response.status, response.data)
    }
    return response
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response

      // Log errors in development
      if (import.meta.env.DEV) {
        console.error(`[API] Error ${status}:`, data)
      }

      switch (status) {
        case 401:
          // Unauthorized - clear token
          localStorage.removeItem('auth_token')
          break
          
        case 422:
          // Validation errors - Laravel returns these for form validation
          // Transform error keys to match frontend field names
          const transformedErrors = data.errors 
            ? transformValidationErrors(data.errors)
            : {}
          
          return Promise.reject({
            isValidationError: true,
            errors: transformedErrors,
            message: data.message || 'Validation failed'
          })
          
        case 500:
          // Server error
          return Promise.reject({
            isValidationError: false,
            errors: {},
            message: data.message || 'Server error. Please try again later.'
          })
      }
    } else if (error.request) {
      // Network error - no response received
      return Promise.reject({
        isValidationError: false,
        errors: {},
        message: 'Unable to connect to server. Please check your internet connection.'
      })
    }

    return Promise.reject({
      isValidationError: false,
      errors: {},
      message: error.message || 'An unexpected error occurred.'
    })
  }
)

export default apiClient
