import { getAllRegistrations } from "@/app/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { ExportButton } from "@/components/export-button";
import { LogoutButton } from "@/components/logout-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Admin Dashboard — Shoot With Purpose",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const registrations = await getAllRegistrations();

  const paidCount = registrations.filter((r) => r.paymentStatus === "paid").length;
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + (r.amountPaid ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      {/* Top bar */}
      <div className="border-b border-[#1e1e2e] bg-[#0a0a0a] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-[#8b8b9e] text-xs mt-0.5">Shoot With Purpose</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-[#1e1e2e] pr-6">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-[#8b8b9e] text-xs">Live</span>
          </div>
          <ExportButton data={registrations} />
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Simple Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
            <p className="text-[#8b8b9e] text-xs font-medium mb-2 uppercase tracking-wider">Total Registrations</p>
            <p className="text-3xl text-white font-semibold">{registrations.length}</p>
          </div>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
            <p className="text-[#8b8b9e] text-xs font-medium mb-2 uppercase tracking-wider">Confirmed Paid</p>
            <p className="text-3xl text-white font-semibold">{paidCount}</p>
          </div>
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
            <p className="text-[#8b8b9e] text-xs font-medium mb-2 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl text-white font-semibold">GHS {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">All Registrations</h2>
          </div>

          {registrations.length === 0 ? (
            <div className="py-20 text-center border border-[#1e1e2e] rounded-lg border-dashed">
              <p className="text-[#8b8b9e] text-sm">No registrations yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1e1e2e] hover:bg-transparent">
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Name</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Email</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Phone</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">City</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Camera</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Level</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Status</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Paid (GHS)</TableHead>
                    <TableHead className="text-[#8b8b9e] text-xs font-normal">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow
                      key={reg.id}
                      className="border-[#1e1e2e] hover:bg-[#111118] transition-colors"
                    >
                      <TableCell className="font-medium text-white text-sm">{reg.fullName}</TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm">{reg.email}</TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm">{reg.phone}</TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm">{reg.city}</TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm capitalize">{reg.cameraType}</TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm capitalize">{reg.experienceLevel}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={reg.paymentStatus}
                          variant={
                            reg.paymentStatus === "paid"
                              ? "success"
                              : reg.paymentStatus === "partial"
                              ? "error"
                              : reg.paymentStatus === "pending"
                              ? "warning"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell className="text-[#8b8b9e] text-sm">
                        {reg.amountPaid ? reg.amountPaid.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell className="text-[#8b8b9e] text-xs">
                        {new Date(reg.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
