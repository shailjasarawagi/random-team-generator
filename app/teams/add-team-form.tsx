"use client";

import type React from "react";

import { useState } from "react";
import { addTeam } from "./action";
import toast from "react-hot-toast";

// Add onTeamAdded prop to the component
interface AddTeamFormProps {
  onTeamAdded: () => void;
}

export default function AddTeamForm({ onTeamAdded }: AddTeamFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);

    const result = await addTeam(formData);

    setIsSubmitting(false);

    if (result.success) {
      setName("");
      toast.success(result.message);
      onTeamAdded(); // Call the callback to refresh the list
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Team Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter team name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Team"}
        </button>
      </form>
    </div>
  );
}
