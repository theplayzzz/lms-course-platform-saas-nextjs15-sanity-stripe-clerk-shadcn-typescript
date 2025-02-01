"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Library, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { GetCourseByIdQueryResult } from "@/sanity.types";

interface SidebarProps {
  course: GetCourseByIdQueryResult;
}

export function Sidebar({ course }: SidebarProps) {
  const pathname = usePathname();

  if (!course) {
    return null;
  }

  return (
    <div className="h-full border-r flex flex-col bg-background w-96">
      <div className="p-6 space-y-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-x-2 hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <Library className="h-4 w-4" />
            <span>Course Library</span>
          </Button>
        </Link>
        <h1 className="font-semibold text-2xl tracking-tight">
          {course.title}
        </h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" className="w-full space-y-4">
            {course.modules?.map((module, moduleIndex) => (
              <AccordionItem
                key={module._id}
                value={module._id}
                className="border-none"
              >
                <AccordionTrigger className="px-2 py-2 hover:no-underline transition-colors">
                  <div className="flex items-center gap-x-4 w-full">
                    <span className="text-sm font-medium text-muted-foreground">
                      {String(moduleIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-y-1 text-left w-full">
                      <p className="text-sm font-medium">{module.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {module.lessons?.length || 0} lessons
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="flex flex-col space-y-1">
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const isActive =
                        pathname ===
                        `/dashboard/courses/${course._id}/lessons/${lesson._id}`;

                      return (
                        <Link
                          key={lesson._id}
                          href={`/dashboard/courses/${course._id}/lessons/${lesson._id}`}
                        >
                          <div
                            className={cn(
                              "flex items-center pl-10 pr-4 py-2 gap-x-4 group hover:bg-muted/50 transition-colors relative",
                              isActive && "bg-muted"
                            )}
                          >
                            <span className="text-xs font-medium text-muted-foreground w-4">
                              {String(lessonIndex + 1).padStart(2, "0")}
                            </span>
                            <PlayCircle
                              className={cn(
                                "h-4 w-4 shrink-0",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-primary/80"
                              )}
                            />
                            <span className="text-sm line-clamp-2 flex-1">
                              {lesson.title}
                            </span>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-primary" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
