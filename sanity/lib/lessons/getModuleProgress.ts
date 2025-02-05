import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";
import {
  calculateModuleProgress,
  calculateCourseProgress,
} from "@/lib/courseProgress";
import { Module } from "@/sanity.types";

export async function getModuleProgress(clerkId: string, courseId: string) {
  // First get the student's Sanity ID
  const student = await getStudentByClerkId(clerkId);

  if (!student?._id) {
    throw new Error("Student not found");
  }

  const progressQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: progressQuery,
    params: { studentId: student._id, courseId },
  });

  const { completedLessons = [], course } = result.data;

  // Calculate module progress
  const moduleProgress =
    course?.modules?.map((module) =>
      // as unknown as Module is a type assertion to ensure the module is treated as a Module type
      calculateModuleProgress(module as unknown as Module, completedLessons)
    ) || [];

  // Calculate overall course progress
  const courseProgress = calculateCourseProgress(
    (course?.modules as unknown as Module[]) || null,
    completedLessons
  );

  return {
    completedLessons,
    moduleProgress,
    courseProgress,
  };
}
