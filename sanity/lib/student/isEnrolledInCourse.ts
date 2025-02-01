import groq from "groq";
import { client } from "../client";

export async function isEnrolledInCourse(clerkId: string, courseId: string) {
  try {
    // First get the student document using clerkId
    const studentQuery = groq`*[_type == "student" && clerkId == $clerkId][0]._id`;
    const studentId = await client.fetch(studentQuery, { clerkId });

    if (!studentId) {
      console.log("No student found with clerkId:", clerkId);
      return false;
    }

    // Then check for enrollment using the student's Sanity document ID
    const enrollmentQuery = groq`*[_type == "enrollment" && student._ref == $studentId && course._ref == $courseId][0]`;
    const enrollment = await client.fetch(enrollmentQuery, {
      studentId,
      courseId,
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return false;
  }
}
