"use client";

import { useState } from "react";
import { rejectAndRefundRegistration } from "@/app/actions";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function RemoveRegistrationButton({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    const result = await rejectAndRefundRegistration(id);
    
    if (!result.success) {
      alert(result.error || "Failed to remove and refund.");
      setIsLoading(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <button
            title="Reject & Refund"
            className="p-1.5 text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          />
        }
      >
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>
      
      <DialogContent className="bg-[#13131e] border-[#1e1e2e]">
        <DialogHeader>
          <DialogTitle className="text-white">Reject Registration</DialogTitle>
          <DialogDescription className="text-[#8b8b9e]">
            Are you sure you want to reject this registration and issue a full refund via Paystack? This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-none bg-transparent sm:justify-end gap-2 p-0 mt-4">
          <DialogClose
            render={
              <Button
                variant="outline"
                disabled={isLoading}
                className="border-[#1e1e2e] bg-transparent text-white hover:bg-[#1e1e2e]"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button
            onClick={handleRemove}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Refund & Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
