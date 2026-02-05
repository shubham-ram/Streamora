import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UserX } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
          <UserX className="w-12 h-12 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
        <p className="text-slate-400 mb-6">
          The user you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
