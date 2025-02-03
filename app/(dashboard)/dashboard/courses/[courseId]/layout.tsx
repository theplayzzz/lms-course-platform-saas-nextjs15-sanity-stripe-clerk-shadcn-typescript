import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { getModuleProgress } from "@/sanity/lib/lessons/getModuleProgress";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const user = await currentUser();
  const { courseId } = await params;

  if (!user?.id) {
    return redirect("/");
  }

  const isEnrolled = await isEnrolledInCourse(user.id, courseId);

  if (!isEnrolled) {
    return redirect(`/courses/${courseId}`);
  }

  const [course, student, progress] = await Promise.all([
    getCourseById(courseId),
    getStudentByClerkId(user.id),
    getModuleProgress(user.id, courseId),
  ]);

  if (!course || !student) {
    return redirect("/my-courses");
  }

  return (
    <div className="h-full">
      <Sidebar
        course={course}
        completedLessons={progress.completedLessons}
        moduleProgress={progress.moduleProgress}
      />
      <main className="h-full pt-[64px] lg:pl-96">{children}</main>
    </div>
  );
}
