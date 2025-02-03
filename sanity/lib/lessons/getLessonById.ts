import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getLessonById(id: string) {
  const getLessonByIdQuery =
    defineQuery(`*[_type == "lesson" && _id == $id][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    videoUrl,
    loomUrl,
    content,
    "module": module->{
      _id,
      title,
      "course": course->{
        _id,
        title
      }
    }
  }`);

  const result = await sanityFetch({
    query: getLessonByIdQuery,
    params: { id },
  });

  return result.data;
}
