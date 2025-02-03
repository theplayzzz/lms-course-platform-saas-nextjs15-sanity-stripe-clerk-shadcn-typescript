"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeLessonAction } from "@/app/actions/completeLessonAction";

interface LessonCompleteButtonProps {
  lessonId: string;
  studentId: string;
  isCompleted?: boolean;
}

export function LessonCompleteButton({
  lessonId,
  studentId,
  isCompleted = false,
}: LessonCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    try {
      setIsPending(true);
      await completeLessonAction(lessonId, studentId);

      router.refresh();
    } catch (error) {
      console.error("Error completing lesson:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handleComplete}
      disabled={isPending || isCompleted}
      variant={isCompleted ? "default" : "outline"}
      className="w-full"
    >
      {isCompleted ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Completed
        </>
      ) : isPending ? (
        "Marking as complete..."
      ) : (
        "Mark as Complete"
      )}
    </Button>
  );
}
