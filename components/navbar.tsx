import Link from "next/link";
import { Users, ListPlus, Shuffle, Home } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          Team Generator
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/players"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition"
          >
            <Users className="h-4 w-4" />
            Players
          </Link>
          <Link
            href="/teams"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition"
          >
            <ListPlus className="h-4 w-4" />
            Teams
          </Link>
          <Link
            href="/generate"
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition"
          >
            <Shuffle className="h-4 w-4" />
            Generate
          </Link>
        </div>
      </div>
    </nav>
  );
}
