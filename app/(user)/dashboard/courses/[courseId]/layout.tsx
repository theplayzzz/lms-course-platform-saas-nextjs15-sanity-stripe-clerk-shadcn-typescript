import { Sidebar } from "@/components/dashboard/Sidebar";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { redirect } from "next/navigation";

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
  const { courseId } = await params;

  const course = await getCourseById(courseId);

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <Sidebar course={course} />
      </div>
      <main className="md:pl-80 h-full">{children}</main>
    </div>
  );
}
