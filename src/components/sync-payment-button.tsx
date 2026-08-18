"use client";

import { useState } from "react";
import { syncPaymentStatus } from "@/app/actions";
import { Loader2, RefreshCw } from "lucide-react";

export function SyncPaymentButton({ id, email }: { id: string, email: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    const result = await syncPaymentStatus(id, email);
    
    if (!result.success) {
      alert(result.error);
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleSync}
      disabled={isLoading}
      title="Check Paystack for successful payment"
      className="p-1.5 text-[#8b8b9e] hover:text-green-400 hover:bg-green-500/10 rounded-md transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
    </button>
  );
}
