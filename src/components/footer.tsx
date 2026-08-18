import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d0d14] border-t border-[#1e1e2e]">
      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-white font-semibold text-sm">
          ShootWithPurpose
        </Link>
        <p className="text-[#3a3a4a] text-xs">
          © {new Date().getFullYear()} ShootWithPurpose · Accra, Ghana
        </p>

      </div>
    </footer>
  );
}

