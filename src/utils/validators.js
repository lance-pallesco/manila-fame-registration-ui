/**
 * Validation Utility Functions
 * 
 * Pure validation functions for use in form validation.
 * These functions return true for valid values, false for invalid.
 */

import { FILE_CONFIG, VALIDATION_RULES } from '@/constants/registration'

/**
 * Check if value is not empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate email format
 * @param {string} value - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (value) => {
  if (!value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * Check minimum length
 * @param {string} value - String to check
 * @param {number} min - Minimum length
 * @returns {boolean}
 */
export const hasMinLength = (value, min) => {
  if (!value) return false
  return value.length >= min
}

/**
 * Check maximum length
 * @param {string} value - String to check
 * @param {number} max - Maximum length
 * @returns {boolean}
 */
export const hasMaxLength = (value, max) => {
  if (!value) return true
  return value.length <= max
}

/**
 * Validate password matches confirmation
 * @param {string} password - Password
 * @param {string} confirmation - Password confirmation
 * @returns {boolean}
 */
export const passwordsMatch = (password, confirmation) => {
  return password === confirmation
}

/**
 * Validate year is within range
 * @param {number|string} value - Year to validate
 * @param {number} min - Minimum year (default from constants)
 * @param {number} max - Maximum year (default current year)
 * @returns {boolean}
 */
export const isValidYear = (
  value,
  min = VALIDATION_RULES.yearEstablished.min,
  max = VALIDATION_RULES.yearEstablished.max
) => {
  const year = parseInt(value, 10)
  if (isNaN(year)) return false
  return year >= min && year <= max
}

/**
 * Validate URL format
 * @param {string} value - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = (value) => {
  if (!value) return true // URL is often optional
  try {
    // Allow URLs without protocol by prepending https://
    const urlToTest = value.startsWith('http') ? value : `https://${value}`
    new URL(urlToTest)
    return true
  } catch {
    return false
  }
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxMB - Maximum size in MB (default from constants)
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxMB = FILE_CONFIG.maxSizeMB) => {
  if (!file) return true
  const maxBytes = maxMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types (default from constants)
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes = FILE_CONFIG.allowedMimeTypes) => {
  if (!file) return true
  return allowedTypes.includes(file.type)
}

/**
 * Validate username format (alphanumeric, underscores, hyphens)
 * @param {string} value - Username to validate
 * @returns {boolean}
 */
export const isValidUsername = (value) => {
  if (!value) return false
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  return usernameRegex.test(value)
}
