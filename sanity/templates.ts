export const moduleTemplate = {
  id: "module-with-course",
  title: "Module for Course",
  schemaType: "module",
  parameters: [{ name: "courseId", type: "string" }],
  value: (params: { courseId: string }) => ({
    course: { _type: "reference", _ref: params.courseId },
  }),
};

export const lessonTemplate = {
  id: "lesson-with-module",
  title: "Lesson for Module",
  schemaType: "lesson",
  parameters: [{ name: "moduleId", type: "string" }],
  value: (params: { moduleId: string }) => ({
    module: { _type: "reference", _ref: params.moduleId },
  }),
};
