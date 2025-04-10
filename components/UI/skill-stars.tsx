import { Star } from "lucide-react";

interface SkillStarsProps {
  skill: number;
  maxSkill?: number;
  size?: "sm" | "md" | "lg";
}

export default function SkillStars({
  skill,
  maxSkill = 5,
  size = "md",
}: SkillStarsProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  return (
    <div className="flex">
      {Array(maxSkill)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < skill ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
    </div>
  );
}
