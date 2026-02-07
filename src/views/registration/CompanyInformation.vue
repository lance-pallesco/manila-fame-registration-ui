<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue'
import FormSection from '@/components/forms/FormSection.vue'
import { useRegistration } from '@/composables/useRegistration'
import { FILE_CONFIG } from '@/constants/registration'
import { fetchCountries } from '@/services/countriesService'

const { companyInfo, errors, rules, updateCompanyInfo, clearFieldError } = useRegistration()

// Countries data from API
const countries = ref([])
const countriesLoading = ref(false)

// Fetch countries on mount
onMounted(async () => {
  countriesLoading.value = true
  countries.value = await fetchCountries()
  countriesLoading.value = false
})

const companyName = computed({
  get: () => companyInfo.value.companyName,
  set: (val) => {
    updateCompanyInfo({ companyName: val })
    clearFieldError('companyName')
  },
})

const addressLine = computed({
  get: () => companyInfo.value.addressLine,
  set: (val) => {
    updateCompanyInfo({ addressLine: val })
    clearFieldError('addressLine')
  },
})

const city = computed({
  get: () => companyInfo.value.city,
  set: (val) => {
    updateCompanyInfo({ city: val })
    clearFieldError('city')
  },
})

const region = computed({
  get: () => companyInfo.value.region,
  set: (val) => {
    updateCompanyInfo({ region: val })
    clearFieldError('region')
  },
})

const country = computed({
  get: () => companyInfo.value.country,
  set: (val) => {
    updateCompanyInfo({ country: val })
    clearFieldError('country')
  },
})

const yearEstablished = computed({
  get: () => companyInfo.value.yearEstablished,
  set: (val) => {
    updateCompanyInfo({ yearEstablished: val })
    clearFieldError('yearEstablished')
  },
})

const website = computed({
  get: () => companyInfo.value.website,
  set: (val) => {
    updateCompanyInfo({ website: val })
    clearFieldError('website')
  },
})

const brochure = computed({
  get: () => companyInfo.value.brochure,
  set: (val) => {
    updateCompanyInfo({ brochure: val })
    clearFieldError('brochure')
  },
})

const getError = (field) => {
  const fieldErrors = errors.value[field]
  return Array.isArray(fieldErrors) ? fieldErrors : []
}

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="company-information">
    <FormSection
      title="Company Details"
      icon="mdi-domain"
      subtitle="Tell us about your organization"
      divider
    >
      <v-row>
        <v-col cols="12">
          <BaseInput
            v-model="companyName"
            label="Company Name"
            placeholder="Enter your company name"
            prepend-inner-icon="mdi-office-building"
            :rules="[rules.required]"
            :error-messages="getError('companyName')"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="yearEstablished"
            label="Year Established"
            type="number"
            placeholder="e.g., 2010"
            prepend-inner-icon="mdi-calendar"
            :hint="`Enter a year between 1800 and ${currentYear}`"
            :rules="[rules.required, rules.year]"
            :error-messages="getError('yearEstablished')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="website"
            label="Website"
            placeholder="https://www.example.com"
            prepend-inner-icon="mdi-web"
            hint="Optional - Enter your company website"
            :rules="[rules.url]"
            :error-messages="getError('website')"
          />
        </v-col>
      </v-row>
    </FormSection>

    <FormSection
      title="Company Address"
      icon="mdi-map-marker"
      subtitle="Where is your company located?"
      divider
    >
      <v-row>
        <v-col cols="12">
          <BaseInput
            v-model="addressLine"
            label="Address Line"
            placeholder="Street address, building, floor, etc."
            prepend-inner-icon="mdi-home"
            :rules="[rules.required]"
            :error-messages="getError('addressLine')"
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <BaseInput
            v-model="city"
            label="Town / City"
            placeholder="Enter city name"
            prepend-inner-icon="mdi-city"
            :rules="[rules.required]"
            :error-messages="getError('city')"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="country"
            label="Country"
            :items="countries"
            item-value="value"
            item-title="title"
            prepend-inner-icon="mdi-flag"
            :loading="countriesLoading"
            :rules="[rules.required]"
            :error-messages="getError('country')"
            placeholder="Search for a country"
            clearable
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <BaseInput
            v-model="region"
            label="Region / State / Province"
            placeholder="Enter your region, state, or province"
            prepend-inner-icon="mdi-map"
            hint="Optional - Enter your region or state"
            :error-messages="getError('region')"
          />
        </v-col>
      </v-row>
    </FormSection>

    <FormSection
      title="Company Brochure"
      icon="mdi-file-document"
      subtitle="Upload your company profile (optional)"
    >
      <v-row>
        <v-col cols="12">
          <BaseFileUpload
            v-model="brochure"
            label="Upload Brochure"
            :accept="FILE_CONFIG.allowedTypes.join(',')"
            :max-size-mb="FILE_CONFIG.maxSizeMB"
            :hint="`Accepted formats: ${FILE_CONFIG.allowedTypes.join(', ')} (max ${FILE_CONFIG.maxSizeMB}MB)`"
            :rules="[rules.fileSize, rules.fileType]"
            :error-messages="getError('brochure')"
          />
        </v-col>
      </v-row>

      <v-alert type="info" variant="tonal" density="compact" class="mt-4">
        <v-icon icon="mdi-lightbulb" class="mr-2" />
        <strong>Tip:</strong> Including a company brochure helps exhibitors and buyers understand
        your business better.
      </v-alert>
    </FormSection>
  </div>
</template>

<style scoped>
.company-information {
  padding: 0.5rem 0;
}
</style>
