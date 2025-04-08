import Link from "next/link";
import { Users, ListPlus, Shuffle } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Random Team Generator
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Create balanced teams from your player pool based on skill levels
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2">
              <Users className="h-5 w-5" />
              Player Management
            </div>
            <p className="text-gray-500 mb-4">
              Add, edit, and remove players with skill ratings
            </p>
            <Link href="/players">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
                Manage Players
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2">
              <ListPlus className="h-5 w-5" />
              Team Management
            </div>
            <p className="text-gray-500 mb-4">
              Create and manage your team structures
            </p>
            <Link href="/teams">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
                Manage Teams
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-semibold mb-2">
              <Shuffle className="h-5 w-5" />
              Generate Teams
            </div>
            <p className="text-gray-500 mb-4">
              Create balanced teams based on player skills
            </p>
            <Link href="/generate">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
                Generate Teams
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
