"use client"

import { useState, useEffect } from "react"
import type { Player } from "@/lib/db"
import { Pencil, Trash2, Star } from "lucide-react"
import { removePlayer } from "./action"
import toast from "react-hot-toast"
import EditPlayerDialog from "./edit-player-dialog"

interface PlayerListProps {
  initialPlayers: Player[]
  onPlayerDeleted: () => void
}

export default function PlayerList({ initialPlayers, onPlayerDeleted }: PlayerListProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // Update players when initialPlayers changes
  useEffect(() => {
    setPlayers(initialPlayers)
  }, [initialPlayers])

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPlayer) return

    const result = await removePlayer(selectedPlayer.id)

    if (result.success) {
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id))
      toast.success(result.message)
      onPlayerDeleted() // Call the callback to refresh the list
    } else {
      toast.error(result.message)
    }

    setShowDeleteConfirm(false)
  }

  const handlePlayerUpdated = (updatedPlayer: Player) => {
    setPlayers(players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)))
    onPlayerDeleted() // Call the callback to refresh the list
  }

  // Render stars for skill level
  const renderSkillStars = (skill: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < skill ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
      ))
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Players ({players.length})</h2>

        {players.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No players added yet</p>
        ) : (
          <div className="space-y-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{player.name}</h3>
                  <div className="flex mt-1">{renderSkillStars(player.skill)}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                    onClick={() => handleEditClick(player)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                    onClick={() => handleDeleteClick(player)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-4">
              This will permanently delete {selectedPlayer?.name} from the player list.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Player Dialog */}
      {showEditDialog && selectedPlayer && (
        <EditPlayerDialog
          player={selectedPlayer}
          onClose={() => setShowEditDialog(false)}
          onPlayerUpdated={handlePlayerUpdated}
        />
      )}
    </>
  )
}

