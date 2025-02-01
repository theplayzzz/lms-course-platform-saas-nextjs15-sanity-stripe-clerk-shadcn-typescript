import { sanityFetch } from "../live";
import { defineQuery } from "groq";

async function getCourseById(id: string) {
  const getCourseByIdQuery =
    defineQuery(`*[_type == "course" && _id == $id][0] {
      _id,
      title,
      slug,
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
    query: getCourseByIdQuery,
    params: { id },
  });

  return course.data;
}

export default getCourseById;
