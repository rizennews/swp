"use client";

import { useState } from "react";
import { refundRegistration, deleteRegistration } from "@/app/actions";
import { Loader2, Settings2 } from "lucide-react";
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

  const handleRefund = async () => {
    setIsLoading(true);
    const result = await refundRegistration(id);
    
    if (!result.success) {
      alert(result.error || "Failed to refund.");
      setIsLoading(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
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
            title="Manage Registration"
            className="p-1.5 text-[#8b8b9e] hover:text-white hover:bg-white/10 rounded-md transition-colors"
          />
        }
      >
        <Settings2 className="w-4 h-4" />
      </DialogTrigger>
      
      <DialogContent className="bg-[#13131e] border-[#1e1e2e] pb-6">
        <DialogHeader>
          <DialogTitle className="text-white">Manage Registration</DialogTitle>
          <DialogDescription className="text-[#8b8b9e]">
            Choose an action below. You can issue a refund (which leaves the user in your database as "Refunded"), or you can permanently delete their record.
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
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Record
          </Button>
          <Button
            onClick={handleRefund}
            disabled={isLoading || isDeleting}
            className="bg-zinc-800 hover:bg-zinc-700 text-white border-none"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Issue Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
