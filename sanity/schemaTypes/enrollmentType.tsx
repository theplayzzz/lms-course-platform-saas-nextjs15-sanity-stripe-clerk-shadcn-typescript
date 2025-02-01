import Image from "next/image";
import { defineField, defineType } from "sanity";

export const enrollmentType = defineType({
  name: "enrollment",
  title: "Enrollment",
  type: "document",
  fields: [
    defineField({
      name: "student",
      title: "Student",
      type: "reference",
      to: [{ type: "student" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "enrolledAt",
      title: "Enrolled At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "completedAt",
      title: "Completed At",
      type: "datetime",
    }),
    defineField({
      name: "progress",
      title: "Course Progress",
      type: "number",
      validation: (rule) => rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "lastAccessedAt",
      title: "Last Accessed At",
      type: "datetime",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Dropped", value: "dropped" },
        ],
      },
      initialValue: "active",
    }),
  ],
  preview: {
    select: {
      courseTitle: "course.title",
      studentFirstName: "student.firstName",
      studentLastName: "student.lastName",
      studentImage: "student.imageUrl",
    },
    prepare({ courseTitle, studentFirstName, studentLastName, studentImage }) {
      return {
        title: courseTitle,
        subtitle: `${studentFirstName} ${studentLastName}`,
        media: (
          <Image
            src={studentImage}
            alt={`${studentFirstName} ${studentLastName}`}
            width={100}
            height={100}
          />
        ),
      };
    },
  },
});
