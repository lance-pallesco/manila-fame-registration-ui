/**
 * Axios API Client
 * 
 * Configured axios instance for API communication.
 * Includes request/response interceptors for authentication and error handling.
 * 
 * When Laravel backend is ready:
 * 1. Update BASE_URL to point to your Laravel API
 * 2. Configure CSRF token handling if using Sanctum
 * 3. Add authentication token to headers
 */

import axios from 'axios'

// Base URL placeholder - update when Laravel backend is ready
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/**
 * Request Interceptor
 * 
 * Runs before every request. Use this to:
 * - Add authentication tokens
 * - Add CSRF tokens (Laravel Sanctum)
 * - Log requests in development
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage (if using token-based auth)
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // For Laravel Sanctum, you might need XSRF token
    // const xsrfToken = document.cookie
    //   .split('; ')
    //   .find(row => row.startsWith('XSRF-TOKEN='))
    //   ?.split('=')[1]
    // if (xsrfToken) {
    //   config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
    // }

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
 * - Transform response data
 * - Handle token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly for convenience
    return response
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token')
          // Could emit event or redirect here
          break
        case 422:
          // Validation errors - Laravel returns these for form validation
          // Return the error response so components can handle validation errors
          return Promise.reject({
            isValidationError: true,
            errors: data.errors || {},
            message: data.message || 'Validation failed'
          })
        case 500:
          // Server error
          console.error('Server error:', data)
          break
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
