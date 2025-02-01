"use client";

import { createStripeCheckout } from "@/actions/createStripeCheckout";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function EnrollButton({ courseId }: { courseId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEnroll = async (courseId: string) => {
    console.log(courseId);
    startTransition(async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const { url } = await createStripeCheckout(courseId, userId);
        if (url) {
          router.push(url);
        }
      } catch (error) {
        console.error("Error in handleEnroll:", error);
        throw new Error("Failed to create checkout session");
      }
    });
  };

  return (
    <button
      className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
        ${
          isPending || !user?.id
            ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
            : "bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10"
        }
      `}
      disabled={!user?.id || isPending}
      onClick={() => handleEnroll(courseId)}
    >
      {user && (
        <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
          {!user?.id ? "Sign in to Enroll" : "Enroll Now"}
        </span>
      )}
      {(isPending || !user) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

export default EnrollButton;
