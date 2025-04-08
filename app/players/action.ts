import { createPlayer, updatePlayer, deletePlayer } from "@/lib/db";

export async function addPlayer(formData: FormData) {
  const name = formData.get("name") as string;
  const skillStr = formData.get("skill") as string;
  const skill = Number.parseInt(skillStr, 10);

  if (!name || name.trim() === "") {
    return { success: false, message: "Name is required" };
  }

  if (isNaN(skill) || skill < 1 || skill > 5) {
    return { success: false, message: "Skill must be between 1 and 5" };
  }

  try {
    await createPlayer(name, skill);
    return { success: true, message: "Player added successfully" };
  } catch (error) {
    return { success: false, message: "Failed to add player" };
  }
}

export async function editPlayer(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const skillStr = formData.get("skill") as string;
  const skill = Number.parseInt(skillStr, 10);

  if (!name || name.trim() === "") {
    return { success: false, message: "Name is required" };
  }

  if (isNaN(skill) || skill < 1 || skill > 5) {
    return { success: false, message: "Skill must be between 1 and 5" };
  }

  try {
    const result = await updatePlayer(id, name, skill);
    if (!result) {
      return { success: false, message: "Player not found" };
    }

    return { success: true, message: "Player updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update player" };
  }
}

export async function removePlayer(id: string) {
  try {
    const success = await deletePlayer(id);
    if (!success) {
      return { success: false, message: "Player not found" };
    }

    return { success: true, message: "Player deleted successfully" };
  } catch (error) {
    return { success: false, message: "Failed to delete player" };
  }
}
