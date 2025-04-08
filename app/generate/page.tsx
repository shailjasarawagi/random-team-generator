"use client"

import { getTeams, getPlayers } from "@/lib/db"
import TeamGenerator from "./team-generators"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default  function GeneratePage() {

  const [teams,setTeams]= useState([])
  const [players,setPlayers]= useState([])

useEffect(()=>{
    const fetchSessions = async () => {
    const result = await getTeams()  as any
    const results = await getPlayers() as any
    setTeams(result)
    setPlayers(results)
   
  }

  fetchSessions()
},[])


  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Generate Teams</h1>

      <TeamGenerator initialTeams={teams} initialPlayers={players} />
    </div>
  )
}

