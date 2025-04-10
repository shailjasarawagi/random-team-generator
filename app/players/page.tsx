"use client";

import { useCallback, useEffect, useState } from "react";
import { getPlayers } from "@/lib/db";
import PlayerList from "./player-list";
import AddPlayerForm from "./add-player-form";
import type { Player } from "@/lib/types";
import Loading from "@/components/UI/loading";
import EmptyState from "@/components/UI/empty-state";
import { Users } from "lucide-react";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPlayers = await getPlayers();
      setPlayers(fetchedPlayers);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to load players. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handlePlayerAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Player Management</h1>
        <Loading message="Loading players..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Player Management</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button onClick={fetchPlayers} className="mt-2 text-sm underline">
            Try again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Player Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {players.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <EmptyState
                title="No Players Yet"
                message="Add your first player to get started"
                icon={<Users className="h-12 w-12 text-gray-400" />}
              />
            </div>
          ) : (
            <PlayerList
              initialPlayers={players}
              onPlayerDeleted={fetchPlayers}
            />
          )}
        </div>
        <div>
          <AddPlayerForm onPlayerAdded={handlePlayerAdded} />
        </div>
      </div>
    </div>
  );
}
