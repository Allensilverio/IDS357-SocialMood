"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Plus, X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import Image from "next/image";
import { getNextPaymentDate } from '@/app/actions/(backoffice)/subscriptions.actions';
import { useTranslation } from "react-i18next";

function UserCurrentPlanCard() {

  const {t} = useTranslation();

  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);

  const fetchNextPaymentDate = async () => {
    try {
      const nextPaymentTimestamp = await getNextPaymentDate();
      if (nextPaymentTimestamp) {
        const formattedDate = new Date(nextPaymentTimestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        setNextPaymentDate(formattedDate);
      } else {
        setNextPaymentDate("Fecha no disponible");
      }
    } catch (error) {
      console.error("Error fetching next payment date:", error);
      setNextPaymentDate("Error al obtener fecha");
    }
  };

  useEffect(() => {
    fetchNextPaymentDate();
  }, []);

  return (
    <BlurredContainer customStyle='h-[30vh] !mx-0'>
        <div className="flex items-center w-full">

          <div className='payment-info w-full'>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{t('Plan Actual')}</h2>
            </div>

            <p className="text-xs mb-2">{t('Próximo pago')}: {nextPaymentDate ? `$25 el ${nextPaymentDate}` : "Cargando..."}</p>
            <p className="text-sm font-bold mb-4">{t('Plan Básico $25/mensual')}</p>
            <p className="text-xs mb-1">{t('Método de pago')}</p>

            <div className="flex items-center">
              <Image src="/paypal-logo.svg" width={15} height={25} alt="credit card"/>
              <span className='text-sm ml-2'>{t('PayPal')}</span>
            </div>

          </div>

          <Image src="/credit-card.svg" width={400} height={75} alt="credit card"/>

        </div>
    </BlurredContainer>
  );
}

export default UserCurrentPlanCard;
