import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  desc,
  icon: Icon = FolderOpen,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[350px]">
      <div className="bg-teal-50/60 text-brand-teal p-4 rounded-full mb-4">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="font-extrabold text-lg text-gray-800 tracking-tight">{title}</h3>
      {desc && <p className="text-sm text-gray-500 mt-1.5 mb-6 max-w-sm leading-relaxed">{desc}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
