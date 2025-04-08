

import { createTeam, updateTeam, deleteTeam } from "@/lib/db"


export async function addTeam(formData: FormData) {
  const name = formData.get("name") as string

  if (!name || name.trim() === "") {
    return { success: false, message: "Team name is required" }
  }
  try {
    const result=await createTeam(name)
    if (typeof result === 'string') {
      return { success: false, message: "Duplicate Team Generation found. Please use unique names for each." }
     }
    return { success: true, message: "Team added successfully" }
  } catch (error) {
    return { success: false, message: "Failed to add team" }
  }
}

export async function editTeam(id: string, formData: FormData) {
  const name = formData.get("name") as string

  if (!name || name.trim() === "") {
    return { success: false, message: "Team name is required" }
  }

  try {
    const result = await updateTeam(id, name)
    if (!result) {
      return { success: false, message: "Team not found" }
    }
    if (typeof result === 'string') {
      return { success: false, message: "Duplicate Team Generation found. Please use unique names for each." }
     }
    return { success: true, message: "Team updated successfully" }
  } catch (error) {
    return { success: false, message: "Failed to update team" }
  }
}

export async function removeTeam(id: string) {
  try {
    const success = await deleteTeam(id)
    if (!success) {
      return { success: false, message: "Team not found" }
    }

    return { success: true, message: "Team deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete team" }
  }
}

