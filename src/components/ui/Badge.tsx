import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border tracking-wide transition-colors";
  
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-brand-amber border-brand-amber/20",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-teal-50 text-brand-teal border-brand-teal/20",
    neutral: "bg-gray-50 text-gray-600 border-gray-150",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
