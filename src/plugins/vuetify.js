/**
 * Vuetify Plugin Configuration
 *
 * Configures Vuetify with custom theme colors for Manila FAME Event branding.
 * Uses Material Design Icons and Inter font family.
 */

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Manila FAME Event custom theme
const manilaFameTheme = {
  dark: false,
  colors: {
    primary: '#1565C0',
    secondary: '#FF6F00',
    accent: '#00897B',
    success: '#43A047',
    warning: '#FB8C00',
    error: '#E53935',
    info: '#1E88E5',
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'manilaFameTheme',
    themes: {
      manilaFameTheme,
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: "'Inter', sans-serif",
      },
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VFileInput: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VBtn: {
      variant: 'elevated',
      color: 'primary',
    },
    VCard: {
      elevation: 2,
    },
  },
})

export default vuetify
