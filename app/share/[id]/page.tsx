"use client";
import { getSessionByPublicId } from "@/lib/db";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/UI/loading";
import SkillStars from "@/components/UI/skill-stars";
import { Home } from "lucide-react";
import type { GeneratedSession } from "@/lib/types";
import { formatDate } from "@/lib/utils";
type Props = {
  params: Promise<{ id: string }>;
};

export default function SharedTeamPage({ params }: Props) {
  const [session, setSessions] = useState<GeneratedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const fetchedSession = await getSessionByPublicId(id);
        if (fetchedSession) {
          setSessions(fetchedSession);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Loading message="Loading team data..." />
      </div>
    );
  }
  if (error || !session) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-10">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <p className="mb-6">
            The team you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(session.date);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-sm text-gray-500">
              Generated on {formattedDate}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session?.teamAssignments?.map((team: any) => (
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
                    {team?.players?.map((player: any) => (
                      <li
                        key={player.id}
                        className="flex items-center justify-between text-sm p-2 border-b last:border-0"
                      >
                        <span>{player.name}</span>
                        <SkillStars skill={player.skill} size="sm" />
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
            Teams are balanced based on player skill levels for fair
            competition.
          </p>
        </div>
      </div>
    </div>
  );
}
