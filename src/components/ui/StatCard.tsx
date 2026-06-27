import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  desc?: string;
  description?: string;
  /** Menerima ReactNode (JSX element) atau ComponentType */
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  variant?: "teal" | "amber" | "gray";
  /** Alias untuk variant */
  color?: "teal" | "amber" | "gray";
  trend?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  desc,
  description,
  icon,
  variant,
  color,
  trend,
  className = "",
}: StatCardProps) {
  const resolvedVariant = variant ?? color ?? "teal";
  const descText = desc ?? description;

  const iconVariants = {
    teal: "bg-teal-50 text-brand-teal border-teal-100",
    amber: "bg-amber-50 text-brand-amber border-amber-100",
    gray: "bg-gray-50 text-gray-500 border-gray-100",
  };

  const iconContent =
    icon == null
      ? null
      : React.isValidElement(icon)
      ? icon
      : typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)
      ? React.createElement(icon as React.ComponentType<any>, {
          className: "h-5 w-5",
        })
      : null;

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {iconContent && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconVariants[resolvedVariant]}`}>
              {iconContent}
            </div>
          )}
        </div>

        <div className="mt-4">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {value}
          </span>
        </div>
      </div>

      {(descText || trend) && (
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span className={`font-bold ${trend.positive ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.value}
              </span>
              <span className="text-gray-400 font-medium">{trend.label}</span>
            </div>
          ) : (
            <span className="text-gray-400 font-medium">{descText}</span>
          )}
        </div>
      )}
    </Card>
  );
}
