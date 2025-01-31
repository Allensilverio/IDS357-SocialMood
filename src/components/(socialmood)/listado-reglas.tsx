"use client"

import React, { useState, useEffect } from "react";
import { getRules } from "@/app/actions/(socialmood)/rules.actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Importación de la función 'cn'
import CreateRule from "@/components/(socialmood)/create-rule";
import EditRule from "@/components/(socialmood)/edit-rule";
import DeleteRule from "@/components/(socialmood)/delete-rule";
import CreateRuleChild from "@/components/(socialmood)/create-rule-child";
import EditRuleChild from "@/components/(socialmood)/edit-rule-child";
import DeleteRuleChild from "@/components/(socialmood)/delete-rule-child";
import { useTranslation } from "react-i18next";

import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import router, { useRouter } from "next/router";

interface Perfil {
    red_social: string;
    username: string;
    color: string;
}

interface Reglas {
    id: number;
    perfil: Perfil;
    alias: string;
    subcategorias: string[];
}

interface ListadoReglasTableProps {
    filter: any;
}

const ListadoReglasTable: React.FC<ListadoReglasTableProps> = ({ filter }) => {

    const {t} = useTranslation();

    const [Reglas, setReglas] = useState<Reglas[]>([]);
    const [Open, setOpen] = useState<boolean>(false);

    const [action, setAction] = useState<string>("Create");
    const [ruleID, setRuleID] = useState<number>(0);
    const [childRuleID, setChildRuleID] = useState<number>(0);


    const socialIconMap: { [key: string]: string } = {
        Instagram: "/instagram.svg",
        Facebook: "/facebook.svg"
    };

    const emojimap: Record<string, string> = {
        "Queja": "/angry.svg",
        "Elogio": "/happy.svg",
        "Recomendación": "/happy.svg",
        "Consulta": "/neutral-face.svg",
        // categorías y subcategorias con sus respectivos emojis
    };


    const fetchReglas = async () => {
        try {
            const reglas = await Promise.all(await getRules(filter));
            setReglas(reglas);
        } catch (error) {
            console.error("Error al cargar las reglas:", error);
        }
    };

    const handleOpenChange = (newOpenValue: boolean, action: string = "") => {
        setOpen(newOpenValue);
        if (newOpenValue === false && action === "") {
            fetchReglas();
        }
        if (action === "Create-Child") {
            setAction("");
            setAction("Create-Child");
            setOpen(true);
        }
        if (action === "Edit") {
            setAction("");
            setAction("Edit");
            setOpen(true);
        }
        if (action === "Edit-Child") {
            setAction("");
            setAction("Edit-Child");
            setOpen(true);
        }
        if (action === "Delete-Child") {
            setAction("");
            setAction("Delete-Child");
            setOpen(true);
        }
    };

    const handleRefreshTable = () => {
        updateData();
    };

    const handleAddRule = () => {
        setOpen(true);
        setRuleID(0);
        setChildRuleID(0);
        setAction("");
        setAction("Create");
    };

    const handleEditRule = (ruleID: number) => {
        setOpen(true);
        setRuleID(ruleID);
        setChildRuleID(0);
        setAction("");
        setAction("Edit");
    }

    const handleDeleteRule = async (ruleID: number) => {
        setOpen(true);
        setRuleID(ruleID);
        setChildRuleID(0);
        setAction("");
        setAction("Delete");
    }

    const updateData = async () => {
        await fetchReglas();
    }

    const HandleChangeActionForChild = (newAction: string, child: number) => {
        setChildRuleID(child);
        handleOpenChange(false, newAction);
    }

    useEffect(() => {
        updateData();
    }, [filter]);

    return (
        <Dialog open={Open}>
            <div className="bg-gradient-to-b from-white/20 via-white/10 to-white/5 text-white border border-white/30 rounded-[32px] px-10 mx-12 py-8">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between mb-6">
                        <h1 className="text-[24px] text-white font-bold">{t('Reglas')}</h1>
                        <div className="flex items-center space-x-1">
                            <DialogTrigger className="btn w-8 h-8 bg-[#D24EA6] rounded-lg" onClick={handleAddRule}>
                                <span className="text-[#FFF] text-2xl">+</span>
                            </DialogTrigger>
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
                    <div className="max-h-60 overflow-y-auto">
                        <table className="min-w-full table-auto ">
                            <thead>
                                <tr className="text-[16px] md:text-[18px]">
                                    <th className="py-2 px-3 text-left">{t('Perfil')}</th>
                                    <th className="py-2 px-3 text-left w-1/4">{t('Alias')}</th>
                                    <th className="py-2 px-3 text-left">{t('Subcategorías')}</th>
                                    <th className="py-2 px-3 text-left hidden sm:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Reglas.map((regla) => (
                                    <tr key={regla.alias}>
                                        <td className="py-1 px-3">
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span
                                                    className={cn(
                                                        buttonVariants({
                                                            variant: regla.perfil.red_social === "Instagram" ? "blue" : regla.perfil.red_social === "Facebook" ? "orange" : "default",
                                                            size: "smBold",
                                                        }),
                                                        "w-full flex justify-start items-center py-2"
                                                    )}
                                                >
                                                    <img
                                                        src={socialIconMap[regla.perfil.red_social] || "/default.svg"}
                                                        alt={`${regla.perfil.red_social} Icon`}
                                                        className="flex justify-left mr-2"
                                                    />
                                                    {regla.perfil.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-1 px-3 text-left">{regla.alias}</td>


                                        <td className="py-1 font-bold text-left">
                                            <div className="flex flex-wrap">
                                                {regla.subcategorias.map((subcategoria, index) => (
                                                    <span
                                                        key={index}
                                                        className={cn(buttonVariants({ variant: "angry", size: "smBold" }))}
                                                        style={{ width: "auto", justifyContent: "center", marginLeft: "5px", marginTop: "5px" }}
                                                    >
                                                        <img
                                                            src={emojimap[subcategoria] || "/default.svg"}
                                                            alt="Emoji Icon"
                                                            className="w-6 md:w-8 h-6 md:h-8 "
                                                        />
                                                        {subcategoria}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-1 px-3 font-bold text-left">
                                            <div className="flex items-center justify-center space-x-2">
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleEditRule(regla.id)}>

                                                    <img
                                                        src="/edit.svg"
                                                        alt="Edit"
                                                        className=" w-6 h-6"
                                                    />
                                                </DialogTrigger>
                                                <DialogTrigger className="btn w-8 h-8 rounded-[12px] flex items-center justify-center" onClick={() => handleDeleteRule(regla.id)}>
                                                    <img
                                                        src="/delete.svg"
                                                        alt="Delete"
                                                        className=" w-6 h-6"
                                                    />
                                                </DialogTrigger>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                action === "Create" ? <CreateRule onOpenChange={handleOpenChange} /> :
                    action === "Edit" ? <EditRule ruleID={ruleID} onChangeForm={HandleChangeActionForChild} /> :
                        action === "Delete" ? <DeleteRule ruleID={ruleID} onOpenChange={handleOpenChange} /> :
                            action === "Create-Child" ? <CreateRuleChild onOpenChange={handleOpenChange} parentID={ruleID} /> :
                                action === "Edit-Child" ? <EditRuleChild ruleID={childRuleID} parentId={ruleID} onOpenChange={handleOpenChange}/> :
                                    action === "Delete-Child" ? <DeleteRuleChild ruleID={childRuleID} onOpenChange={handleOpenChange} /> :
                                        null
            }
        </Dialog>
    );
};

export default ListadoReglasTable;