<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
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
  readonly: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: () => [],
  },
  prependInnerIcon: {
    type: String,
    default: '',
  },
  appendInnerIcon: {
    type: String,
    default: '',
  },
  maxlength: {
    type: [String, Number],
    default: undefined,
  },
  counter: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String,
    default: 'comfortable',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const passwordIcon = computed(() => (showPassword.value ? 'mdi-eye-off' : 'mdi-eye'))

const computedAppendIcon = computed(() => {
  if (props.type === 'password') {
    return passwordIcon.value
  }
  return props.appendInnerIcon
})

const handleInput = (value) => {
  emit('update:modelValue', value)
}

const togglePassword = () => {
  if (props.type === 'password') {
    showPassword.value = !showPassword.value
  }
}
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="inputType"
    :placeholder="placeholder"
    :hint="hint"
    :rules="rules"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :error-messages="errorMessages"
    :prepend-inner-icon="prependInnerIcon"
    :append-inner-icon="computedAppendIcon"
    :maxlength="maxlength"
    :counter="counter"
    :density="density"
    persistent-hint
    @update:model-value="handleInput"
    @click:append-inner="togglePassword"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>
