<script setup>
/**
 * MultiStepLayout Template
 * 
 * Reusable layout for multi-step forms with stepper progress indicator,
 * navigation buttons, and animated step transitions.
 */
import { computed } from 'vue'
import { REGISTRATION_STEPS } from '@/constants/registration'

const props = defineProps({
  // Current step number (1-based)
  currentStep: {
    type: Number,
    required: true
  },
  // Total number of steps
  totalSteps: {
    type: Number,
    default: REGISTRATION_STEPS.length
  },
  // Loading state
  loading: {
    type: Boolean,
    default: false
  },
  // Show back button
  showBack: {
    type: Boolean,
    default: true
  },
  // Show next button
  showNext: {
    type: Boolean,
    default: true
  },
  // Show submit button (replaces next on last step)
  showSubmit: {
    type: Boolean,
    default: false
  },
  // Custom next button text
  nextText: {
    type: String,
    default: 'Continue'
  },
  // Custom submit button text
  submitText: {
    type: String,
    default: 'Submit Registration'
  },
  // Custom back button text
  backText: {
    type: String,
    default: 'Back'
  },
  // Error message to display
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['next', 'back', 'submit', 'step-click'])

// Steps configuration for stepper
const steps = computed(() => REGISTRATION_STEPS)

// Determine if a step is complete
const isStepComplete = (stepNumber) => stepNumber < props.currentStep

// Determine if a step is active
const isStepActive = (stepNumber) => stepNumber === props.currentStep

// Get step color
const getStepColor = (stepNumber) => {
  if (isStepComplete(stepNumber)) return 'success'
  if (isStepActive(stepNumber)) return 'primary'
  return 'grey'
}

// Progress percentage
const progress = computed(() => ((props.currentStep - 1) / props.totalSteps) * 100)

// Handle step click (only allow going back)
const handleStepClick = (step) => {
  if (step < props.currentStep) {
    emit('step-click', step)
  }
}
</script>

<template>
  <v-card class="multi-step-layout mx-auto" max-width="900" elevation="4">
    <!-- Card Header with Title -->
    <v-card-title class="card-header pa-6 pb-4">
      <div class="text-center">
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          Manila FAME 2026
        </h1>
        <p class="text-body-1 text-grey-darken-1 mb-0">
          Event Registration
        </p>
      </div>
    </v-card-title>

    <!-- Progress Bar -->
    <v-progress-linear
      :model-value="progress"
      color="primary"
      height="4"
      class="progress-bar"
    />

    <!-- Stepper -->
    <div class="stepper-container px-4 px-md-8 pt-6">
      <v-stepper
        :model-value="currentStep"
        alt-labels
        flat
        bg-color="transparent"
        class="elevation-0"
      >
        <v-stepper-header>
          <template v-for="(step, index) in steps" :key="step.step">
            <v-stepper-item
              :value="step.step"
              :title="step.title"
              :subtitle="step.subtitle"
              :complete="isStepComplete(step.step)"
              :color="getStepColor(step.step)"
              :editable="step.step < currentStep"
              :icon="step.icon"
              @click="handleStepClick(step.step)"
            />
            <v-divider
              v-if="index < steps.length - 1"
              :class="{ 'divider-complete': isStepComplete(step.step + 1) }"
            />
          </template>
        </v-stepper-header>
      </v-stepper>
    </div>

    <!-- Error Alert -->
    <v-expand-transition>
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        closable
        class="mx-4 mx-md-8 mt-4"
      >
        {{ errorMessage }}
      </v-alert>
    </v-expand-transition>

    <!-- Step Content -->
    <v-card-text class="step-content px-4 px-md-8 py-6">
      <Transition name="step" mode="out-in">
        <div :key="currentStep">
          <slot />
        </div>
      </Transition>
    </v-card-text>

    <!-- Navigation Buttons -->
    <v-card-actions class="navigation-actions pa-4 pa-md-6 pt-0">
      <v-btn
        v-if="showBack && currentStep > 1"
        variant="outlined"
        color="grey-darken-1"
        size="large"
        :disabled="loading"
        @click="emit('back')"
      >
        <v-icon icon="mdi-arrow-left" class="mr-2" />
        {{ backText }}
      </v-btn>

      <v-spacer />

      <!-- Next Button -->
      <v-btn
        v-if="showNext && !showSubmit"
        color="primary"
        size="large"
        :loading="loading"
        @click="emit('next')"
      >
        {{ nextText }}
        <v-icon icon="mdi-arrow-right" class="ml-2" />
      </v-btn>

      <!-- Submit Button -->
      <v-btn
        v-if="showSubmit"
        color="success"
        size="large"
        :loading="loading"
        @click="emit('submit')"
      >
        <v-icon icon="mdi-check-circle" class="mr-2" />
        {{ submitText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.multi-step-layout {
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f4fd 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.progress-bar {
  background: #e0e0e0;
}

.stepper-container :deep(.v-stepper-header) {
  box-shadow: none;
}

.stepper-container :deep(.v-stepper-item) {
  opacity: 1;
}

.stepper-container :deep(.v-stepper-item--selected) {
  opacity: 1;
}

.divider-complete {
  border-color: rgb(var(--v-theme-success)) !important;
  opacity: 1;
}

.step-content {
  min-height: 300px;
}

.navigation-actions {
  background: #fafafa;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Step transition animations */
.step-enter-active,
.step-leave-active {
  transition: all 0.3s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
