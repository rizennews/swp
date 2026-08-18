import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { eq, desc, ilike } from "drizzle-orm";

export const metadata = {
  title: "Registration Confirmed — Shoot With Purpose",
};

interface Props {
  searchParams: Promise<{ name?: string, id?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { name, id } = await searchParams;
  const firstName = name ? name.split(" ")[0] : "Photographer";

  let actualId = id;

  // Fallback: If ID is not in the URL, try to find their most recent registration by name
  if (!actualId && name) {
    const recentReg = await db.query.registrations.findFirst({
      where: ilike(registrations.fullName, name),
      orderBy: [desc(registrations.createdAt)],
    });
      actualId = recentReg.id;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-lg w-full">        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-8 h-8 text-amber-500" />
          <span className="text-amber-500 text-sm font-semibold uppercase tracking-widest">
            Registration Confirmed
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          You&apos;re in,<br />{firstName}!
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-10">
          Your payment was successful and your spot at <strong className="text-white">Shoot With Purpose</strong> is
          locked in. Check your email for a confirmation receipt.
        </p>

        {/* Event summary */}
        <div className="border border-zinc-800 rounded divide-y divide-zinc-800 mb-10">
          <div className="p-5 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Date</p>
              <p className="text-white font-semibold text-sm">August 21 — 22, 2025</p>
            </div>
          </div>
          <div className="p-5 flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Time</p>
              <p className="text-white font-semibold text-sm">9:00 AM — 5:00 PM daily</p>
            </div>
          </div>
          <div className="p-5 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-white font-semibold text-sm">Accra, Ghana (venue TBA)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent h-11 px-6 rounded"
            >
              Back to Home
            </Button>
          </Link>
          
          <a href="https://wa.me/233553544431" target="_blank" rel="noreferrer">
            <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-11 px-6 rounded border-none">
              WhatsApp Us
            </Button>
          </a>

          {actualId && (
            <Link href={`/admin/invoice/${actualId}`} target="_blank">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-11 px-6 rounded w-full sm:w-auto">
                Print Invoice
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
