<script setup>
/**
 * Thank You Page (Post-Submission)
 * 
 * Displays registration success message and confirmation details
 * after successful form submission.
 */
import { computed } from 'vue'
import { useRegistration } from '@/composables/useRegistration'
import { PARTICIPATION_TYPES } from '@/constants/registration'

const {
  submissionResult,
  fullName,
  accountInfo,
  companyInfo,
  resetForm
} = useRegistration()

// Generate a random registration reference number for the user
// Format: MF-2026-XXXXXX (6 random digits)
const registrationId = `MF-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`

// Get participation type label
const participationLabel = computed(() => {
  const type = PARTICIPATION_TYPES.find(t => t.value === accountInfo.value.participationType)
  return type?.title || accountInfo.value.participationType
})

// Format submission date
const submissionDate = computed(() => {
  if (!submissionResult.value?.submittedAt) return new Date().toLocaleDateString()
  return new Date(submissionResult.value.submittedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Handle new registration
const startNewRegistration = () => {
  resetForm()
}
</script>

<template>
  <div class="thank-you-page">
    <!-- Success Animation -->
    <div class="success-icon-container">
      <v-icon
        icon="mdi-check-circle"
        color="success"
        size="100"
        class="success-icon"
      />
    </div>

    <!-- Success Message -->
    <div class="text-center mb-8">
      <h1 class="text-h4 font-weight-bold text-success mb-3">
        Registration Successful!
      </h1>
      <p class="text-body-1 text-grey-darken-1">
        Thank you for registering for Manila FAME 2026, {{ fullName }}!
      </p>
    </div>

    <!-- Registration ID Card -->
    <v-card 
      variant="outlined" 
      color="success"
      class="registration-id-card mx-auto mb-6"
      max-width="400"
    >
      <v-card-text class="text-center py-6">
        <div class="text-caption text-success text-uppercase font-weight-bold mb-2">
          Your Registration ID
        </div>
        <div class="text-h4 font-weight-bold text-success">
          {{ registrationId }}
        </div>
        <div class="text-caption text-grey mt-2">
          Please save this ID for your records
        </div>
      </v-card-text>
    </v-card>

    <!-- Confirmation Details -->
    <v-card variant="flat" class="confirmation-card mb-6">
      <v-card-title class="text-h6 pb-0">
        <v-icon icon="mdi-clipboard-check" class="mr-2" />
        Registration Summary
      </v-card-title>
      <v-card-text>
        <v-list density="compact" class="bg-transparent">
          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-account" color="primary" />
            </template>
            <v-list-item-title class="text-caption text-grey">Name</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ fullName }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-email" color="primary" />
            </template>
            <v-list-item-title class="text-caption text-grey">Email</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ accountInfo.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-domain" color="primary" />
            </template>
            <v-list-item-title class="text-caption text-grey">Company</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ companyInfo.companyName }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-badge-account" color="primary" />
            </template>
            <v-list-item-title class="text-caption text-grey">Participation Type</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ participationLabel }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon icon="mdi-calendar-check" color="primary" />
            </template>
            <v-list-item-title class="text-caption text-grey">Submitted On</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ submissionDate }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Next Steps -->
    <v-alert
      type="info"
      variant="tonal"
      class="mb-6"
    >
      <div class="font-weight-bold mb-2">What's Next?</div>
      <ul class="pl-4 mb-0">
        <li>Check your email for a confirmation message</li>
        <li>Our team will review your registration</li>
        <li>You'll receive your event pass within 3-5 business days</li>
      </ul>
    </v-alert>

    <!-- Action Buttons -->
    <div class="text-center">
      <v-btn
        color="primary"
        variant="outlined"
        size="large"
        @click="startNewRegistration"
      >
        <v-icon icon="mdi-plus" class="mr-2" />
        Register Another Participant
      </v-btn>
    </div>

    <!-- Contact Info -->
    <div class="text-center mt-8 text-grey">
      <p class="text-body-2 mb-1">
        Questions about your registration?
      </p>
      <p class="text-body-2">
        Contact us at 
        <a href="mailto:registration@manilafame.com" class="text-primary">
          registration@manilafame.com
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.thank-you-page {
  padding: 1rem 0;
  max-width: 600px;
  margin: 0 auto;
}

.success-icon-container {
  text-align: center;
  margin-bottom: 1.5rem;
}

.success-icon {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.registration-id-card {
  border-width: 2px;
  border-style: dashed;
}

.confirmation-card {
  background: #f5f5f5;
  border-radius: 12px;
}
</style>
