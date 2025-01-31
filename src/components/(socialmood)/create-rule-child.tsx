"use client"
import React, { useEffect } from "react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CreateRuleSchema } from "../../types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SocialButton from "./social-button";

import router, { useRouter } from "next/router";

import { getSubscription, getActiveUserId } from "@/app/actions/(socialmood)/auth.actions";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { getRuleSubcategories, getSocialMediaAccounts, getRule, createChildRule } from "@/app/actions/(socialmood)/rules.actions";
import { useTranslation } from "react-i18next";

interface CreateRuleChildProps {
    onOpenChange: (newOpenValue: boolean, action: string) => void;
    parentID: number;
}

export default function CreateRuleChild({ onOpenChange, parentID }: CreateRuleChildProps) {

    const {t} = useTranslation();

    const [isPending, setIsPending] = useState(false);

    const [socialMedias, setSocialMedias] = useState<{ id: string, label: string }[]>([]);

    const [redSocial, setRedSocial] = useState("");

    const [Subcategorias, SetSubcategorias] = useState([
        {
            id: "1",
            label: t("Recomendación"),
        },
        {
            id: "2",
            label: t("Consulta"),
        },
        {
            id: "3",
            label: t("Queja"),
        },
        {
            id: "4",
            label: t("Elogio"),
        }
    ]);

    const form = useForm<z.infer<typeof CreateRuleSchema>>({
        resolver: zodResolver(CreateRuleSchema),
        defaultValues: {
            alias: "",
            red_social: "",
            tipo: "2",
            instrucciones: "",
            subcategorias: [],
        },
    });

    async function onSubmit(values: z.infer<typeof CreateRuleSchema>) {
        form.trigger();
        if (!form.formState.isValid) {
            return;
        }
        setIsPending(true);
        const res = await createChildRule(values, parentID);
        if (res.error) {
            toast({
                variant: "destructive",
                description: res.error,
            });
            setIsPending(false);
        } else if (res.success) {
            toast({
                variant: "default",
                description: "Rule created successfully",
            });

            form.reset();
            onOpenChange(false, "Edit");
        }
        setIsPending(false);
    }

    async function onClose() {
        form.reset();
        onOpenChange(false, "Edit");
    }

    const fetchSubcategorias = async () => {
        const subcategorias = await getRuleSubcategories(parentID);
        SetSubcategorias(subcategorias.map(subcategoria => ({
            ...subcategoria,
            id: subcategoria.id.toString()
        })));
    };

    async function fetchSocialMediaAccounts() {
        const accounts = await getSocialMediaAccounts(SubscriptionID);
        setSocialMedias(accounts.map(account => ({ id: account.id.toString(), label: account.usuario_cuenta })));
    }

    async function fetchSocialMedia() {
        const socialMedia = await getRule(parentID);
        const cuenta = (socialMedia?.perfil?.id_cuenta?.toString() || "");
        setRedSocial(cuenta);
        console.log(cuenta);
        form.reset({
            tipo: "2",
            red_social: cuenta,
        });

    }

    const [SubscriptionID, setSubscriptionID] = useState<number>(0);

    const setSubscription = async () => {
        const userID = await getActiveUserId();
        if (userID) {
            const subscription = await getSubscription(parseInt(userID));
            if (subscription) {
                setSubscriptionID(subscription);
            }
            else {
                await router.push("/app/get-sub");
            }

        }
        else {
            await router.push("/app/sign-in");
        }
    }


    const updateData = async () => {
        await setSubscription();
        await fetchSubcategorias();
        await fetchSocialMediaAccounts();
        await fetchSocialMedia();
    }

    useEffect(() => {
        updateData();
    }, [SubscriptionID, parentID]);

    return (
        <DialogContent className="flex items-start md:w-[90%] bg-[#2C2436]">
            <Form {...form}>
                <form id="create-child-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full py-5">
                    <DialogHeader className="w-full">
                        <DialogTitle className="flex justify-between w-full mt-6">
                            <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                                <h1 className="ml-2 text-[40px]">{t('Crear Regla Hijo')}</h1>
                            </div>
                            <SocialButton
                                variant="default"
                                isPending={isPending}
                                defaultText={t("Guardar")}
                                customStyle="text-[20px]"
                                pendingText={t("Guardando...")}
                                type="button"
                                onClick={() => { onSubmit(form.getValues()) }}
                            />
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="w-full">
                        <div className="flex flex-col w-full">

                            <div className="flex w-full space-x-2">
                                <div className="bg-orange-500 text-[20px] text-white rounded-full w-10 h-8 flex items-center justify-center">01</div>
                                <div className="flex-1 ml-2">
                                    <FormField
                                        control={form.control}
                                        name="alias"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t("Alias de la regla")}
                                                        className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] "
                                                        autoComplete="alias" {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div className="flex w-full space-x-28">
                                <div className="w-1/2 space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="red_social"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">{t('Red Social')}</FormLabel>
                                                <FormControl>
                                                    <Select name="red_social" onValueChange={field.onChange} value={redSocial}>
                                                        <SelectTrigger disabled className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] ">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {socialMedias.map((socialMedia) => (
                                                                <SelectItem key={socialMedia.id} value={socialMedia.id}>
                                                                    {socialMedia.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />{" "}
                                    <FormField
                                        control={form.control}
                                        name="subcategorias"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">{t('Subcategorias')}</FormLabel>
                                                {Subcategorias.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="subcategorias"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {item.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="tipo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">{t('Tipo')}</FormLabel>
                                                <FormControl>
                                                    <Select name="tipo" onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger disabled className="w-full px-3 py-2 
                            rounded-[10px] 
                            focus:outline-none focus:ring-2 focus:ring-primary 
                            bg-white text-[#2C2436] ">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">{t('Padre')}</SelectItem>
                                                            <SelectItem value="2">{t('Hijo')}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />{" "}
                                </div>
                            </div>
                            <div className="flex w-full">
                                <div className="w-full mt-5">
                                    <FormField
                                        control={form.control}
                                        name="instrucciones"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium">{t('Instrucciones')}</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={t("Redactar instrucciones...")} className="w-full px-3 py-2 
                    rounded-[12px] border-transparent
                    focus:outline-none focus:ring-2 focus:ring-primary
                    bg-[#EBEBEB] text-black " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                        </div>
                    </DialogDescription>
                </form>
            </Form>
            <button onClick={onClose} className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <img src="/delete.svg" alt="Close" className="w-6 h-6" />
            </button>
        </DialogContent>
    );
}
