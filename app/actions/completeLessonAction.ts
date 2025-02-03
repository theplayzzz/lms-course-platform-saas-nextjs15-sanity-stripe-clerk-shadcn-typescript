"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";
import { revalidatePath } from "next/cache";

export async function completeLessonAction(
  lessonId: string,
  studentId: string
) {
  try {
    await completeLessonById({
      lessonId,
      studentId,
    });

    // Revalidate the course and lesson pages
    revalidatePath("/dashboard/courses/[courseId]", "page");
    revalidatePath("/dashboard/courses/[courseId]/lessons/[lessonId]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error: "Failed to complete lesson" };
  }
}
