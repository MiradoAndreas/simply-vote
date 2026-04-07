import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";
import { db } from "..";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized, veuillez connecter",
    });
  }
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);
  if (!dbUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "Vous êtes connecté mais pas visible au base de donné, unauthorized",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: dbUser,
    },
  });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Vous n'êtes pas admin",
    });
  }

  return next();
});
