import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import type { Course } from "@/sanity.types";

export async function searchCourses(term: string) {
  const searchQuery = defineQuery(`*[_type == "course" && (
    title match $term + "*" ||
    description match $term + "*" ||
    category->name match $term + "*"
  )] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    price,
    "slug": slug.current,
    image,
    "category": category->{
      name,
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev
    },
    "instructor": instructor->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      photo,
      bio
    }
  }`);

  const result = await sanityFetch({
    query: searchQuery,
    params: { term },
  });

  return (result.data || []) as Course[];
}
