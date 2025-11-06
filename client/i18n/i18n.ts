import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import ru from "./ru/translation.json";
import lt from "./lt/translation.json";

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
    lt: {
      translation: lt,
    },
  },
});

export default i18n;
