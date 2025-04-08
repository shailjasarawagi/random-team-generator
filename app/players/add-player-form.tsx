"use client";

import type React from "react";

import { useState } from "react";
import { addPlayer } from "./action";
import toast from "react-hot-toast";

// Add onPlayerAdded prop to the component
interface AddPlayerFormProps {
  onPlayerAdded: () => void;
}

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("3");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("skill", skill);

    const result = await addPlayer(formData);

    setIsSubmitting(false);

    if (result.success) {
      setName("");
      setSkill("3");
      toast.success(result.message);
      onPlayerAdded(); // Call the callback to refresh the list
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Player Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="skill"
            className="block text-sm font-medium text-gray-700"
          >
            Skill Level (1-5)
          </label>
          <select
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1 - Beginner</option>
            <option value="2">2 - Novice</option>
            <option value="3">3 - Intermediate</option>
            <option value="4">4 - Advanced</option>
            <option value="5">5 - Expert</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Player"}
        </button>
      </form>
    </div>
  );
}
