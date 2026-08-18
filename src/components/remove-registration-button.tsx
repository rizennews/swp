"use client";

import { useState } from "react";
import { rejectAndRefundRegistration } from "@/app/actions";
import { Loader2, Trash2 } from "lucide-react";

export function RemoveRegistrationButton({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this registration and issue a full refund via Paystack? This action is irreversible."
    );

    if (!confirmed) return;

    setIsLoading(true);
    const result = await rejectAndRefundRegistration(id);
    
    if (!result.success) {
      alert(result.error || "Failed to remove and refund.");
      setIsLoading(false);
    }
    // If successful, the server action revalidates the page, triggering a UI refresh.
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isLoading}
      title="Reject & Refund"
      className="p-1.5 text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
