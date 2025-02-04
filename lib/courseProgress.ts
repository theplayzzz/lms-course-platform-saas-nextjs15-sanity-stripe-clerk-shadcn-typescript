import { GetCompletionsQueryResult, Module } from "@/sanity.types";

export function calculateTotalLessons(modules: Module[] | null): number {
  if (!modules) return 0;
  return modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );
}

export function calculateModuleProgress(
  module: Module,
  completedLessons: GetCompletionsQueryResult["completedLessons"]
) {
  const totalLessons = module.lessons?.length || 0;
  const completedInModule = completedLessons.filter(
    (completion) => completion.module?._id === module._id
  ).length;

  return {
    moduleId: module._id,
    title: module.title || "",
    progress: Math.round(
      totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0
    ),
    completedLessons: completedInModule,
    totalLessons,
  };
}

export function calculateCourseProgress(
  modules: Module[] | null,
  completedLessons: GetCompletionsQueryResult["completedLessons"]
): number {
  const totalLessons = calculateTotalLessons(modules);
  const totalCompleted = completedLessons.length;

  return Math.round(
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0
  );
}
