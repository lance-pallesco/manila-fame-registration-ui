<script setup>
/**
 * Registration Summary Step (Step 3)
 *
 * Displays a read-only review of all collected registration data
 * before final submission.
 */
import { computed, onMounted, ref } from 'vue'
import FormSection from '@/components/forms/FormSection.vue'
import { useRegistration } from '@/composables/useRegistration'
import { PARTICIPATION_TYPES } from '@/constants/registration'
import { fetchCountries, getCountryName } from '@/services/countriesService'

const emit = defineEmits(['edit-step'])

const { accountInfo, companyInfo, fullName } = useRegistration()

// Fetch countries to get the name
const countriesLoaded = ref(false)
onMounted(async () => {
  await fetchCountries()
  countriesLoaded.value = true
})

// Get participation type label
const participationLabel = computed(() => {
  const type = PARTICIPATION_TYPES.find((t) => t.value === accountInfo.value.participationType)
  return type?.title || accountInfo.value.participationType
})

// Get country label from API cache
const countryLabel = computed(() => {
  if (!countriesLoaded.value) return companyInfo.value.country
  return getCountryName(companyInfo.value.country)
})

// Region is now a free text field
const regionLabel = computed(() => {
  return companyInfo.value.region || null
})

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Brochure info
const brochureInfo = computed(() => {
  if (!companyInfo.value.brochure) return null
  return {
    name: companyInfo.value.brochure.name,
    size: formatFileSize(companyInfo.value.brochure.size),
  }
})

// Navigate to edit a step
const editStep = (step) => {
  emit('edit-step', step)
}
</script>

<template>
  <div class="registration-summary">
    <!-- Header Notice -->
    <v-alert type="info" variant="tonal" class="mb-6">
      <v-icon icon="mdi-information" class="mr-2" />
      Please review your information carefully before submitting. Click "Edit" to make changes.
    </v-alert>

    <!-- Account Information Summary -->
    <FormSection title="Account Information" icon="mdi-account" divider>
      <template #default>
        <v-card variant="outlined" class="summary-card">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Full Name</span>
                  <span class="summary-value">{{ fullName }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Email Address</span>
                  <span class="summary-value">{{ accountInfo.email }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Username</span>
                  <span class="summary-value">@{{ accountInfo.username }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Password</span>
                  <span class="summary-value">••••••••</span>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="summary-item">
                  <span class="summary-label">Participation Type</span>
                  <v-chip color="primary" variant="elevated" size="small">
                    {{ participationLabel }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end pa-4 pt-0">
            <v-btn variant="text" color="primary" size="small" @click="editStep(1)">
              <v-icon icon="mdi-pencil" size="16" class="mr-1" />
              Edit Account Info
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </FormSection>

    <!-- Company Information Summary -->
    <FormSection title="Company Information" icon="mdi-domain">
      <template #default>
        <v-card variant="outlined" class="summary-card">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Company Name</span>
                  <span class="summary-value">{{ companyInfo.companyName }}</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Year Established</span>
                  <span class="summary-value">
                    {{ companyInfo.yearEstablished || 'Not specified' }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="summary-item">
                  <span class="summary-label">Address</span>
                  <span class="summary-value">
                    {{ companyInfo.addressLine }}<br />
                    {{ companyInfo.city }}
                    <template v-if="regionLabel">, {{ regionLabel }}</template
                    ><br />
                    {{ countryLabel }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Website</span>
                  <span class="summary-value">
                    <template v-if="companyInfo.website">
                      <a
                        :href="
                          companyInfo.website.startsWith('http')
                            ? companyInfo.website
                            : `https://${companyInfo.website}`
                        "
                        target="_blank"
                        class="text-primary"
                      >
                        {{ companyInfo.website }}
                        <v-icon icon="mdi-open-in-new" size="12" />
                      </a>
                    </template>
                    <template v-else>Not specified</template>
                  </span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="summary-item">
                  <span class="summary-label">Company Brochure</span>
                  <span class="summary-value">
                    <template v-if="brochureInfo">
                      <v-chip color="success" variant="tonal" size="small">
                        <v-icon icon="mdi-file-document" size="16" class="mr-1" />
                        {{ brochureInfo.name }}
                        <span class="text-caption ml-1">({{ brochureInfo.size }})</span>
                      </v-chip>
                    </template>
                    <template v-else>
                      <span class="text-grey">No file uploaded</span>
                    </template>
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end pa-4 pt-0">
            <v-btn variant="text" color="primary" size="small" @click="editStep(2)">
              <v-icon icon="mdi-pencil" size="16" class="mr-1" />
              Edit Company Info
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </FormSection>

    <!-- Terms Notice -->
    <v-alert type="warning" variant="tonal" class="mt-6">
      <v-icon icon="mdi-shield-check" class="mr-2" />
      By submitting this registration, you agree to the Manila FAME Event terms and conditions and
      consent to the processing of your personal information.
    </v-alert>
  </div>
</template>

<style scoped>
.registration-summary {
  padding: 0.5rem 0;
}

.summary-card {
  background: #fafafa;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 0.95rem;
  color: #212121;
  line-height: 1.5;
}
</style>
