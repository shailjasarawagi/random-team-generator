"use client";

import { useEffect, useState } from "react";
import type { GeneratedSession } from "@/lib/db";
import { Share2, ChevronRight } from "lucide-react";
import { getAllGeneratedSessions } from "./action";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PreviousGenerations() {
  const [sessions, setSessions] = useState<GeneratedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const result = (await getAllGeneratedSessions()) as any;
      if (result.success) {
        setSessions(result.data);
      } else {
        toast.error(result.message || "Failed to fetch previous generations");
      }

      setIsLoading(false);
    };

    fetchSessions();
  }, []);

  const handleShareLink = (publicId: string) => {
    const shareUrl = `${window.location.origin}/share/${publicId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link has been copied to clipboard");
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading previous generations...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">No previous team generations found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Previous Team Generations</h2>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{session.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(session.date)} • {session.teamAssignments.length}{" "}
                teams
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                onClick={() => handleShareLink(session.publicId)}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <Link href={`/share/${session.publicId}`}>
                <button className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
