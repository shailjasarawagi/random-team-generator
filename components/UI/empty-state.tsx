import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  message,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-8 px-4">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
