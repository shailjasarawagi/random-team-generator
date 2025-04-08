// Change the component to be a client component so we can use hooks
"use client"

import { useEffect, useState } from "react"
import { getPlayers } from "@/lib/db"
import PlayerList from "./player-list"
import AddPlayerForm from "./add-player-form"
import type { Player } from "@/lib/db"

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getPlayers()
      setPlayers(fetchedPlayers)
    }

    fetchPlayers()
  }, [refreshKey])

  const handlePlayerAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Player Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <PlayerList initialPlayers={players} onPlayerDeleted={handlePlayerAdded} />
        </div>

        <div>
          <AddPlayerForm onPlayerAdded={handlePlayerAdded} />
        </div>
      </div>
    </div>
  )
}

