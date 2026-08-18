"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
        },
      },
    });
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#8b8b9e] hover:text-white transition-colors"
      title="Log out"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
