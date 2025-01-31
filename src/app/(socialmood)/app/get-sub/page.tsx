import { validateRequest } from "@/lib/lucia/lucia";
import { redirect } from "next/navigation";
import basic from "/public/basic.png";
import pro from "/public/pro.png";
import premium from "/public/premium.png";
import Image from "next/image";
import BlurredContainer from "@/components/(socialmood)/blur-background-sub";
import HorizontalLine from "@/components/(socialmood)/horizontal-line";
import IconContainer from "@/components/(socialmood)/check";
import { getSubscriptionPlans } from "@/app/actions/(socialmood)/get-plans.actions";
import SubscribeButton from "@/components/(socialmood)/subscribe-button"; // Client-side component
import { getUserSubscription } from "@/app/actions/(socialmood)/get-plans.actions";
import { getUserById } from "@/app/actions/(socialmood)/user.actions";


export default async function GetSubscription() {
  const plans = await getSubscriptionPlans();
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/");
  }
  else{
    const userdata = await getUserById(user?.id);
    if (userdata?.tipo_usuario == "admin") {
      return redirect("/bo");
    }
  }

  const userSubscription = await getUserSubscription(user.id);
  const userHasAnyPlan = !!userSubscription;

  const planDescription = plans.map((plan) => ({
    id: plan.id,
    name: plan.nombre,
    price: plan.costo,
    features: [
      `${plan.cantidad_interacciones_mes} interacciones por mes`,
      `Administra hasta ${plan.cantidad_cuentas_permitidas} redes sociales`,
      `Cantidad máxima de ${plan.cantidad_usuarios_permitidos} usuarios`,
    ],
    description: plan.descripcion,
    variant: plan.nombre === "Plan Intermedio" ? "rose" : "blur",
    image:
      plan.nombre === "Plan Básico"
        ? basic
        : plan.nombre === "Plan Intermedio"
          ? pro
          : premium,
    isCurrentPlan: userSubscription?.planId === plan.id,
    type: plan.id_tipo_facturacion == 1 ? "Mensual" : "Anual",
  }));

  return (
    <main className="flex flex-wrap items-center justify-center space-y-6 space-x-4">
      {planDescription.map((plan, index) => (
        <BlurredContainer
          key={index}
          variant={"blur"}
          customStyle={`space-y-4`}
        >
          <section className="flex flex-col items-center justify-center space-y-3">
            <section className="flex flex-col items-center justify-center">
              <Image
                src={plan.image}
                quality={100}
                alt={`${plan.name} plan image`}
              />
              <h1 className="text-lg font-medium text-white">{plan.name}</h1>
            </section>
            <section className="flex space-x-1">
              <h1 className="text-8xl text-white font-black">${plan.price}</h1>
              <p className="text-gray-100 font-medium opacity-70 self-end text-base">
                /$ {plan.type}
              </p>
            </section>
          </section>
          <SubscribeButton
            planId={plan.id}
            variant={plan.variant}
            index={index}
            isCurrentPlan={plan.isCurrentPlan}
            planName={plan.name}
            userHasAnyPlan={userHasAnyPlan}
          />
          <HorizontalLine width="w-[75%]" />
          <section className="flex flex-col items-start justify-start space-y-2">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex space-x-3">
                <IconContainer
                  bgColor={index === 1 ? "bg-white" : "bg-[#F86A3A]"}
                  size={18}
                  iconColor={index === 1 ? "#D24EA6" : "white"}
                />
                <h2 className="text-xs text-white font-medium">{feature}</h2>
              </div>
            ))}
          </section>
          <HorizontalLine width="w-[75%]" />
          <section className="flex flex-col items-center justify-center space-y-4 px-4 2xl:px-6">
            <h1 className="text-lg font-medium text-white">Descripción</h1>
            <p className="text-xs text-white font-medium text-justify">
              {plan.description}
            </p>
          </section>
        </BlurredContainer>
      ))}
    </main>
  );
}
