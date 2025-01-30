import { type SchemaTypeDefinition } from "sanity";
import { courseType } from "./courseType";
import { moduleType } from "./moduleType";
import { lessonType } from "./lessonType";
import { instructorType } from "./instructorType";
import { blockContent } from "./blockContent";
import { studentType } from "./studentType";
import { enrollmentType } from "./enrollmentType";
import { categoryType } from "./categoryType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    instructorType,
    blockContent,
    studentType,
    enrollmentType,
    categoryType,
  ],
};
