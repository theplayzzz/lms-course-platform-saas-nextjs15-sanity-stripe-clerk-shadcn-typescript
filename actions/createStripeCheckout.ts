"use server";

import stripe from "@/lib/stripe";
import baseUrl from "@/lib/baseUrl";

import { urlFor } from "@/sanity/lib/image";
import getCourseById from "@/sanity/lib/courses/getCourseById";

export async function createStripeCheckout(courseId: string, userId: string) {
  try {
    // 1. Query course details from Sanity
    const course = await getCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    // 2. Validate course data and prepare price for Stripe
    if (!course.price) {
      throw new Error("Course price is not set");
    }
    const priceInCents = Math.round(course.price * 100);

    const { title, description, image } = course;

    if (!title || !description || !image) {
      throw new Error("Course data is incomplete");
    }

    // 3. Create and configure Stripe Checkout Session with course details
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              description: description,
              images: [urlFor(image).url() || ""],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/courses/${course._id}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/courses/${course._id}?canceled=true`,
      metadata: {
        courseId: course._id,
        userId: userId,
      },
    });

    // 4. Return checkout session URL for client redirect
    return { url: session.url };
  } catch (error) {
    console.error("Error in createStripeCheckout:", error);
    throw new Error("Failed to create checkout session");
  }
}
