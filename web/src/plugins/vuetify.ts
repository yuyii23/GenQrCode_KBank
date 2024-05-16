import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';
import { LIGHT_THEME } from '@/theme/LightTheme';

export default createVuetify({
  ...components,
  ...labsComponents,
  ...directives,

  theme: {
    defaultTheme: 'LIGHT_THEME',
    themes: {
      LIGHT_THEME,
    },
  },
  defaults: {
    VCard: {
      rounded: 'md',
      class: 'overflow-hidden',
      elevation: '0',
      variant: 'outlined',
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
      color: 'primary',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'compact',
      color: 'primary',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      color: 'primary',
    },
    VListItem: {
      minHeight: '45px',
    },
    VBtn: {
      density: 'compact',
      variant: 'elevated',
      color: 'primary',
    },
    VTooltip: {
      location: 'top',
    },
    VCardText: {
      class: 'pa-0',
    },
    VBreadcrumbs: {
      class: 'text-h6',
    },
  },
});
