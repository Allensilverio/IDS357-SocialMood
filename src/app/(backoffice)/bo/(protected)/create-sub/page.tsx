"use client";
import React, { useState, ChangeEvent } from "react";
import { ChevronLeft } from "lucide-react";
import FormularioSubscripcion from "@/components/(backoffice)/sub-form";
import VistaPreviaSubscripcion from "@/components/(backoffice)/preview-subscription";
import { useRouter } from "next/navigation";

interface FormData {
  nombre: string;
  tipoFacturacion: string;
  precio: string;
  interacciones: string;
  redesSociales: string;
  usuarios: string;
  descripcion: string;
}

export default function CreateSubPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    tipoFacturacion: "",
    precio: "",
    interacciones: "",
    redesSociales: "",
    usuarios: "",
    descripcion: "",
  });

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    console.log(`Cambiando ${name} a ${value}`); // Para depuración
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBack = () => {
    router.push("/bo/layout/sub-table");
  };

  return (
    <div className="flex min-h-screen bg-white flex-grow">
      {/* Lado Izquierdo */}
      <div className="flex-1 p-20">
        <div className="flex">
          <ChevronLeft className="mr-2 h-10 w-10 cursor-pointer" onClick={handleBack} />
          <h1 className="text-3xl font-bold mb-2">Crear Plan Subscripción</h1>
        </div>
        <p className="text-gray-500 mb-6">
          Ingrese los datos del plan de subscripción
        </p>
        <FormularioSubscripcion
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          isForUpdate={false}
        />
      </div>

      {/* Lado Derecho */}
      <div className="flex-1 bg-backgroundPurple p-8 flex items-center justify-center">
        <VistaPreviaSubscripcion formData={formData} />
      </div>
    </div>
  );
}
