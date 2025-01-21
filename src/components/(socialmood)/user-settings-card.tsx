"use client";

import { Edit, Save, X, LockIcon } from "lucide-react"; // Importar el icono X
import BlurredContainer from "@/components/(socialmood)/blur-background";
import React, { useEffect, useState } from "react";
import {
  getActiveUserName,
  getActiveUserEmail,
  getActiveUserAddress,
  updateUserProfile,
  updatePassword
} from "@/app/actions/(socialmood)/auth.actions";
import { toast } from "@/components/ui/use-toast";
import { ChangePasswordSchema } from "@/types";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./laguage-switcher";


function UserSettingsCard() {
  const {t} = useTranslation();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Fetch current user data
  const fetchUserData = async () => {
    const nameResult = await getActiveUserName();
    if (typeof nameResult === "string") {
      const [name, surname] = nameResult.split(" ");
      setFirstName(name || "");
      setLastName(surname || "");
    } else {
      console.error(nameResult.error);
    }

    const emailResult = await getActiveUserEmail();
    if (typeof emailResult === "string") {
      setUserEmail(emailResult);
    } else {
      console.error(emailResult.error);
    }

    const addressResult = await getActiveUserAddress();
    if (typeof addressResult === "string") {
      setUserAddress(addressResult);
    } else {
      console.error(addressResult.error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Update user data
  const handleSaveChanges = async () => {
    if (!firstName || !lastName || !userEmail || !userAddress) {
      toast({
        variant: "destructive",
        description: "Por favor, llena todos los campos obligatorios.",
      });
      return;
    }

    try {
      const response = await updateUserProfile({
        name: firstName,
        lastName: lastName,
        address: userAddress,
      });
      if (response.success) {
        toast({
          variant: "default",
          description: "Perfil actualizado exitosamente.",
        });
        setIsEditing(false);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al guardar los cambios",
      });
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleSavePassword = async () => {
    if (!password || !confirmPassword) {
      toast({
        variant: "destructive",
        description: "Por favor, llena todos los campos obligatorios.",
      });
      return;
    }

    const validationResult = ChangePasswordSchema.safeParse({
      password: password,
      confirmPassword: confirmPassword,
    });

    if (validationResult.success === false) {
      let message = JSON.parse(validationResult.error.message);
      

      toast({
        variant: "destructive",
        description: message[0].message,
      });
      return;
    }


    try {
      const response = await updatePassword({
        password: password,
      });
      if (response.success) {
        toast({
          variant: "default",
          description: "Contraseña actualizada exitosamente.",
        });
        setPassword("");
        setConfirmPassword("");
        setIsEditing(false);
        setIsChangingPassword(false);

      } else {
        console.error(response.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error al guardar los cambios",
      });
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    fetchUserData(); // Restablece los datos del usuario
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  return (
    <BlurredContainer customStyle="h-auto !m-0 p-6">
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex items-center gap-x-3">
          <div className="w-20 h-20 text-5xl bg-emerald-500 rounded-full flex items-center justify-center">
            😎
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[26px]">{t('Datos de Perfil')}</h2>
          </div>

          {/* Botones de acción */}
          {(!isEditing && !isChangingPassword) ? (
            <>
              <button
                className="text-white flex items-center gap-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-6 h-6" />
              </button>

              <button
                className="text-white flex items-center gap-1"
                onClick={() => setIsChangingPassword(true)}
              >
                <LockIcon className="w-6 h-6" />
              </button>
            </>

          )
            :
            null
          }

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                className="text-green-500 hover:underline flex items-center gap-1"
                onClick={handleSaveChanges}
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                className="text-white hover:underline flex items-center gap-1"
                onClick={handleCancel}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : null
          }

          {isChangingPassword ? (
            <div className="flex items-center gap-2">
              <button
                className="text-green-500 hover:underline flex items-center gap-1"
                onClick={handleSavePassword}
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                className="text-white hover:underline flex items-center gap-1"
                onClick={handleCancel}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : null
          }
        </div>

        {/* Editable fields */}
        {
          !isChangingPassword ? (
            <div className="flex flex-col gap-y-3">
              <div className="flex gap-x-3">
                <div className="flex-1">
                  <label className="text-sm font-medium">{t('Nombre')}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`bg-white text-black rounded-lg py-2 w-full ${isEditing ? "border-none" : "bg-white/30 border border-gray-300 text-white"
                      }`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">{t('Apellido')}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`bg-white text-black rounded-lg py-2 w-full ${isEditing ? "border-none" : "bg-white/30 border border-gray-300 text-white"
                      }`}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">{t('Dirección')}</label>
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className={`bg-white text-black rounded-lg py-2 w-full ${isEditing ? "border-none" : "bg-white/30 border border-gray-300 text-white"
                    }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('Correo electrónico')}</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled={true}
                  className={`bg-white rounded-lg py-2 w-full bg-white/30 border border-gray-300 text-white`}
                />
              </div>
            </div>
          ) : 
          (<div className="flex flex-col gap-y-3">
            
            <div>
              <label className="text-sm font-medium">{t('Nueva contraseña')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-white text-black rounded-lg py-2 w-full border-none`}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('Confirmar contraseña')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`bg-white text-black rounded-lg py-2 w-full border-none`}
              />
            </div>
          </div>)
        }
        <div className="mt-4">
        <LanguageSwitcher/>
        </div>
      </div>
      
    </BlurredContainer>
  );
}

export default UserSettingsCard;
