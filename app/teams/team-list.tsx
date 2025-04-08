"use client";

import { useState, useEffect } from "react";
import type { Team } from "@/lib/db";
import { Pencil, Trash2 } from "lucide-react";
import { removeTeam } from "./action";
import toast from "react-hot-toast";
import EditTeamDialog from "./edit-team-dialog";

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
      onTeamDeleted(); // Call the callback to refresh the list
    } else {
      toast.error(result.message);
    }

    setShowDeleteConfirm(false);
  };

  const handleTeamUpdated = (updatedTeam: Team) => {
    setTeams(teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
    onTeamDeleted(); // Call the callback to refresh the list
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-4">
              This will permanently delete {selectedTeam?.name} from the team
              list.
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

      {/* Edit Team Dialog */}
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
