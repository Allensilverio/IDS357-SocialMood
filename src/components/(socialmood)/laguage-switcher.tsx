'use client';

import i18n from 'i18next';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {

  const {t} = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('i18nextLng', lng); // Guardar el idioma en localStorage
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage); // Cargar el idioma guardado al montar
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <label className="text-lg font-semibold text-gray-200">{t('Idiomas')}:</label>

      {/* Español */}
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="language-es"
          name="language"
          value="es"
          checked={selectedLanguage === 'es'}
          onChange={() => changeLanguage('es')}
          className="cursor-pointer"
        />
        <label htmlFor="language-es" className="flex items-center cursor-pointer space-x-2">
          <span className="text-5xl">🇩🇴</span>
          <span className="text-sm text-gray-200">{t('Español')}</span>
        </label>
      </div>

      {/* Inglés */}
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="language-en"
          name="language"
          value="en"
          checked={selectedLanguage === 'en'}
          onChange={() => changeLanguage('en')}
          className="cursor-pointer"
        />
        <label htmlFor="language-en" className="flex items-center cursor-pointer space-x-2">
          <span className="text-5xl">🇺🇸</span>
          <span className="text-sm text-gray-200">{t('Ingles')}</span>
        </label>
      </div>
    </div>
  );
}
