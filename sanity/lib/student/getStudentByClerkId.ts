import { defineQuery } from "groq";
import { client } from "../adminClient";

export async function getStudentByClerkId(clerkId: string) {
  const getStudentByClerkIdQuery = defineQuery(
    `*[_type == "student" && clerkId == $clerkId][0]`
  );

  const student = await client.fetch(getStudentByClerkIdQuery, { clerkId });

  return student;
}
