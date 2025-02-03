import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";

export async function getModuleProgress(clerkId: string, courseId: string) {
  // First get the student's Sanity ID
  const student = await getStudentByClerkId(clerkId);

  if (!student?._id) {
    throw new Error("Student not found");
  }

  const progressQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      _id,
      completedAt,
      "lesson": lesson->{
        _id,
        title
      },
      "module": module->{
        _id,
        title
      }
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      _id,
      title,
      "modules": modules[]-> {
        _id,
        title,
        "lessons": lessons[]-> {
          _id,
          title
        }
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
    course?.modules?.map((module) => {
      const totalLessons = module.lessons?.length || 0;
      const completedInModule = completedLessons.filter(
        (completion) => completion.module?._id === module._id
      ).length;

      return {
        moduleId: module._id,
        title: module.title || "",
        progress: Math.round(
          totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0
        ),
        completedLessons: completedInModule,
        totalLessons,
      };
    }) || [];

  // Calculate overall course progress
  const totalLessons =
    course?.modules?.reduce(
      (acc: number, module) => acc + (module.lessons?.length || 0),
      0
    ) || 0;

  const totalCompleted = completedLessons.length;
  const courseProgress = Math.round(
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0
  );

  return {
    completedLessons,
    moduleProgress,
    courseProgress,
  };
}
