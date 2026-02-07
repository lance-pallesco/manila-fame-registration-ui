<script setup>
import { ref, computed, watch } from 'vue'
import { FILE_CONFIG } from '@/constants/registration'

const props = defineProps({
  modelValue: {
    type: [File, Object, null],
    default: null,
  },
  label: {
    type: String,
    default: 'Upload File',
  },
  accept: {
    type: String,
    default: () => FILE_CONFIG.allowedTypes.join(','),
  },
  maxSizeMb: {
    type: Number,
    default: FILE_CONFIG.maxSizeMB,
  },
  hint: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  showPreview: {
    type: Boolean,
    default: true,
  },
  prependInnerIcon: {
    type: String,
    default: 'mdi-paperclip',
  },
  density: {
    type: String,
    default: 'comfortable',
  },
})

const emit = defineEmits(['update:modelValue', 'error'])
const internalFiles = ref([])

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && !internalFiles.value.includes(newVal)) {
      internalFiles.value = [newVal]
    } else if (!newVal) {
      internalFiles.value = []
    }
  },
  { immediate: true },
)
const computedHint = computed(() => {
  if (props.hint) return props.hint
  return `Accepted: ${props.accept} (max ${props.maxSizeMb}MB)`
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fileInfo = computed(() => {
  if (!internalFiles.value.length) return null
  const file = internalFiles.value[0]
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
  }
})

const handleFileChange = (files) => {
  // Normalize: Vuetify 3 without `multiple` emits a single File, not an array
  const file = files instanceof File ? files : (Array.isArray(files) ? files[0] : null)

  internalFiles.value = file ? [file] : []

  if (file) {
    // Validate file size
    const maxBytes = props.maxSizeMb * 1024 * 1024
    if (file.size > maxBytes) {
      emit('error', `File size exceeds ${props.maxSizeMb}MB limit`)
      return
    }

    emit('update:modelValue', file)
  } else {
    emit('update:modelValue', null)
  }
}

const clearFile = () => {
  internalFiles.value = []
  emit('update:modelValue', null)
}
</script>

<template>
  <div class="base-file-upload">
    <v-file-input
      v-model="internalFiles"
      :label="label"
      :accept="accept"
      :hint="computedHint"
      :rules="rules"
      :required="required"
      :disabled="disabled"
      :error-messages="errorMessages"
      :prepend-inner-icon="prependInnerIcon"
      :density="density"
      prepend-icon=""
      persistent-hint
      show-size
      clearable
      @update:model-value="handleFileChange"
      @click:clear="clearFile"
    >
      <template #selection="{ fileNames }">
        <v-chip
          v-for="fileName in fileNames"
          :key="fileName"
          color="primary"
          variant="outlined"
          size="small"
          class="me-2"
        >
          <v-icon icon="mdi-file-document" size="16" class="mr-1" />
          {{ fileName }}
        </v-chip>
      </template>
    </v-file-input>

    <v-expand-transition>
      <v-alert
        v-if="showPreview && fileInfo"
        type="info"
        variant="tonal"
        density="compact"
        class="mt-2"
      >
        <div class="d-flex align-center">
          <v-icon icon="mdi-file-check" class="mr-2" />
          <div>
            <div class="text-body-2 font-weight-medium">{{ fileInfo.name }}</div>
            <div class="text-caption text-grey">{{ fileInfo.size }}</div>
          </div>
        </div>
      </v-alert>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.base-file-upload {
  width: 100%;
}
</style>
