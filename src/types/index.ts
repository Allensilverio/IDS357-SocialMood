import { z } from "zod";
export const SignUpSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    apellido: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    direccion: z
      .string()
      .min(10, { message: "Debe tener como mínimo 10 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    correo_electronico: z
      .string()
      .email({ message: "Correo electrónico no válido" })
      .min(10, { message: "Debe tener como mínimo 2 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


export const SignInSchema = z.object({
  correo_electronico: z
    .string()
    .email({ message: "Correo electrónico no válido" })
    .min(10, { message: "Debe tener como mínimo 10 caracteres" })
    .max(100, { message: "El máximo de caracteres es 100" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
    .max(20, { message: "El máximo de caracteres es 20" }),
});


export const CreateRuleSchema = z.object({
  alias: z
    .string().
    min(2, { message: "Debe tener como mínimo 2 caracteres" }),
  red_social: z
    .string()
    .min(1, { message: "Debe seleccionar una red social" }),
  instrucciones: z.
    string().
    min(1, { message: "Debe tener como mínimo 1 caracteres" }).
    max(1000, { message: "El máximo de caracteres es 1000" }),
  tipo: z.
    string().min(1, { message: "Debe seleccionar un tipo de regla" }),
  subcategorias: z.
    array(z.string().min(1)).refine((value) => value.some((item) => item)),
});


export type VariantType =
  | "default"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "google"
  | "angry"
  | "link"
  | null
  | undefined;

export type SizeType =
  | "default"
  | "defaultBold"
  | "sm"
  | "smBold"
  | "lg"
  | "lgBold"
  | "icon"
  | "gg"
  | "angry"
  | null
  | undefined;

export type IconType = "ig" | "fb" | "gg" | "ag" | "angry";

export type ButtonType = "button" | "submit" | "reset";

export const CreateUserSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    apellido: z
      .string()
      .min(2, { message: "Debe tener como mínimo 2 caracteres" })
      .max(50, { message: "El máximo de caracteres es 50" }),
    direccion: z
      .string()
      .min(10, { message: "Debe tener como mínimo 10 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    correo: z
      .string()
      .email({ message: "Correo electrónico no válido" })
      .min(10, { message: "Debe tener como mínimo 2 caracteres" })
      .max(100, { message: "El máximo de caracteres es 100" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
    tipoUsuario: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas con coinciden",
    path: ["confirmPassword"],
  });

// Add Social Media Account Schema
export const AddSocialSchema = z.object({
  platform: z.string().min(1, { message: "Debe seleccionar una plataforma" }),
  account: z.string().min(1, { message: "Debe seleccionar una cuenta" }),
  color: z.string().min(1, { message: "Debe seleccionar un color" }),
});

export type Interacciones = {
  fecha_recepcion: string;
  fecha_respuesta: Date | null;
  mensaje: string;
  enlace_publicacion: string;
  codigo_cuenta_emisor: string;
  enlace_foto_emisor: string;
  codigo_cuenta_receptor: string;
  id_cuenta_receptor: number;
  nombre_red_social_receptor: string;
  categoria: string;
  subcategoria: string;
  emociones_predominantes: string;
  respondida: boolean;
  respuesta: string | null;
  usuario_cuenta_receptor: string;
  usuario_cuenta_emisor: string;
};

export const SubscriptionPlanSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre no debe exceder los 100 caracteres."),
  tipoFacturacion: z.enum(["MONTH", "YEAR"], {
    errorMap: () => ({ message: "Tipo de facturación inválido." }),
  }),
  precio: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número válido."),
  interacciones: z
    .string()
    .regex(/^\d+$/, "Las interacciones deben ser un número entero."),
  redesSociales: z
    .string()
    .regex(/^\d+$/, "Las redes sociales deben ser un número entero."),
  usuarios: z
    .string()
    .regex(/^\d+$/, "Los usuarios deben ser un número entero."),
  descripcion: z
    .string()
    .min(1, "La descripción es obligatoria.")
    .max(500, "La descripción no debe exceder los 500 caracteres."),
});

export const EditResponseSchema = z.object({
  respuesta: z
    .string()
    .min(1, "La respuesta es obligatoria")
})



export const SubscriptionFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
  tipoFacturacion: z
    .enum(["MONTH", "YEAR"])
    .refine((val) => ["MONTH", "YEAR"].includes(val), {
      message: "El tipo de facturación debe ser 'MONTH' o 'YEAR'",
    }),
  precio: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "El precio debe ser un número válido con hasta dos decimales" }),
  interacciones: z
    .string()
    .regex(/^\d+$/, { message: "Las interacciones deben ser un número entero válido" }),
  redesSociales: z
    .string()
    .regex(/^\d+$/, { message: "La cantidad de redes sociales debe ser un número entero válido" }),
  usuarios: z
    .string()
    .regex(/^\d+$/, { message: "La cantidad de usuarios debe ser un número entero válido" }),
  descripcion: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(120, { message: "La descripción no puede exceder los 120 caracteres" }),
});


export const ChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener como mínimo 8 caracteres" })
      .max(20, { message: "El máximo de caracteres es 20" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
      .regex(/[a-z]/, { message: "Debe contener al menos una letra minúscula" })
      .regex(/\d/, { message: "Debe contener al menos un número" })
      .regex(/[^a-zA-Z0-9]/, { message: "Debe contener al menos un carácter especial" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas con coinciden",
    path: ["confirmPassword"],
  });
