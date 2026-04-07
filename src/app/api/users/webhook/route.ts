import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/index";

export async function POST(req: Request) {
  const SIGNIN_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNIN_SECRET) {
    throw new Error(
      "Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNIN_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error : Messing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Error: Could not verify webhook: ", error);
    return new Response("Error: Verification error : ", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guid,

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { data } = evt;
    const email = data.email_addresses?.[0]?.email_address;

    if (!email) {
      return new Response("Missing email", { status: 400 });
    }

    await db.insert(users).values({
      clerkId: data.id,
      email: email,
      imageUrl: data.image_url,
    });
  }

  if (eventType === "user.deleted") {
    const { data } = evt;
    if (!data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    await db.delete(users).where(eq(users.clerkId, data.id));
  }

  if (eventType === "user.updated") {
    const { data } = evt;
    await db
      .update(users)
      .set({
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      })
      .where(eq(users.clerkId, data.id));
  }
  return new Response("Webhook received : ", { status: 200 });
}
