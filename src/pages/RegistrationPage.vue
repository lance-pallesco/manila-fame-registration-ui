<script setup>
import { computed } from 'vue'
import MultiStepLayout from '@/templates/MultiStepLayout.vue'
import AccountInformation from '@/views/registration/AccountInformation.vue'
import CompanyInformation from '@/views/registration/CompanyInformation.vue'
import RegistrationSummary from '@/views/registration/RegistrationSummary.vue'
import ThankYou from '@/views/registration/ThankYou.vue'
import { useRegistration } from '@/composables/useRegistration'

const {
  currentStep,
  totalSteps,
  isLoading,
  submitError,
  isComplete,
  canGoBack,
  canGoNext,
  canSubmit,
  goNext,
  goBack,
  goToStep,
  submitRegistration,
} = useRegistration()

// Determine which step component to render
const currentStepComponent = computed(() => {
  switch (currentStep.value) {
    case 1:
      return AccountInformation
    case 2:
      return CompanyInformation
    case 3:
      return RegistrationSummary
    default:
      return null
  }
})

const handleNext = () => {
  goNext()
}
const handleBack = () => {
  goBack()
}
const handleStepClick = (step) => {
  goToStep(step)
}
const handleEditStep = (step) => {
  goToStep(step)
}
const handleSubmit = async () => {
  await submitRegistration()
}
</script>

<template>
  <div class="registration-page">
    <MultiStepLayout
      v-if="!isComplete"
      :current-step="currentStep"
      :total-steps="totalSteps"
      :loading="isLoading"
      :show-back="canGoBack"
      :show-next="canGoNext"
      :show-submit="canSubmit"
      :error-message="submitError"
      @next="handleNext"
      @back="handleBack"
      @submit="handleSubmit"
      @step-click="handleStepClick"
    >
      <component :is="currentStepComponent" @edit-step="handleEditStep" />
    </MultiStepLayout>

    <v-card v-else class="thank-you-card mx-auto" max-width="900" elevation="4">
      <v-card-text class="pa-6 pa-md-10">
        <ThankYou />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.registration-page {
  padding: 1rem 0;
}

.thank-you-card {
  border-radius: 16px;
  overflow: hidden;
}
</style>
