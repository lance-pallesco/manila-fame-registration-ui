<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },
  // Select label
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemValue: {
    type: String,
    default: 'value',
  },
  itemTitle: {
    type: String,
    default: 'title',
  },
  placeholder: {
    type: String,
    default: 'Select an option',
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
  multiple: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String,
    default: 'comfortable',
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])
const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <v-select
    :model-value="modelValue"
    :label="label"
    :items="items"
    :item-value="itemValue"
    :item-title="itemTitle"
    :placeholder="placeholder"
    :hint="hint"
    :rules="rules"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :error-messages="errorMessages"
    :prepend-inner-icon="prependInnerIcon"
    :multiple="multiple"
    :clearable="clearable"
    :density="density"
    persistent-hint
    @update:model-value="handleUpdate"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>
