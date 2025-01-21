import React from "react";
import { useTranslation } from 'react-i18next'

interface EstadoLabelProps {
  estado: "ACTIVO" | "INACTIVO";
}

const EstadoLabel: React.FC<EstadoLabelProps> = ({ estado }) => {
  const {t} = useTranslation();

  const estadoClasses =
    estado === "ACTIVO"
      ? "bg-green-200 text-[#08A600]"
      : "bg-red-200 text-red-800";

  return (
    <span className={`${estadoClasses} py-1 px-3 rounded-full text-xs font-bold`}>
      {estado === 'ACTIVO' ? t('Activo'): t('Inactivo')}
    </span>
  );
};

export default EstadoLabel;
