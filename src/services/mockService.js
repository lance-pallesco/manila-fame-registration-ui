/**
 * Mock Service
 * 
 * Simulates Laravel API responses for frontend development.
 * Replace these with actual API calls when backend is ready.
 * 
 * Response format follows Laravel conventions:
 * - Success: { data: {...}, message: '...' }
 * - Error: { message: '...', errors: { field: ['error'] } }
 */

// Simulated delay to mimic network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Simulated database of registered emails/usernames for uniqueness checks
const registeredEmails = ['test@example.com', 'admin@manilafame.com']
const registeredUsernames = ['admin', 'testuser', 'johndoe']

/**
 * Mock: Check if email is unique
 * @param {string} email - Email to check
 * @returns {Promise<{isUnique: boolean}>}
 */
export const mockCheckEmailUnique = async (email) => {
  await delay(500) // Simulate network delay
  
  const isUnique = !registeredEmails.includes(email.toLowerCase())
  
  return {
    data: { isUnique },
    message: isUnique ? 'Email is available' : 'Email is already registered'
  }
}

/**
 * Mock: Check if username is unique
 * @param {string} username - Username to check
 * @returns {Promise<{isUnique: boolean}>}
 */
export const mockCheckUsernameUnique = async (username) => {
  await delay(500) // Simulate network delay
  
  const isUnique = !registeredUsernames.includes(username.toLowerCase())
  
  return {
    data: { isUnique },
    message: isUnique ? 'Username is available' : 'Username is already taken'
  }
}

/**
 * Mock: Upload brochure file
 * @param {File} file - File to upload
 * @returns {Promise<{filePath: string, fileName: string}>}
 */
export const mockUploadBrochure = async (file) => {
  await delay(1000) // Simulate upload time
  
  // Simulate file upload response
  return {
    data: {
      filePath: `/uploads/brochures/${Date.now()}_${file.name}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    },
    message: 'File uploaded successfully'
  }
}

/**
 * Mock: Validate registration step
 * @param {number} step - Step number to validate
 * @param {object} data - Step data to validate
 * @returns {Promise<{isValid: boolean, errors: object}>}
 */
export const mockValidateStep = async (step, data) => {
  await delay(300) // Simulate validation delay
  
  // Simulate backend validation (could add more complex rules here)
  const errors = {}
  
  if (step === 1) {
    if (registeredEmails.includes(data.email?.toLowerCase())) {
      errors.email = ['This email is already registered']
    }
    if (registeredUsernames.includes(data.username?.toLowerCase())) {
      errors.username = ['This username is already taken']
    }
  }
  
  const isValid = Object.keys(errors).length === 0
  
  return {
    data: { isValid, errors },
    message: isValid ? 'Validation passed' : 'Validation failed'
  }
}

/**
 * Mock: Submit registration
 * @param {object} registrationData - Complete registration data
 * @returns {Promise<{registrationId: string, ...}>}
 */
export const mockSubmitRegistration = async (registrationData) => {
  await delay(1500) // Simulate processing time
  
  // Simulate random failure for testing (10% chance)
  // Remove this in production-like mock
  if (Math.random() < 0.1) {
    throw {
      isValidationError: true,
      message: 'Registration failed due to server error',
      errors: {}
    }
  }
  
  // Generate mock registration ID
  const registrationId = `MF-${Date.now().toString(36).toUpperCase()}`
  
  return {
    data: {
      registrationId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      accountInfo: {
        email: registrationData.accountInfo.email,
        username: registrationData.accountInfo.username,
        participationType: registrationData.accountInfo.participationType
      },
      companyInfo: {
        companyName: registrationData.companyInfo.companyName,
        country: registrationData.companyInfo.country
      }
    },
    message: 'Registration submitted successfully! Please check your email for confirmation.'
  }
}
