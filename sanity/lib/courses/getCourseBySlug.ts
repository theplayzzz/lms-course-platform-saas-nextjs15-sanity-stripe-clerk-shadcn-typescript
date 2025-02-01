import { sanityFetch } from "../live";
import { defineQuery } from "groq";

async function getCourseBySlug(slug: string) {
  const getCourseBySlugQuery =
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
    query: getCourseBySlugQuery,
    params: { slug },
  });

  return course.data;
}

export default getCourseBySlug;
