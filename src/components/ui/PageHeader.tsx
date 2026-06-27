import React from "react";

interface PageHeaderProps {
  title: string;
  /** Teks deskripsi singkat */
  desc?: string;
  /** Alias untuk desc */
  description?: string;
  /** Menerima ReactNode (JSX element icon) atau ComponentType */
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  desc,
  description,
  icon,
  actions,
}: PageHeaderProps) {
  const descText = desc ?? description;

  const iconContent =
    icon == null
      ? null
      : React.isValidElement(icon)
      ? icon
      : typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)
      ? React.createElement(icon as React.ComponentType<any>, {
          className: "h-6 w-6",
        })
      : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        {iconContent && (
          <div className="bg-teal-50 text-brand-teal p-3.5 rounded-xl border border-teal-100 shrink-0">
            {iconContent}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h1>
          {descText && (
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">{descText}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}
