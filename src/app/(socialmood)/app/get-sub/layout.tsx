import SignOut from "@/components/(socialmood)/sign-out";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex items-center justify-center bg-[#2C2436] w-full min-h-screen">
            <main className="flex flex-col">
            <div className="self-end pr-8"><SignOut /></div>
            {children}
            </main>
        </div>
    );
}
