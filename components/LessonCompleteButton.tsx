"use client";

import { Check, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeLessonAction } from "@/app/actions/completeLessonAction";

interface LessonCompleteButtonProps {
  lessonId: string;
  clerkId: string;
  courseId: string;
  isCompleted?: boolean;
}

export function LessonCompleteButton({
  lessonId,
  clerkId,
  courseId,
  isCompleted = false,
}: LessonCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    try {
      setIsPending(true);
      await completeLessonAction(lessonId, clerkId, courseId);

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
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Marking as complete...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Lesson as Complete
        </>
      )}
    </Button>
  );
}
