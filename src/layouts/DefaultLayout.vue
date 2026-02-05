<script setup></script>

<template>
  <v-layout class="default-layout">
    <!-- App Header -->
    <v-app-bar color="primary" elevation="2" class="app-header">
      <v-container class="d-flex align-center py-0">
        <v-icon icon="mdi-star-four-points" size="32" class="mr-3" />
        <div class="header-brand">
          <div class="text-h6 font-weight-bold">Manila FAME</div>
          <div class="text-caption opacity-80">International Trade Event</div>
        </div>
        <v-spacer />
      </v-container>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="main-content">
      <v-container class="py-6 py-md-10">
        <slot />
      </v-container>
    </v-main>

    <!-- App Footer -->
    <v-footer app color="grey-darken-4" class="app-footer">
      <v-container class="text-center py-4">
        <div class="text-body-2 text-grey-lighten-1">
          &copy; {{ new Date().getFullYear() }} Manila FAME. All rights reserved.
        </div>
      </v-container>
    </v-footer>
  </v-layout>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, #0d47a1 100%);
}

.header-brand {
  line-height: 1.2;
}

.main-content {
  background: linear-gradient(180deg, #e3f2fd 0%, #fafafa 100%);
  min-height: calc(100vh - 128px);
}

.app-footer {
  border-top: 3px solid rgb(var(--v-theme-secondary));
}
</style>
