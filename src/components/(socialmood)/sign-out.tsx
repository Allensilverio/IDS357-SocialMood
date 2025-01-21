"use client";
import { signOut } from "@/app/actions/(socialmood)/auth.actions";
import { LogOut } from "lucide-react";

const handleSignOut = async () => {
  await signOut();
};

export default function SignOut() {
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center text-white underline hover:text-gray-300"
    >
      <LogOut size={24} />
      <span className="ml-2">Sign Out</span>
    </button>
  );
}
