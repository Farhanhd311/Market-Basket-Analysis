import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  desc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "teal" | "amber" | "gray";
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
  icon: Icon,
  variant = "teal",
  trend,
  className = "",
}: StatCardProps) {
  const iconVariants = {
    teal: "bg-teal-50 text-brand-teal border-teal-100",
    amber: "bg-amber-50 text-brand-amber border-amber-100",
    gray: "bg-gray-50 text-gray-500 border-gray-100",
  };

  return (
    <Card className={`relative overflow-hidden flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconVariants[variant]}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {value}
          </span>
        </div>
      </div>

      {(desc || trend) && (
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span className={`font-bold ${trend.positive ? "text-emerald-600" : "text-rose-600"}`}>
                {trend.value}
              </span>
              <span className="text-gray-400 font-medium">{trend.label}</span>
            </div>
          ) : (
            <span className="text-gray-400 font-medium">{desc}</span>
          )}
        </div>
      )}
    </Card>
  );
}
