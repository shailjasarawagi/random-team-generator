
"use client"
import { getSessionByPublicId } from "@/lib/db"
import { notFound } from "next/navigation"
import { Star } from "lucide-react"
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ id: string }>
};

export default  function SharedTeamPage({ params }: Props) {
const [session,setSessions]= useState({} as any)
const { id } = use(params); 
  useEffect(()=>{
    const fetchPlayers = async () => {
     
      const sessions = await getSessionByPublicId(id)
       setSessions(sessions)
    }

    fetchPlayers()
  },[])

  if (!session) {
    notFound()
  }
  // Format date
  const formattedDate = new Date(session.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Render stars for skill level
  const renderSkillStars = (skill: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < skill ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
      ))
  }

  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-sm text-gray-500">Generated on {formattedDate}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session?.teamAssignments?.map((team:any) => (
              <div key={team.teamId} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{team.teamName}</h3>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">Avg: {team.averageSkill}</span>
                  </div>
                </div>

                <div className="p-4">
                  <ul className="space-y-2">
                    {team?.players?.map((player:any) => (
                      <li
                        key={player.id}
                        className="flex items-center justify-between text-sm p-2 border-b last:border-0"
                      >
                        <span>{player.name}</span>
                        <div className="flex">{renderSkillStars(player.skill)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-500">Teams are balanced based on player skill levels for fair competition.</p>
        </div>
      </div>
    </div>
  )
}

