"use client";

import { useState, useEffect } from "react";
import type { Player } from "@/lib/types";
import { Pencil, Trash2, Star } from "lucide-react";
import { removePlayer } from "./action";
import toast from "react-hot-toast";
import EditPlayerDialog from "./edit-player-dialog";
import ConfirmDialog from "@/components/UI/confirm-dialog";
import SkillStars from "@/components/UI/skill-stars";
interface PlayerListProps {
  initialPlayers: Player[];
  onPlayerDeleted: () => void;
}

export default function PlayerList({
  initialPlayers,
  onPlayerDeleted,
}: PlayerListProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setPlayers(initialPlayers);
  }, [initialPlayers]);

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlayer) return;

    setIsDeleting(true);

    try {
      const result = await removePlayer(selectedPlayer.id);

      if (result.success) {
        toast.success(result.message);
        await onPlayerDeleted();
      } else {
        toast.error(result.message || "Failed to delete player");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePlayerUpdated = (updatedPlayer: Player) => {
    setPlayers(
      players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
    onPlayerDeleted();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Players ({players.length})
        </h2>

        <div className="space-y-4">
          {players?.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{player.name}</h3>
                <div className="flex mt-1">
                  <SkillStars skill={player.skill} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleEditClick(player)}
                  aria-label={`Edit ${player.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => handleDeleteClick(player)}
                  aria-label={`Delete ${player.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Player"
        message={`Are you sure you want to delete ${selectedPlayer?.name}? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showEditDialog && selectedPlayer && (
        <EditPlayerDialog
          player={selectedPlayer}
          onClose={() => setShowEditDialog(false)}
          onPlayerUpdated={handlePlayerUpdated}
        />
      )}
    </>
  );
}
