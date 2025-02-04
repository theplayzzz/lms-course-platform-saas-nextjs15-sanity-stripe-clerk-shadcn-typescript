"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";
import { revalidatePath } from "next/cache";

export async function completeLessonAction(
  lessonId: string,
  clerkId: string,
  courseId: string
) {
  try {
    await completeLessonById({
      lessonId,
      clerkId,
    });

    // Revalidate the specific course and lesson URLs
    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}`);

    // Also revalidate the my-courses page since progress has changed
    revalidatePath("/my-courses");

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
