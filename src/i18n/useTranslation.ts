import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace = 'common') => {
  return useI18nTranslation(namespace);
};
