import { users } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUserRole = cache(async (clerkId: string) => {
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user?.role || null;
});
