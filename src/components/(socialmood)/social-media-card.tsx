"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import BlurredContainer from "@/components/(socialmood)/blur-background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EstadoLabel from "@/components/(socialmood)/estado-label";
import Modal from "@/components/(socialmood)/modal";
import AddSocialForm from "@/components/(socialmood)/add-social-form";
import { deleteLinkedAccount, getLinkedAccounts } from "@/app/actions/(socialmood)/social.actions";
import { Dialog } from "@/components/ui/dialog";
import ApproveSocialDelete from "./approve-social-delete";
import { useTranslation } from 'react-i18next'

interface Perfil {
  red_social: string;
  username: string;
  color: string;
  estado: "ACTIVO" | "INACTIVO";
}

const socialIconMap: { [key: string]: string } = {
  Instagram: "/instagram.svg",
  Facebook: "/facebook.svg",
  Twitter: "/twitter.svg",
};

const SocialMediaCard: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const {t} = useTranslation();

  const fetchPerfiles = useCallback(async () => {
    setLoading(true);
    const accounts: Perfil[] = await getLinkedAccounts();
    setPerfiles(accounts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPerfiles();
  }, [fetchPerfiles]);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleSocialAccountDelete = (username: string) => {
    setSelectedUsername(username);
    setOpenDialog(true);
  };

  const confirmUnlinkAccount = async () => {
    if (selectedUsername) {
      try {
        await deleteLinkedAccount(selectedUsername);
        console.log("Cuenta desvinculada y eliminada correctamente.");
        fetchPerfiles(); // Actualiza la lista después de la eliminación
      } catch (error) {
        console.error("Error al desvincular y eliminar la cuenta:", error);
        throw error; // Propaga el error para que `handleApprove` lo maneje
      } finally {
        setOpenDialog(false); // Cierra el diálogo después de la operación
      }
    }
  };
  

  return (
    <>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <AddSocialForm onClose={toggleModal} onFormSubmit={fetchPerfiles} />
        </Modal>
      )}
      <BlurredContainer customStyle="h-[30vh]">

        <div className="flex items-center justify-between w-full mb-3">
          <h2 className="text-2xl font-bold">{t('Redes Sociales')}</h2>
          <div className="options flex items-center">
            <button
              className="w-6 h-6 bg-[#D24EA6] text-2xl rounded-xl flex items-center justify-center"
              onClick={toggleModal}
            >
              +
            </button>
          </div>
        </div>

        {loading ? (
          <p>{t('Cargando perfiles')}...</p>
        ) : (
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th className="pb-2">{t('Cuentas')}</th>
                <th className="pb-2 px-5">{t('Estado')}</th>
                <th> </th>
              </tr>
            </thead>

            <tbody>
              {perfiles.map((perfil, index) => (
                <tr key={index}>
                  <td className="pb-2">
                    <span
                      className={cn(
                        buttonVariants({
                          variant:
                            perfil.red_social === "Instagram"
                              ? "blue"
                              : perfil.red_social === "Facebook"
                              ? "orange"
                              : "default",
                          size: "smBold",
                        }),
                        "w-full flex justify-start items-center py-2 pr-30"
                      )}
                    >
                      <img
                        src={socialIconMap[perfil.red_social] || "/default.svg"}
                        alt={`${perfil.red_social} Icon`}
                        className="flex justify-left mr-2"
                      />
                      {perfil.username}
                    </span>
                  </td>

                  <td className="px-5 pb-2">
                    <EstadoLabel estado='ACTIVO' />
                  </td>
                  <td className="pb-2">
                    <X onClick={() => handleSocialAccountDelete(perfil.username)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </BlurredContainer>

      {openDialog && (
        <Dialog open={openDialog}>
          <ApproveSocialDelete
            onOpenChange={setOpenDialog}
            onConfirm={confirmUnlinkAccount}
          />
        </Dialog>
      )}
    </>
  );
};

export default SocialMediaCard;
