<script setup>
import { computed } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import FormSection from '@/components/forms/FormSection.vue'
import { useRegistration } from '@/composables/useRegistration'
import { PARTICIPATION_TYPES } from '@/constants/registration'

const { accountInfo, errors, rules, updateAccountInfo, clearFieldError } = useRegistration()

const firstName = computed({
  get: () => accountInfo.value.firstName,
  set: (val) => {
    updateAccountInfo({ firstName: val })
    clearFieldError('firstName')
  },
})

const lastName = computed({
  get: () => accountInfo.value.lastName,
  set: (val) => {
    updateAccountInfo({ lastName: val })
    clearFieldError('lastName')
  },
})

const email = computed({
  get: () => accountInfo.value.email,
  set: (val) => {
    updateAccountInfo({ email: val })
    clearFieldError('email')
  },
})

const username = computed({
  get: () => accountInfo.value.username,
  set: (val) => {
    updateAccountInfo({ username: val })
    clearFieldError('username')
  },
})

const password = computed({
  get: () => accountInfo.value.password,
  set: (val) => {
    updateAccountInfo({ password: val })
    clearFieldError('password')
  },
})

const passwordConfirmation = computed({
  get: () => accountInfo.value.passwordConfirmation,
  set: (val) => {
    updateAccountInfo({ passwordConfirmation: val })
    clearFieldError('passwordConfirmation')
  },
})

const participationType = computed({
  get: () => accountInfo.value.participationType,
  set: (val) => {
    updateAccountInfo({ participationType: val })
    clearFieldError('participationType')
  },
})

const getError = (field) => {
  const fieldErrors = errors.value[field]
  return Array.isArray(fieldErrors) ? fieldErrors : []
}
</script>

<template>
  <div class="account-information">
    <FormSection
      title="Personal Information"
      icon="mdi-account"
      subtitle="Enter your basic details"
      divider
    >
      <v-row>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="firstName"
            label="First Name"
            placeholder="Enter your first name"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
            :error-messages="getError('firstName')"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            prepend-inner-icon="mdi-account-outline"
            :rules="[rules.required]"
            :error-messages="getError('lastName')"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <BaseInput
            v-model="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            prepend-inner-icon="mdi-email-outline"
            hint="We'll use this to send your registration confirmation"
            :rules="[rules.required, rules.email]"
            :error-messages="getError('email')"
            required
          />
        </v-col>
      </v-row>
    </FormSection>

    <FormSection
      title="Account Credentials"
      icon="mdi-lock"
      subtitle="Create your login credentials"
      divider
    >
      <v-row>
        <v-col cols="12">
          <BaseInput
            v-model="username"
            label="Username"
            placeholder="Choose a username"
            prepend-inner-icon="mdi-at"
            hint="Alphanumeric characters, underscores, and hyphens only"
            :rules="[rules.required, rules.username, rules.usernameLength]"
            :error-messages="getError('username')"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            prepend-inner-icon="mdi-lock-outline"
            hint="Minimum 8 characters"
            :rules="[rules.required, rules.passwordLength]"
            :error-messages="getError('password')"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="passwordConfirmation"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            prepend-inner-icon="mdi-lock-check-outline"
            :rules="[rules.required, rules.passwordMatch(password)]"
            :error-messages="getError('passwordConfirmation')"
            required
          />
        </v-col>
      </v-row>
    </FormSection>

    <!-- Participation Type Section -->
    <FormSection
      title="Participation Details"
      icon="mdi-badge-account"
      subtitle="Select how you'll participate in Manila FAME 2026"
    >
      <v-row>
        <v-col cols="12">
          <BaseSelect
            v-model="participationType"
            label="Type of Participation"
            :items="PARTICIPATION_TYPES"
            placeholder="Select your participation type"
            prepend-inner-icon="mdi-account-group"
            :rules="[rules.required]"
            :error-messages="getError('participationType')"
            required
          />
        </v-col>
      </v-row>

      <!-- Participation Type Info -->
      <v-expand-transition>
        <v-alert
          v-if="participationType"
          type="info"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          <template v-if="participationType === 'exhibitor'">
            <strong>Exhibitor:</strong> Showcase your products and connect with buyers from around
            the world.
          </template>
          <template v-else-if="participationType === 'buyer'">
            <strong>Buyer:</strong> Discover unique Philippine products and source directly from
            artisans.
          </template>
          <template v-else-if="participationType === 'visitor'">
            <strong>Visitor:</strong> Explore the exhibition and experience Philippine
            craftsmanship.
          </template>
        </v-alert>
      </v-expand-transition>
    </FormSection>
  </div>
</template>

<style scoped>
.account-information {
  padding: 0.5rem 0;
}
</style>
