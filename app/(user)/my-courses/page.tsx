import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEnrolledCourses } from "@/sanity/lib/student/getEnrolledCourses";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/");
  }

  const enrolledCourses = await getEnrolledCourses(user.id);

  return (
    <div className="h-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Courses</h1>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t enrolled in any courses yet. Browse our courses
              to get started!
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(({ course, _id }) => {
              if (!course) return null;

              return (
                <Link
                  href={`/dashboard/courses/${course._id}`}
                  key={_id}
                  className="group hover:no-underline flex"
                >
                  <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1">
                    <div className="relative h-52 w-full overflow-hidden">
                      {course.image ? (
                        <Image
                          src={urlFor(course.image).url() || ""}
                          alt={course.title || "Course Image"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <Loader size="lg" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
                          {course.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {course.description}
                      </p>
                      <div className="space-y-4 mt-auto">
                        {course.instructor && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {course.instructor.photo ? (
                                <div className="relative h-8 w-8 mr-2">
                                  <Image
                                    src={
                                      urlFor(course.instructor.photo).url() ||
                                      ""
                                    }
                                    alt={course.instructor.name || "Instructor"}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-8 w-8 mr-2 rounded-full bg-muted flex items-center justify-center">
                                  <Loader size="sm" />
                                </div>
                              )}
                              <span className="text-sm text-muted-foreground">
                                by {course.instructor.name}
                              </span>
                            </div>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Course Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${course.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
