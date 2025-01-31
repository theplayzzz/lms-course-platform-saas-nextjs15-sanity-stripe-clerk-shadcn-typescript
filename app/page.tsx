import DarkModeToggle from "@/components/DarkModeToggle";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "groq";
import Link from "next/link";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Available Courses</h1>
        <DarkModeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            href={`/courses/${course.slug}`}
            key={course._id}
            className="group hover:no-underline"
          >
            <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-xl">
              <div className="relative h-48 w-full">
                <Image
                  src={urlFor(course.image).url() || ""}
                  alt={course.title || "Course Image"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium px-2 py-1 bg-primary/10 rounded-full">
                    {course.category?.name || "Uncategorized"}
                  </span>
                  <span className="font-bold text-lg">${course.price}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                {course.instructor && (
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
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
