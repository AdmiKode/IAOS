"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "kpi" | "row" | "circle" | "block";
  lines?: number;
}

export function Skeleton({ className, variant = "block", lines = 3 }: SkeletonProps) {
  const base =
    "animate-pulse rounded-xl bg-gradient-to-r from-[#E2E6EF] via-[#EFF2F9] to-[#E2E6EF] bg-[length:400%_100%]";

  if (variant === "text") {
    return (
      <div className={clsx("flex flex-col gap-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(base, "h-4 rounded-lg")}
            style={{ width: i === lines - 1 ? "65%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  if (variant === "kpi") {
    return (
      <div
        className={clsx(
          "neu-md rounded-2xl p-5 flex flex-col gap-3",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className={clsx(base, "h-4 w-24 rounded-lg")} />
          <div className={clsx(base, "h-8 w-8 rounded-full")} />
        </div>
        <div className={clsx(base, "h-8 w-32 rounded-lg")} />
        <div className={clsx(base, "h-3 w-20 rounded-lg")} />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={clsx("neu-md rounded-2xl p-5 flex flex-col gap-4", className)}>
        <div className="flex items-center gap-3">
          <div className={clsx(base, "h-10 w-10 rounded-full")} />
          <div className="flex flex-col gap-2 flex-1">
            <div className={clsx(base, "h-4 w-32 rounded-lg")} />
            <div className={clsx(base, "h-3 w-24 rounded-lg")} />
          </div>
        </div>
        <div className={clsx(base, "h-3 w-full rounded-lg")} />
        <div className={clsx(base, "h-3 w-4/5 rounded-lg")} />
        <div className={clsx(base, "h-3 w-3/5 rounded-lg")} />
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={clsx("flex items-center gap-4 py-3", className)}>
        <div className={clsx(base, "h-10 w-10 rounded-full shrink-0")} />
        <div className="flex-1 flex flex-col gap-2">
          <div className={clsx(base, "h-4 w-40 rounded-lg")} />
          <div className={clsx(base, "h-3 w-28 rounded-lg")} />
        </div>
        <div className={clsx(base, "h-6 w-16 rounded-lg")} />
      </div>
    );
  }

  if (variant === "circle") {
    return <div className={clsx(base, "rounded-full", className)} />;
  }

  return <div className={clsx(base, className)} />;
}
