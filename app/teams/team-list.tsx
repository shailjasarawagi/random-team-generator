"use client";

import { useState, useEffect } from "react";
import type { Team } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import { removeTeam } from "./action";
import toast from "react-hot-toast";
import EditTeamDialog from "./edit-team-dialog";
import ConfirmDialog from "@/components/UI/confirm-dialog";

interface TeamListProps {
  initialTeams: Team[];
  onTeamDeleted: () => void;
}

export default function TeamList({
  initialTeams,
  onTeamDeleted,
}: TeamListProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  const handleEditClick = (team: Team) => {
    setSelectedTeam(team);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeam) return;

    const result = await removeTeam(selectedTeam.id);

    if (result.success) {
      setTeams(teams.filter((t) => t.id !== selectedTeam.id));
      toast.success(result.message);
      onTeamDeleted();
    } else {
      toast.error(result.message);
    }

    setShowDeleteConfirm(false);
  };

  const handleTeamUpdated = (updatedTeam: Team) => {
    setTeams(teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
    onTeamDeleted();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Teams ({teams.length})</h2>

        {teams.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No teams added yet</p>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <h3 className="font-medium">{team.name}</h3>

                <div className="flex gap-2">
                  <button
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                    onClick={() => handleEditClick(team)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                    onClick={() => handleDeleteClick(team)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Player"
        message={`Are you sure you want to delete ${selectedTeam?.name}? This action cannot be undone.`}
        confirmLabel={"Delete"}
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {showEditDialog && selectedTeam && (
        <EditTeamDialog
          team={selectedTeam}
          onClose={() => setShowEditDialog(false)}
          onTeamUpdated={handleTeamUpdated}
        />
      )}
    </>
  );
}
