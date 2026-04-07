import { elections } from "@/db/schema";
import { db } from "@/index";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const electionRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(3, "Titre trop court"),
        description: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        maxChoices: z.number().min(1).default(1),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log("INPUT DE LA FORMULAIRE : ", input);
      if (input.endDate <= input.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La date de fin doit être supérieure à la date de début",
        });
      }

      const [election] = await db
        .insert(elections)
        .values({
          ...input,
          createdBy: ctx.user.id,
          updatedAt: new Date(),
        })
        .returning();
      if (!election)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Election non entre",
        });
      return election;
    }),
});
