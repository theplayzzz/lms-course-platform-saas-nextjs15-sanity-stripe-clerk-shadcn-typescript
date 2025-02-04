"use server";

import { client } from "@/sanity/lib/adminClient";
import groq from "groq";
import { revalidatePath } from "next/cache";

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string,
  courseId: string
) {
  try {
    // Get Sanity student ID from Clerk ID
    const student = await client.fetch(
      groq`*[_type == "student" && clerkId == $clerkId][0]._id`,
      { clerkId }
    );

    if (!student) {
      throw new Error("Student not found");
    }

    // Find and delete the lesson completion record
    await client.delete({
      query: `*[_type == "lessonCompletion" && student._ref == $studentId && lesson._ref == $lessonId][0]`,
      params: { studentId: student, lessonId },
    });

    // Revalidate the specific course and lesson URLs
    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/dashboard/courses/${courseId}/lessons/${lessonId}`);
    revalidatePath("/my-courses");

    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
