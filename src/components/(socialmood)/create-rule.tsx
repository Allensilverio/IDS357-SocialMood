import React from "react";

import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"

import router, { useRouter } from "next/router";


import { useEffect } from "react";

import { createRule, getSocialMediaAccounts } from "@/app/actions/(socialmood)/rules.actions";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";


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

import { getSubscription, getActiveUserId } from "@/app/actions/(socialmood)/auth.actions";

import SocialButton from "./social-button";

import { useTranslation } from "react-i18next";

interface CreateRuleProps {
    onOpenChange: (newOpenValue: boolean) => void;
}

export default function CreateRule({ onOpenChange }: CreateRuleProps) {

    const {t} = useTranslation();

    const items = [
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
    ] as const

    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof CreateRuleSchema>>({
        resolver: zodResolver(CreateRuleSchema),
        defaultValues: {
            alias: "",
            red_social: "",
            tipo: "1",
            instrucciones: "",
            subcategorias: [],
        },
    });

    async function onSubmit(values: z.infer<typeof CreateRuleSchema>) {
        setIsPending(true);
        const res = await createRule(values);
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
            onOpenChange(false);
        }
        setIsPending(false);
    }

    async function onClose() {
        form.reset();
        onOpenChange(false);
    }

    const [SubscriptionID, setSubscriptionID] = useState<number>(0);

    const setSubscription = async () => {
        const userID = await getActiveUserId();
        console.log("UserID ", userID);
        if (userID) {
            const subscription = await getSubscription(parseInt(userID));
            if (subscription) {
                setSubscriptionID(subscription);
                console.log("Subscription ", subscription);
            }
            else {
                await router.push("/app/get-sub");
            }

        }
        else {
            await router.push("/app/sign-in");
        }
    }

    const [socialMedias, setSocialMedias] = useState<{ id: string, label: string }[]>([]);

    async function fetchSocialMediaAccounts() {
        const accounts = await getSocialMediaAccounts(SubscriptionID);
        setSocialMedias(accounts.map(account => ({ id: account.id.toString(), label: account.usuario_cuenta })));
    }

    useEffect(() => {
        setSubscription();
        fetchSocialMediaAccounts();
    }, [SubscriptionID]);

    return (
        <DialogContent className="flex items-start md:w-[90%]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full py-5">
                    <DialogHeader className="w-full">
                        <DialogTitle className="flex justify-between w-full mt-6">
                            <div className="flex"><img src="/magic-wand.svg" className="w-[49px] h-[49px]" />
                                <h1 className="ml-2 text-[40px]">{t('Crear Regla')}</h1>
                            </div>
                            <SocialButton
                                variant="default"
                                isPending={isPending}
                                defaultText={t("Guardar")}
                                customStyle="text-[20px]"
                                pendingText={t("Guardando"+"...")}
                                type="submit"
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
                                                    <Select name="red_social" onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-full px-3 py-2 
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
                                                {items.map((item) => (
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
                                                    <Textarea placeholder={t("Redactar instrucciones"+"...")} className="w-full px-3 py-2 
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
