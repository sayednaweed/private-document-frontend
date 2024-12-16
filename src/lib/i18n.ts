import i18n from "i18next";

import translationEN from "@/assets/locales/en.json";
import translationFA from "@/assets/locales/fa.json";
import translationPS from "@/assets/locales/ps.json";
import { initReactI18next } from "react-i18next";
import { loadFont } from "./utils";

export interface LanguageType {
  code: string;
  name: string;
}
export const supportedLangauges: LanguageType[] = [
  { name: "English", code: "en" },
  { name: "Farsi", code: "fa" },
  { name: "Pashto", code: "ps" },
];

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  fa: {
    translation: translationFA,
  },
  ps: {
    translation: translationPS,
  },
};
export const setLanguageDirection = async (direction: string) => {
  document.documentElement.dir = direction;
  await loadFont(direction);
};

const loadLangs = () => {
  i18n.use(initReactI18next).init({
    fallbackLng: "en",
    // lng: language, // default language
    // debug: true,
    returnObjects: true,
    resources: resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // backend: {
    //   requestOptions: {
    //     cache: "no-store",
    //   },
    // },
  });

  const storedLanguage = localStorage.getItem("language");
  let direction = "rtl";
  if (storedLanguage) {
    i18n.changeLanguage(storedLanguage);
    direction = storedLanguage === "en" ? "ltr" : "rtl";
  } else {
    direction = i18n.language === "en" ? "ltr" : "rtl";
  }
  setLanguageDirection(direction);
  loadFont(direction);
};
loadLangs();

export default i18n;
