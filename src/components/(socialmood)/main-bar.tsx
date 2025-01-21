"use client"
import { usePathname } from 'next/navigation';
import UserProfile from "@/components/(socialmood)/user-profile";
import { getActiveUserName } from '@/app/actions/(socialmood)/auth.actions'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';


export default function MainBar() {

  const { t } = useTranslation();

  const [userName, setUserName] = useState<string>("")

  const fetchUserName = async () => {
    const result = await getActiveUserName()
    if (typeof result === 'string') {
      setUserName(result)
    } else {
      console.error(result.error)
    }
  }

  useEffect(() => {
    fetchUserName()
  }, [])

  const pathname = usePathname();

  // Determina el título y la frase basados en la ruta actual
  const getContent = () => {
    switch (pathname) {
      case '/app/listado/respuestas':
        return {
          title: t('mainBar.respuestasTitle'),
          phrase: 'Revisa las respuestas automaticas de tus interacciones.'
        };
      case '/app/reglas':
        return {
          title: t('mainBar.reglasTitle'),
          phrase: 'Configura las reglas para tus respuestas automaticas.'
        };
      case '/app/listado-interacciones':
        return {
          title: t('mainBar.interaccionesTitle'),
          phrase: t('Supervisa las interacciones de tus redes sociales.')
        };
      case '/reports':
        return {
          title: t('mainBar.informesTitle'),
          phrase: t('Analiza los informes y las estadísticas.')
        };
      default:
        return {
          title: t('Hola') + ',  ' + userName,
          phrase: t('mainBar.phrase')
        };
    }
  };

  const { title, phrase } = getContent();

  return (
    <div>
      <header className="mt-16 mb-10 px-6 text-white flex justify-between items-center">
        <div>
          <h1 className="py-3 text-4xl font-semibold">
            {title}
          </h1>
          <p className="text-lg text-gray-400">
            {phrase}
          </p>
        </div>
        <UserProfile />
      </header>
    </div>
  );
}