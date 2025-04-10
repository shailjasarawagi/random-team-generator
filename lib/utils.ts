
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(dateString).toLocaleDateString("en-US", defaultOptions);
}

export function calculateBalanceScore(
  teamAssignments: { averageSkill: number }[]
): number {
  if (teamAssignments.length <= 1) return 0;

  const skills = teamAssignments.map((t) => t.averageSkill);
  const avg = skills.reduce((sum, skill) => sum + skill, 0) / skills.length;

  const squaredDiffs = skills.map((skill) => Math.pow(skill - avg, 2));
  const variance =
    squaredDiffs.reduce((sum, diff) => sum + diff, 0) / skills.length;

  return Math.sqrt(variance);
}
