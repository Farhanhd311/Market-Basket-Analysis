import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-md hover:border-gray-200 active:scale-[0.99]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
