import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { defineQuery } from "groq";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

type Lesson = {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
};

type Module = {
  _id: string;
  title: string;
  lessons?: Lesson[];
};

type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: SanityImageSource;
  category?: {
    _id: string;
    name: string;
  };
  instructor?: {
    _id: string;
    name: string;
    bio?: string;
    photo: SanityImageSource;
  };
  modules?: Module[];
};

async function getCourse(slug: string) {
  const getCourseQuery =
    defineQuery(`*[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    description,
    price,
    image,
    "category": category->{
      name,
      _id
    },
    "instructor": instructor->{
      _id,
      name,
      bio,
      photo
    },
    "modules": modules[]->{
      _id,
      title,
      "lessons": lessons[]->{
        _id,
        title,
        content,
        videoUrl
      }
    }
  }`);

  const course = await sanityFetch({
    query: getCourseQuery,
    params: { slug },
  });

  return course.data as Course;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourse(params.slug);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        {course.image && (
          <Image
            src={urlFor(course.image).url() || ""}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/"
            className="text-white mb-8 flex items-center hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {course.category?.name || "Uncategorized"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {course.description}
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 md:min-w-[300px]">
              <div className="text-3xl font-bold mb-4">${course.price}</div>
              <button className="w-full bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium hover:bg-primary/90 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules?.map((module, index) => (
                  <div
                    key={module._id}
                    className="border border-border rounded-lg"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium">
                        Module {index + 1}: {module.title}
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {module.lessons?.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex items-center gap-3 text-muted-foreground"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-card rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Instructor</h2>
              {course.instructor && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {course.instructor.photo && (
                      <div className="relative h-12 w-12">
                        <Image
                          src={urlFor(course.instructor.photo).url() || ""}
                          alt={course.instructor.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {course.instructor.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Instructor
                      </div>
                    </div>
                  </div>
                  {course.instructor.bio && (
                    <p className="text-muted-foreground">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
