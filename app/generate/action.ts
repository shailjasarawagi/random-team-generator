// "use server"

import { generateTeams, getGeneratedSessions } from "@/lib/db";

export async function createTeamGeneration(title: string) {
  if (!title || title.trim() === "") {
    return { success: false, message: "Title is required" };
  }

  try {
    const result = await generateTeams(title);

    if (!result) {
      return {
        success: false,
        message:
          "Failed to generate teams. Make sure you have teams and players added.",
      };
    }
    if (typeof result === "string") {
      return {
        success: false,
        message:
          "Duplicate Team Generation found. Please use unique names for each.",
      };
    }

    return {
      success: true,
      message: "Teams generated successfully",
      data: result,
    };
  } catch (error) {
    return { success: false, message: "Failed to generate teams" };
  }
}

export async function getAllGeneratedSessions() {
  try {
    const sessions = await getGeneratedSessions();
    return { success: true, data: sessions };
  } catch (error) {
    return { success: false, message: "Failed to fetch generated sessions" };
  }
}
