"use client";

import { cn } from "@/lib/utils";

interface CourseProgressProps {
  progress: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
  showPercentage?: boolean;
  label?: string;
}

export function CourseProgress({
  progress,
  variant = "default",
  size = "default",
  showPercentage = true,
  label = "Course Progress",
}: CourseProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        {label && <span>{label}</span>}
        {showPercentage && <span>{Math.round(progress)}%</span>}
      </div>
      <div
        className={cn(
          "w-full bg-secondary rounded-full overflow-hidden",
          size === "sm" ? "h-1" : "h-2"
        )}
      >
        <div
          className={cn(
            "h-full transition-all",
            variant === "default" ? "bg-primary" : "bg-green-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
