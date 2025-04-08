"use client";

import { useEffect, useState } from "react";
import { getTeams } from "@/lib/db";
import TeamList from "./team-list";
import AddTeamForm from "./add-team-form";
import type { Team } from "@/lib/db";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTeams = async () => {
      const fetchedTeams = await getTeams();
      setTeams(fetchedTeams);
    };

    fetchTeams();
  }, [refreshKey]);

  const handleTeamChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Team Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <TeamList initialTeams={teams} onTeamDeleted={handleTeamChanged} />
        </div>

        <div>
          <AddTeamForm onTeamAdded={handleTeamChanged} />
        </div>
      </div>
    </div>
  );
}
