import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './resources/en/common.json';
import enAbandonedCart from './resources/en/abandonedCart.json';
import enDashboard from './resources/en/dashboard.json';
import enRoles from './resources/en/roles.json';

import esCommon from './resources/es/common.json';
import esAbandonedCart from './resources/es/abandonedCart.json';
import esRoles from './resources/es/roles.json';

// Language resources
const resources = {
  en: {
    common: enCommon,
    abandonedCart: enAbandonedCart,
    dashboard: enDashboard,
    roles: enRoles,
  },
  es: {
    common: esCommon,
    abandonedCart: esAbandonedCart,
    dashboard: enDashboard, // Fallback to English for now
    roles: esRoles,
  },
};

// i18n configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'abandonedCart', 'dashboard', 'roles'],

    // React i18next options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
