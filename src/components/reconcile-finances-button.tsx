"use client";

import { useState } from "react";
import { reconcileFinances } from "@/app/actions";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReconcileFinancesButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleReconcile = async () => {
    setIsLoading(true);
    const result = await reconcileFinances();
    
    if (!result.success) {
      alert(result.error);
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleReconcile}
      disabled={isLoading}
      variant="outline"
      className="border-[#1e1e2e] bg-[#111118] text-[#8b8b9e] hover:bg-[#1e1e2e] hover:text-white transition-colors h-8 text-xs"
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
      ) : (
        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
      )}
      Reconcile Finances
    </Button>
  );
}
