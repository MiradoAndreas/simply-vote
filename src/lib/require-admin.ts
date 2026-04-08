// lib/auth.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "..";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

// Cache la requête utilisateur pendant la durée de la requête HTTP
export const getUserByClerkId = cache(async (clerkId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return user;
});

export const requireAuth = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Utilise la fonction cachée
  const user = await getUserByClerkId(userId);

  if (!user) {
    redirect("/sign-in");
  }

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl,
  };
};

export const requireAdmin = async () => {
  const session = await requireAuth();

  if (session.role !== "admin") {
    redirect("/not-admin");
  }

  return session;
};
