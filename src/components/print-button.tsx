"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="print:hidden bg-blue-600 hover:bg-blue-700 text-white shadow-md fixed bottom-8 right-8 rounded-full px-6 py-6"
    >
      <Printer className="w-5 h-5 mr-2" />
      Print Invoice
    </Button>
  );
}
