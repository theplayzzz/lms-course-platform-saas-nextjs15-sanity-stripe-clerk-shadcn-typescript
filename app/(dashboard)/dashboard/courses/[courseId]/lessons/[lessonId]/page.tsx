import { PortableText } from "@portabletext/react";
import { redirect } from "next/navigation";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { VideoPlayer } from "@/components/VideoPlayer";

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
    return redirect("/");
  }

  const lesson = course.modules
    ?.flatMap((module) => module.lessons)
    .find((lesson) => lesson?._id === lessonId);

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        {lesson.videoUrl && (
          <div className="aspect-video">
            <VideoPlayer url={lesson.videoUrl} />
          </div>
        )}
        <div className="prose prose-sm dark:prose-invert">
          <PortableText value={lesson.content || []} />
        </div>
      </div>
    </div>
  );
}
