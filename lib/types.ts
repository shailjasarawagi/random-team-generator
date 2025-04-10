export interface Player {
  id: string;
  name: string;
  skill: number;
}

export interface Team {
  id: string;
  name: string;
}

export interface TeamAssignment {
  teamId: string;
  teamName: string;
  players: Player[];
  averageSkill: number;
}

export interface GeneratedSession {
  id: string;
  title: string;
  date: string;
  publicId: string;
  teamAssignments: TeamAssignment[];
}

export interface PlayerFormData {
  name: string;
  skill: number;
}
