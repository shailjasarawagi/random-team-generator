export type Player = {
  id: string;
  name: string;
  skill: number;
};

export type Team = {
  id: string;
  name: string;
};

export type GeneratedSession = {
  id: string;
  title: string;
  date: string;
  publicId: string;
  teamAssignments: {
    teamId: string;
    teamName: string;
    players: Player[];
    averageSkill: number;
  }[];
};

let players: Player[] = [];
let teams: Team[] = [];
let generatedSessions: GeneratedSession[] = [];

const initializeFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedSessions = localStorage.getItem("generatedSessions")
    if (storedSessions) {
      try {
        generatedSessions = JSON.parse(storedSessions)
      } catch (e) {
        console.error("Failed to parse stored sessions:", e)
      }
    }
  }
}


const saveSessionsToStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("generatedSessions", JSON.stringify(generatedSessions))
  }
}

// Initialize from storage
initializeFromStorage()
// Player CRUD operations
export async function getPlayers(): Promise<Player[]> {
  return [...players];
}

export async function getPlayer(id: string): Promise<Player | undefined> {
  return players.find((player) => player.id === id);
}

export async function createPlayer(
  name: string,
  skill: number
): Promise<Player> {
  const newPlayer = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    skill,
  };
  players.push(newPlayer);
  return newPlayer;
}

export async function updatePlayer(
  id: string,
  name: string,
  skill: number
): Promise<Player | null> {
  const index = players.findIndex((player) => player.id === id);
  if (index === -1) return null;

  const updatedPlayer = {
    ...players[index],
    name,
    skill,
  };

  players[index] = updatedPlayer;
  return updatedPlayer;
}

export async function deletePlayer(id: string): Promise<boolean> {
  const initialLength = players.length;
  players = players.filter((player) => player.id !== id);
  return initialLength !== players.length;
}

// Team CRUD operations
export async function getTeams(): Promise<Team[]> {
  return [...teams];
}

export async function getTeam(id: string): Promise<Team | undefined> {
  return teams.find((team) => team.id === id);
}

export async function createTeam(name: string): Promise<Team | string> {
  const newTeam = {
    id: Math.random().toString(36).substring(2, 9),
    name,
  };
  const teamNames = await getTeams();
  const hasDuplicate = teamNames.some((team, index) => team?.name === name);

  if (hasDuplicate) {
    return "Duplicate generated teams found. Please use unique names for each team.";
  }
  teams.push(newTeam);
  return newTeam;
}

export async function updateTeam(
  id: string,
  name: string
): Promise<Team | null | string> {
  const index = teams.findIndex((team) => team.id === id);
  if (index === -1) return null;

  const teamNames = await getTeams();
  const hasDuplicate = teamNames.some(
    (team, i) => team?.name === name && i !== index
  );

  if (hasDuplicate) {
    return "Duplicate generated teams found. Please use unique names for each team.";
  }

  const updatedTeam = {
    ...teams[index],
    name,
  };

  teams[index] = updatedTeam;
  return updatedTeam;
}

export async function deleteTeam(id: string): Promise<boolean> {
  const initialLength = teams.length;
  teams = teams.filter((team) => team.id !== id);
  return initialLength !== teams.length;
}

// Team generation
export async function generateTeams(
  title: string
): Promise<GeneratedSession | null | string> {
  if (teams.length === 0) return null;

  const teamNames = await getGeneratedSessions();
  const hasDuplicate = teamNames.some((name, index) => name?.title === title);

  if (hasDuplicate) {
    return "Duplicate generated teams found. Please use unique names for each team.";
  }
 
  const sortedPlayers = [...players].sort((a, b) => b.skill - a.skill);

 
  const teamAssignments = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    players: [] as Player[],
    averageSkill: 0,
  }));


  let direction = 1;
  let currentTeamIndex = 0;

  for (const player of sortedPlayers) {
    teamAssignments[currentTeamIndex].players.push(player);

    currentTeamIndex += direction;

    if (currentTeamIndex >= teamAssignments.length) {
      currentTeamIndex = teamAssignments.length - 2;
      direction = -1;
    } else if (currentTeamIndex < 0) {
      currentTeamIndex = 1;
      direction = 1;
    }
  }

  for (const team of teamAssignments) {
    if (team.players.length > 0) {
      const totalSkill = team.players.reduce(
        (sum, player) => sum + player.skill,
        0
      );
      team.averageSkill = Number.parseFloat(
        (totalSkill / team.players.length).toFixed(2)
      );
    }
  }


  const publicId = Math.random().toString(36).substring(2, 12);
  const newSession: GeneratedSession = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    date: new Date().toISOString(),
    publicId,
    teamAssignments,
  };
 
  generatedSessions.push(newSession);
  saveSessionsToStorage()
  return newSession;
}

// Get generated session by public ID
export async function getSessionByPublicId(
  publicId: string
): Promise<GeneratedSession | undefined> {
  initializeFromStorage()
  return generatedSessions.find((session) => session.publicId === publicId);
}

// Get all generated sessions
export async function getGeneratedSessions(): Promise<GeneratedSession[]> {
  initializeFromStorage()
  return [...generatedSessions];
}

// Initialize with some sample data
export async function initializeDb() {
  if (players.length === 0 && teams.length === 0) {
    // Sample players
    players = [
      { id: "1", name: "Player 1", skill: 5 },
      { id: "2", name: "Player 2", skill: 1 },
      { id: "3", name: "Player 3", skill: 3 },
      { id: "4", name: "Player 4", skill: 4 },
      { id: "5", name: "Player 5", skill: 2 },
      { id: "6", name: "Player 6", skill: 4 },
      { id: "7", name: "Player 7", skill: 3 },
      { id: "8", name: "Player 8", skill: 5 },
    ];

    // Sample teams
    teams = [
      { id: "1", name: "Red Team" },
      { id: "2", name: "Blue Team" },
    ];
  }
}

// Initialize the database
initializeDb();
