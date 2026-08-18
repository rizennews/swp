import { notFound } from "next/navigation";
import { getRegistrationById } from "@/app/actions";
import { COURSE_FEE } from "@/lib/constants";
import { PrintButton } from "@/components/print-button";

export const metadata = {
  title: "Invoice — Shoot With Purpose",
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const registration = await getRegistrationById(id);

  if (!registration) {
    notFound();
  }

  const invoiceNumber = `INV-${registration.id.substring(0, 8).toUpperCase()}`;
  const date = new Date(registration.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 print:py-0 print:bg-white text-gray-900 font-sans">
      <div className="bg-white w-full max-w-4xl shadow-xl print:shadow-none p-12 md:p-20 print:p-0 print:max-w-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-black mb-2">INVOICE</h1>
            <p className="text-gray-500 font-medium">#{invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold tracking-tighter">SHOOT WITH PURPOSE</h2>
            <p className="text-gray-500 text-sm mt-1">Accra, Ghana</p>
            <p className="text-gray-500 text-sm">contact@shootwithpurpose.com</p>
          </div>
        </div>

        {/* Customer & Details */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-bold text-lg">{registration.fullName}</p>
            <p className="text-gray-600">{registration.email}</p>
            <p className="text-gray-600">{registration.phone}</p>
            <p className="text-gray-600">{registration.city}</p>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</h3>
              <p className="font-semibold">{date}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Status</h3>
              <p className={`font-bold capitalize ${
                registration.paymentStatus === "paid" ? "text-green-600" 
                : registration.paymentStatus === "partial" ? "text-orange-600"
                : "text-red-600"
              }`}>
                {registration.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider">Description</th>
                <th className="py-3 font-bold text-sm text-gray-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-bold text-gray-900">Shoot With Purpose Masterclass</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Attendee: {registration.fullName} | Camera: {registration.cameraType} | Level: {registration.experienceLevel}
                  </p>
                </td>
                <td className="py-4 text-right font-semibold">GHS {COURSE_FEE.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">GHS {COURSE_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-semibold text-green-600">GHS {(registration.amountPaid || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="font-bold text-lg">Balance Due</span>
              <span className="font-bold text-lg">
                GHS {Math.max(0, COURSE_FEE - (registration.amountPaid || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 border-t pt-8 mt-auto">
          {registration.paystackReference && (
            <p className="mb-2">Transaction Ref: <span className="font-mono text-xs">{registration.paystackReference}</span></p>
          )}
          <p>Thank you for registering for Shoot With Purpose.</p>
        </div>

      </div>

      <PrintButton />
    </div>
  );
}
