import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import English from './resources/en.json';
import Vietnamese from './resources/vs.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {
      translation: English,
    },
    vs: {
      translation: Vietnamese,
    },
  },
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
});

export default i18n;
