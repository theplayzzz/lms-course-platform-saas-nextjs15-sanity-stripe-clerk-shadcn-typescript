import DarkModeToggle from "@/components/DarkModeToggle";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import groq, { defineQuery } from "groq";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  image: SanityImageSource;
  category: {
    name: string;
  };
  instructor: {
    name: string;
    photo: SanityImageSource;
  };
}

async function getCourses() {
  const query = defineQuery(`*[_type == "course"] {
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

  const courses = await client.fetch(query);
  return courses;
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-8">
        <DarkModeToggle />
      </div>

      <h1 className="text-4xl font-bold mb-8">Available Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-card rounded-lg overflow-hidden shadow-lg"
          >
            {course.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={urlFor(course.image).url()}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium px-2 py-1 bg-primary/10 rounded-full">
                  {course.category.name}
                </span>
                <span className="font-bold text-lg">${course.price}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
              {course.instructor && (
                <div className="flex items-center">
                  {course.instructor.photo && (
                    <div className="relative h-8 w-8 mr-2">
                      <Image
                        src={urlFor(course.instructor.photo).url()}
                        alt={course.instructor.name}
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
        ))}
      </div>
    </div>
  );
}
