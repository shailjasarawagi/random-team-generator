"use client";

import type React from "react";

import { useState } from "react";
import { type Player, type Team, type GeneratedSession } from "@/lib/types";
import { createTeamGeneration } from "./action";
import toast from "react-hot-toast";
import GeneratedTeamDisplay from "./generated-team-display";
import PreviousGenerations from "./previous-generators";
import EmptyState from "@/components/UI/empty-state";
import { Users, ListPlus } from "lucide-react";

interface TeamGeneratorProps {
  initialTeams: Team[];
  initialPlayers: Player[];
}

export default function TeamGenerator({
  initialTeams,
  initialPlayers,
}: TeamGeneratorProps) {
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSession, setGeneratedSession] =
    useState<GeneratedSession | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (initialTeams.length < 2) {
      toast.error("You need at least 2 teams before generating");
      return;
    }

    if (initialPlayers.length < 2) {
      toast.error("You need at least 2 players before generating");
      return;
    }

    setIsGenerating(true);
    const result = (await createTeamGeneration(title)) as any;
    setIsGenerating(false);

    if (result.success) {
      setGeneratedSession(result.data);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "generate"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("generate")}
          >
            Generate Teams
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "history"
                ? "bg-blue-50 border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Previous Generations
          </button>
        </div>

        {activeTab === "generate" ? (
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Team Generator</h2>
              <p className="text-gray-500 mb-4">
                Generate balanced teams based on player skill levels
              </p>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Generation Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Friday Futsal"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Available Teams</h3>
                    {initialTeams.length === 0 ? (
                      <EmptyState
                        title="No Teams"
                        message="Add teams first"
                        icon={<ListPlus className="h-8 w-8 text-gray-400" />}
                      />
                    ) : (
                      <ul className="space-y-1">
                        {initialTeams.map((team) => (
                          <li key={team.id} className="text-sm">
                            {team.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Available Players</h3>
                    {initialPlayers.length === 0 ? (
                      <EmptyState
                        title="No Players"
                        message="Add players first"
                        icon={<Users className="h-8 w-8 text-gray-400" />}
                      />
                    ) : (
                      <p className="text-sm">
                        {initialPlayers.length} players available
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                  disabled={
                    isGenerating ||
                    initialPlayers?.length == 0 ||
                    initialTeams?.length == 0
                  }
                >
                  {isGenerating ? "Generating..." : "Generate Teams"}
                </button>
              </form>
            </div>

            {generatedSession && (
              <GeneratedTeamDisplay session={generatedSession} />
            )}
          </div>
        ) : (
          <div className="p-6">
            <PreviousGenerations />
          </div>
        )}
      </div>
    </div>
  );
}
