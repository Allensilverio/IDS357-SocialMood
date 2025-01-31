"use client"
import React, { useEffect, useState } from "react";
import { getInteractionsFiltered } from "@/app/actions/(socialmood)/get-interactions.actions";
import { useRouter } from 'next/navigation';
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SocialButton from '@/components/(socialmood)/social-button';
import FilterModal from "@/components/(socialmood)/filter-modal-interaction";
import { useTranslation } from "react-i18next";


interface Perfil {
  red_social: string;
  username: string;
  color: string;
}

interface Interacciones {
  perfil: Perfil;
  mensaje: string;
  emisor: string;
  categoria: string;
  subcategoria: string;
  fecha: string;
  respondida: boolean; // Propiedad para determinar si tiene respuesta automática
  enlace_publicacion: string;
}

const ListadoInteraccionesTable: React.FC = () => {

  const {t} = useTranslation();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Controla la visibilidad del modal
  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    subcategory: []
  });

  const onSaveFilters = (filter: any) => {
    setSelectedFilters(filter);
    console.log(filter);
  }

  const [Interacciones, setInteracciones] = useState<Interacciones[]>([]);
  const router = useRouter();

  const socialIconMap: { [key: string]: string } = {
    Instagram: "/instagram.svg",
    Facebook: "/facebook.svg",
    Twitter: "/twitter.svg",
  };

  const emojimap: Record<string, string> = {
    "Positivo": "/happy.svg",
    "Negativo": "/angry.svg",
    "Neutral": "/neutral-face.svg",
    "Queja": "/angry.svg",
    "Elogio": "/happy.svg",
    "Recomendacion": "/happy.svg",
    "Consulta": "/neutral-face.svg",
  };

  const fetchInteracciones = async () => {
    try {
      const interacciones = await getInteractionsFiltered(selectedFilters); // Llamada a la función para obtener todas las interacciones
      console.log(interacciones);
      setInteracciones(interacciones);
    } catch (error) {
      console.error("Error al cargar las interacciones:", error);
    }
  };

  useEffect(() => {
    fetchInteracciones();
    const interval = setInterval(() => {
      fetchInteracciones();
    }, 30000); // Ejecutar cada 30 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [selectedFilters]);

  const handleRefreshTable = () => {
    fetchInteracciones();
  };

  // Función para formatear enlace_publicacion
  const formatEnlacePublicacion = (enlacePublicacion: string): string | null => {
    const match = enlacePublicacion.match(/\/v\d+\.\d+\/(\d+)_(\d+)/);
    if (match) {
      const cuentaId = match[1]; // ID de la cuenta
      const publicacionId = match[2]; // ID de la publicación
      return `https://www.facebook.com/${cuentaId}/posts/${publicacionId}`;
    }
    console.error("No se pudo formatear el enlace_publicacion:", enlacePublicacion);
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[32px] px-4 mx-10 py-8">
      <div className="container mx-auto p-6 ">
        <div className="flex justify-between mb-6">
          <h1 className="text-[24px] text-white font-bold">{t('Interacciones Capturadas')}</h1>

          <div className="flex space-x-4">
            <SocialButton
              customStyle="w-32"
              variant="default"
              defaultText={t("Filtros")}
              type="button" // Cambiado a 'button' para evitar enviar un formulario
              onClick={openFilterModal}
            />
            <button
              className="btn w-8 h-8 bg-[#FFF] rounded-[12px] flex items-center justify-center"
              onClick={handleRefreshTable}
            >
              <img
                src="/refresh.svg"
                alt="Refresh"
                className=" w-6 h-6"
              />
            </button>
          </div>
        </div>
        <hr className="border-[#FFF] mb-6" />
        <div className="max-h-80 overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-[14px] md:text-[16px] lg:text-[18px]">
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Perfil')}</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Mensaje')}</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Emisor')}</th>
                <th className="hidden sm:table-cell py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left ">{t('Categoría')}</th>
                <th className="hidden sm:table-cell py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Subcategoría')}</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Fecha')}</th>
                <th className="py-3 md:py-4 px-2 md:px-6 lg:px-10 text-left">{t('Estado')}</th> {/* Nueva columna */}
              </tr>
            </thead>

            <tbody>
              {Interacciones.map((interacciones, index) => {
                const enlaceFacebook = formatEnlacePublicacion(interacciones.enlace_publicacion);

                return (
                  <tr key={index}>
                    <td className="py-3 md:py-4 px-4 md:px-8 relative group">
                      <div className="flex justify-center items-center space-x-2 w-full">
                        <div className="relative group">
                          <span
                            className={cn(
                              buttonVariants({
                                variant:
                                  interacciones.perfil.red_social === "Instagram"
                                    ? "orange"
                                    : interacciones.perfil.red_social === "Facebook"
                                      ? "blue"
                                      : "default",
                                size: "smBold",
                              }),
                              "flex items-center w-full py-2"
                            )}
                          >
                            <img
                              src={socialIconMap[interacciones.perfil.red_social] || "/default.svg"}
                              alt={`${interacciones.perfil.red_social} Icon`}
                              className="w-5 h-5"
                            />
                            <span className="text-left">{interacciones.perfil.username}</span>
                          </span>
                          {/* Iframe visible solo en hover */}
                          {enlaceFacebook && (
                            <div
                              className="absolute left-72 transform -translate-x-1/2 -translate-y-1/2 w-[fit] z-[9999] hidden group-hover:block"
                            >
                              <iframe
                                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
                                  enlaceFacebook
                                )}&show_text=true&width=500`}
                                width="full"
                                height="full"
                                className="rounded-2xl"
                              ></iframe>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.mensaje}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.emisor}</td>
                    <td className="hidden sm:table-cell py-2 md:py-3 px-2 md:px-4 lg:px-8">
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          <img
                            src={emojimap[interacciones.categoria] || "/default.svg"}
                            alt="Emoji Icon"
                            className="w-6 md:w-8 h-6 md:h-8 ml-2"
                          />
                          {interacciones.categoria}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-4 md:px-8 font-bold text-left ">
                      <div className="flex items-center justify-center space-x-2">
                        <span
                          className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                          style={{ width: "80%", justifyContent: "center" }}
                        >
                          <img
                            src={emojimap[interacciones.subcategoria] || "/default.svg"}
                            alt="Emoji Icon"
                            className="w-6 md:w-8 h-6 md:h-8 ml-2"
                          />
                          {interacciones.subcategoria}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8">{interacciones.fecha}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 lg:px-8 text-center">
                      <span
                        className={`
              inline-block
              px-2
              py-1
              rounded-full
              text-xs
              font-semibold
              w-max
              ${interacciones.respondida ? "bg-green-500 text-white" : "bg-red-500 text-white"}
            `}
                      >
                        {interacciones.respondida ? t("Respondida") : t("Sin respuesta")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {
        isFilterModalOpen ?
          <FilterModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onSave={onSaveFilters} /> :
          null
      }
    </div>
  );
};

export default ListadoInteraccionesTable;
