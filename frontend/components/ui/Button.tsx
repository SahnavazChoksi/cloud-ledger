"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyles =
    "px-4 py-2 rounded-xl transition font-medium disabled:opacity-50";

  const variantStyles: Record<Variant, string> = {
    primary:
      "bg-black text-white hover:bg-gray-700 border border-black",

    secondary:
      "bg-white text-black border border-gray-300 hover:bg-gray-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700 border border-red-600",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}