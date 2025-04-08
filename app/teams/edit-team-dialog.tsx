"use client";

import type React from "react";

import { useState } from "react";
import type { Team } from "@/lib/db";
import { editTeam } from "./action";
import toast from "react-hot-toast";

interface EditTeamDialogProps {
  team: Team;
  onClose: () => void;
  onTeamUpdated: (team: Team) => void;
}

export default function EditTeamDialog({
  team,
  onClose,
  onTeamUpdated,
}: EditTeamDialogProps) {
  const [name, setName] = useState(team.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);

    const result = await editTeam(team.id, formData);

    setIsSubmitting(false);

    if (result.success) {
      const updatedTeam = {
        ...team,
        name,
      };
      onTeamUpdated(updatedTeam);
      onClose();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Team</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
