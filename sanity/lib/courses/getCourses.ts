import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getCourses() {
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
