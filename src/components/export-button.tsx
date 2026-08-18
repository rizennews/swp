"use client";

import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Define columns
    const headers = ["Name", "Email", "Phone", "City", "Camera Type", "Experience Level", "Goal", "Payment Status", "Amount Paid", "Date"];
    
    // Map data
    const csvRows = data.map(reg => {
      return [
        reg.fullName,
        reg.email,
        reg.phone,
        reg.city,
        reg.cameraType,
        reg.experienceLevel,
        `"${reg.goal?.replace(/"/g, '""') || ''}"`, // Escape quotes and wrap in quotes for CSV
        reg.paymentStatus,
        reg.amountPaid || 0,
        new Date(reg.createdAt).toLocaleDateString()
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `swp_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[#1a1a24] hover:bg-[#2a2a36] border border-[#2e2e3e] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-3.5 h-3.5" />
      Export CSV
    </button>
  );
}
