"use client";
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // Importa el switch de shadcn
import { selectAllPlans, activatePlan, deactivatePlan } from "@/app/actions/(backoffice)/subscriptions.actions";
import { useRouter } from 'next/navigation';

interface PlanSubscripcion {
  planId: string;
  planNombre: string;
  tipo_facturacion_nombre: string;
  costo: number;
  cantidad_interacciones_mes: number;
  cantidad_usuarios_permitidos: number;
  cantidad_cuentas_permitidas: number;
  estado_plan_nombre: string; // 'ACTIVO' o 'INACTIVO'
}

const PlanesSubscripcionTable: React.FC = () => {
  const [planesSubscripcion, setPlanesSubscripcion] = useState<PlanSubscripcion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const planes = await selectAllPlans(); // Llamada a la función para obtener todos los planes
        console.log(planes);
        setPlanesSubscripcion(planes);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      }
    };

    fetchPlanes();
  }, []);

  // Manejar el cambio de estado del switch
  const handleSwitchChange = async (id: number, isActive: boolean) => {
    try {
      if (isActive) {
        await activatePlan(id);
      } else {
        await deactivatePlan(id);
      }

      setPlanesSubscripcion((prevPlanesSubscripcion) =>
        prevPlanesSubscripcion.map((plan) =>
          parseInt(plan.planId) === id
            ? { ...plan, estado_plan_nombre: isActive ? "ACTIVO" : "INACTIVO" }
            : plan
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del plan:", error);
    }
  };

  const handleCrearSubscripcion = () => {
    router.push("/bo/create-sub");
  };

  // Función para manejar la edición del plan
  const handleEditPlan = (planId: string) => {
    router.push(`/bo/edit-sub/${planId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Listado de subscripciones</h2>
        <button className="btn w-8 h-8 bg-[#D24EA6] rounded-lg" onClick={handleCrearSubscripcion}>
          <span className="text-white text-2xl">+</span>
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg  border-t table-auto">
          <thead className="bg-[#422EA3] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-center">Límite de usuarios</th>
              <th className="py-3 px-4 text-center">Redes sociales</th>
              <th className="py-3 px-4 text-center">Interacciones por mes</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Precio</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planesSubscripcion.map((plan) => (
              <tr key={plan.planId} className="">
                <td className="py-6 px-4">{plan.planNombre}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_usuarios_permitidos}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_cuentas_permitidas}</td>
                <td className="py-3 px-4 text-center">{plan.cantidad_interacciones_mes}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`${plan.estado_plan_nombre === "ACTIVO"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                      } py-1 px-3 rounded-full text-xs font-bold`}
                  >
                    {plan.estado_plan_nombre}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-center">{plan.costo}$/{plan.tipo_facturacion_nombre.toLowerCase()}</td>
                <td className="py-3 px-4 flex items-center">
                  <Switch
                    className="data-[state=checked]:bg-[#422EA3]"
                    checked={plan.estado_plan_nombre === "ACTIVO"}
                    onCheckedChange={(checked) => handleSwitchChange(parseInt(plan.planId), checked)}
                  />
                  {/* Botón para editar el plan */}
                  <button
                    className="ml-4 text-gray-500 hover:text-gray-800"
                    onClick={() => handleEditPlan(plan.planId)} // Redirige a la página de edición con el planId
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PlanesSubscripcionTable;
