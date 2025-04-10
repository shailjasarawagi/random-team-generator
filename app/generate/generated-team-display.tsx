"use client";

import type { GeneratedSession } from "@/lib/types";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, calculateBalanceScore } from "@/lib/utils";
import SkillStars from "@/components/UI/skill-stars";

interface GeneratedTeamDisplayProps {
  session: GeneratedSession;
}

export default function GeneratedTeamDisplay({
  session,
}: GeneratedTeamDisplayProps) {


  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${session.publicId}`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Share link has been copied to clipboard"))
        .catch(() => {
            toast.error("Failed to copy link. Please copy it manually: ");   
        });
    }
  };
  const balanceScore = calculateBalanceScore(session.teamAssignments);
  const balanceQuality =
    balanceScore < 0.3
      ? "Excellent"
      : balanceScore < 0.7
      ? "Good"
      : balanceScore < 1.0
      ? "Fair"
      : "Poor";



  const formattedDate = formatDate(session.date);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{session.title}</h2>
            <p className="text-sm text-gray-500">
              Generated on {formattedDate}
            </p>
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50 transition"
            onClick={handleShareLink}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border-b">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Balance Quality:</span>{" "}
            {balanceQuality}
          </p>
          <p className="text-sm text-blue-700">
            <span className="font-medium">Teams:</span>{" "}
            {session.teamAssignments.length}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {session?.teamAssignments?.map((team) => (
            <div
              key={team.teamId}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{team.teamName}</h3>
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                    Avg: {team.averageSkill}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <ul className="space-y-2">
                  {team?.players?.map((player) => (
                    <li
                      key={player.id}
                      className="flex items-center justify-between text-sm p-2 border-b last:border-0"
                    >
                      <span>{player?.name}</span>
                      <SkillStars skill={player?.skill} size="sm" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-500">
          Teams are balanced based on player skill levels for fair competition.
        </p>
      </div>
    </div>
  );
}
