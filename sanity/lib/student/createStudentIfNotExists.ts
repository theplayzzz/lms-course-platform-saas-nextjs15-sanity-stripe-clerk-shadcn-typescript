import groq from "groq";
import { client } from "../adminClient";

interface CreateStudentProps {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export async function createStudentIfNotExists({
  clerkId,
  email,
  firstName,
  lastName,
  imageUrl,
}: CreateStudentProps) {
  // First check if student exists
  const existingStudent = await client.fetch(
    groq`*[_type == "student" && clerkId == $clerkId][0]`,
    { clerkId }
  );

  if (existingStudent) {
    console.log("Student already exists");
    return existingStudent;
  }

  // If no student exists, create a new one
  const newStudent = await client.create({
    _type: "student",
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
  });

  return newStudent;
}
