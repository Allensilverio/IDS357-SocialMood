import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'; // Importar el detector

i18n
  .use(Backend) // Cargar traducciones desde archivos
  .use(LanguageDetector) // Detectar el idioma del usuario
  .use(initReactI18next) // Inicializar React i18n
  .init({
    fallbackLng: 'es', // Idioma de respaldo si no se encuentra otro
    supportedLngs: ['en', 'es'], // Idiomas soportados
    detection: {
      order: ['localStorage', 'navigator'], // Detectar idioma desde localStorage o navegador
      caches: ['localStorage'], // Guardar el idioma seleccionado en localStorage
    },
    ns: ['common'], // Namespaces
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Ruta para cargar archivos de traducción
    },
    interpolation: {
      escapeValue: false, // React ya maneja la sanitización
    },
    react: {
      useSuspense: false, // Deshabilitar Suspense para renderizado sin bloqueo
    },
  });

export default i18n;
