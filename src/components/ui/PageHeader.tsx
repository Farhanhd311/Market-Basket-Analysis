import React from "react";

interface PageHeaderProps {
  title: string;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  desc,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="bg-teal-50 text-brand-teal p-3.5 rounded-xl border border-teal-100 shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h1>
          {desc && <p className="mt-1 text-sm text-gray-500 leading-relaxed">{desc}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">{actions}</div>}
    </div>
  );
}
