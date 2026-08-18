"use client";

import { useState } from "react";
import { rejectAndRefundRegistration, deleteRegistration } from "@/app/actions";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRefundAndDelete = async () => {
    setIsLoading(true);
    const result = await rejectAndRefundRegistration(id);
    
    if (!result.success) {
      alert(result.error || "Failed to remove and refund.");
      setIsLoading(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleDeleteOnly = async () => {
    setIsDeleting(true);
    const result = await deleteRegistration(id);
    
    if (!result.success) {
      alert(result.error || "Failed to delete.");
      setIsDeleting(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <button
            title="Reject & Remove"
            className="p-1.5 text-[#8b8b9e] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          />
        }
      >
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>
      
      <DialogContent className="bg-[#13131e] border-[#1e1e2e] pb-6">
        <DialogHeader>
          <DialogTitle className="text-white">Reject Registration</DialogTitle>
          <DialogDescription className="text-[#8b8b9e]">
            Choose an action below. You can either issue a full refund via Paystack and delete the user, or just delete the user's record from the database without refunding.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-none bg-transparent sm:justify-end gap-3 pt-6 pb-2 m-0">
          <DialogClose
            render={
              <Button
                variant="outline"
                disabled={isLoading || isDeleting}
                className="border-[#1e1e2e] bg-transparent text-white hover:bg-[#1e1e2e]"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button
            onClick={handleDeleteOnly}
            disabled={isLoading || isDeleting}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Just Delete
          </Button>
          <Button
            onClick={handleRefundAndDelete}
            disabled={isLoading || isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refund & Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
