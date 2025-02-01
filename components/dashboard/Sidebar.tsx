"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Library } from "lucide-react";
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
    <div className="h-full border-r flex flex-col bg-background">
      <div className="p-6 space-y-4 border-b">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-x-2 pl-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <Library className="h-4 w-4" />
            <span>Course Library</span>
          </Button>
        </Link>
        <h1 className="font-semibold text-lg">{course.title}</h1>
      </div>
      <ScrollArea className="flex-1 pt-4">
        <div className="pb-4">
          <Accordion type="multiple" className="w-full">
            {course.modules?.map((module) => (
              <AccordionItem key={module._id} value={module._id}>
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm">{module.title}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col">
                    {module.lessons?.map((lesson) => {
                      const isActive =
                        pathname ===
                        `/dashboard/courses/${course._id}/lessons/${lesson._id}`;

                      return (
                        <Link
                          key={lesson._id}
                          href={`/dashboard/courses/${course._id}/lessons/${lesson._id}`}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "flex items-center gap-x-2 w-full font-normal justify-start pl-12 hover:bg-muted/50",
                              isActive && "bg-muted/50"
                            )}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <p className="line-clamp-1 text-sm">
                              {lesson.title}
                            </p>
                          </Button>
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
