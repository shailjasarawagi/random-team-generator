"use client";

import { useEffect, useState } from "react";
import type { GeneratedSession } from "@/lib/types";
import { Share2, ChevronRight, Clock } from "lucide-react";
import { getAllGeneratedSessions } from "./action";
import toast from "react-hot-toast";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/UI/empty-state";

export default function PreviousGenerations() {
  const [sessions, setSessions] = useState<GeneratedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const result = await getAllGeneratedSessions();

        if (result.success && result.data) {
          setSessions(result.data);
        } else {
          setError(result.message || "Failed to fetch previous generations");
          toast.error(result.message || "Failed to fetch previous generations");
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleShareLink = (publicId: string) => {
    const shareUrl = `${window.location.origin}/share/${publicId}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Share link has been copied to clipboard"))
        .catch((err) => {
          console.error("Failed to copy:", err);
          toast.error("Failed to copy link");
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        toast.success("Share link has been copied to clipboard");
      } catch (err) {
        toast.error("Failed to copy link");
      }

      document.body.removeChild(textArea);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <p>Loading previous generations...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-4 px-6 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p>{error}</p>
      </div>
    );
  }
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No Previous Generations"
        message="Generate your first team to see it here"
        icon={<Clock className="h-12 w-12 text-gray-400" />}
      />
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
