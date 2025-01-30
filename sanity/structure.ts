import { StructureBuilder } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Course Content
      S.listItem()
        .title("Course Content")
        .child(S.documentTypeList("course").title("Courses")),

      S.divider(),

      // Users
      S.listItem()
        .title("Users")
        .child(
          S.list()
            .title("Users")
            .items([
              S.documentTypeListItem("instructor").title("Instructors"),
              S.documentTypeListItem("student").title("Students"),
            ])
        ),

      S.divider(),

      // Course Management
      S.listItem()
        .title("Course Management")
        .child(
          S.list()
            .title("Course Management")
            .items([
              S.documentTypeListItem("enrollment").title("Enrollments"),
              S.documentTypeListItem("category").title("Categories"),
            ])
        ),
    ]);
