<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  divider: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="form-section">
    <!-- Section Header -->
    <div v-if="title" class="form-section-header mb-4">
      <div class="d-flex align-center">
        <v-icon v-if="icon" :icon="icon" color="primary" size="24" class="mr-2" />
        <div>
          <h3 class="text-h6 font-weight-medium text-primary">{{ title }}</h3>
          <p v-if="subtitle" class="text-body-2 text-grey mt-1 mb-0">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>

    <div class="form-section-content">
      <slot />
    </div>

    <v-divider v-if="divider" class="mt-6 mb-2" />
  </div>
</template>

<style scoped>
.form-section {
  margin-bottom: 1.5rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section-header {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 12px;
}
</style>
