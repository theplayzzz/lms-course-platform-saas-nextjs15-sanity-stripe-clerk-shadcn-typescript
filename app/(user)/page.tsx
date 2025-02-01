import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "groq";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import Hero from "@/components/Hero";

async function getCourses() {
  const getCoursesQuery = defineQuery(`*[_type == "course"] {
    _id,
    title,
    description,
    price,
    "slug": slug.current,
    image,
    "category": category->{
      name
    },
    "instructor": instructor->{
      name,
      photo
    }
  }`);

  const courses = await sanityFetch({ query: getCoursesQuery });
  return courses.data;
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course) => (
            <Link
              href={`/courses/${course.slug}`}
              key={course._id}
              className="group hover:no-underline"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border">
                <div className="relative h-52 w-full overflow-hidden">
                  {course.image && (
                    <Image
                      src={urlFor(course.image).url() || ""}
                      alt={course.title || "Course Image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
                      {course.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-white font-bold px-3 py-1 bg-black/50 dark:bg-white/20 rounded-full backdrop-blur-sm">
                      $
                      {course.price?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  {course.instructor && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {course.instructor.photo && (
                          <div className="relative h-8 w-8 mr-2">
                            <Image
                              src={urlFor(course.instructor.photo).url() || ""}
                              alt={course.instructor.name || "Instructor Image"}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          by {course.instructor.name}
                        </span>
                      </div>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
