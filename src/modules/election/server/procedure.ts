import { elections, options, votes } from "@/db/schema";
import { db } from "@/index";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
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
  getAllElection: adminProcedure.query(async ({ ctx }) => {
    const allElections = await db
      .select()
      .from(elections)
      .orderBy(desc(elections.createdAt));

    return allElections;
  }),
  getAllElectionPublic: baseProcedure.query(async ({ ctx }) => {
    const allElections = await db
      .select()
      .from(elections)
      .orderBy(desc(elections.createdAt));

    return allElections;
  }),
  createCandidate: adminProcedure
    .input(
      z.object({
        electionId: z.uuid(),
        name: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [election] = await db
        .select()
        .from(elections)
        .where(eq(elections.id, input.electionId));

      if (!election) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Election non trouvée",
        });
      }

      if (election.createdBy !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Vous n'êtes pas autorisé à créer des candidats à cet élection",
        });
      }

      const existingCandidates = await db
        .select()
        .from(options)
        .where(eq(options.electionId, input.electionId))
        .orderBy(desc(options.order));

      const nextOrder = existingCandidates.length;

      const [candidate] = await db
        .insert(options)
        .values({
          electionId: input.electionId,
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl || "/default-avatar.png", // Image par défaut
          order: nextOrder,
        })
        .returning();

      if (!candidate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Impossible de créer le candidat",
        });
      }
      return candidate;
    }),
  getAllCandidates: adminProcedure
    .input(
      z.object({
        electionId: z.string().uuid("ID d'élection invalide"),
      }),
    )
    .query(async ({ input }) => {
      const candidates = await db
        .select()
        .from(options)
        .where(eq(options.electionId, input.electionId))
        .orderBy(options.order);

      if (!candidates) {
        return [];
      }

      return candidates;
    }),
  getPublicAllElection: protectedProcedure.query(async ({ ctx }) => {
    const allElections = await db
      .select()
      .from(elections)
      .orderBy(desc(elections.createdAt));

    return allElections;
  }),
  getAllCandidatesPublic: protectedProcedure
    .input(
      z.object({
        electionId: z.uuid("ID d'élection invalide"),
      }),
    )
    .query(async ({ input }) => {
      const candidates = await db
        .select()
        .from(options)
        .where(eq(options.electionId, input.electionId))
        .orderBy(options.order);

      if (!candidates) {
        return [];
      }

      return candidates;
    }),
  hasUserVoted: protectedProcedure
    .input(
      z.object({
        electionId: z.uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const existingVote = await db
        .select()
        .from(votes)
        .where(
          and(
            eq(votes.electionId, input.electionId),
            eq(votes.userId, ctx.user.id),
          ),
        )
        .limit(1);

      return {
        hasVoted: existingVote.length > 0,
        vote: existingVote[0] || null,
      };
    }),
  voteForCandidate: protectedProcedure
    .input(
      z.object({
        electionId: z.string().uuid("ID d'élection invalide"),
        candidateId: z.string().uuid("ID de candidat invalide"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Vérifier que l'élection existe et est active
      const [election] = await db
        .select()
        .from(elections)
        .where(eq(elections.id, input.electionId));

      if (!election) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Élection non trouvée",
        });
      }

      // 2. Vérifier que l'élection est en cours
      const now = new Date();
      if (now < election.startDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cette élection n'a pas encore commencé",
        });
      }

      if (now > election.endDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cette élection est terminée",
        });
      }

      // 3. Vérifier que l'élection est active
      if (!election.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cette élection n'est pas active",
        });
      }

      // 4. Vérifier que le candidat existe et appartient à l'élection
      const [candidate] = await db
        .select()
        .from(options)
        .where(
          and(
            eq(options.id, input.candidateId),
            eq(options.electionId, input.electionId),
          ),
        );

      if (!candidate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Candidat non trouvé",
        });
      }

      // 5. Vérifier que l'utilisateur n'a pas déjà voté
      const [existingVote] = await db
        .select()
        .from(votes)
        .where(
          and(
            eq(votes.electionId, input.electionId),
            eq(votes.userId, ctx.user.id),
          ),
        );

      if (existingVote) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vous avez déjà voté pour cette élection",
        });
      }

      // 6. Créer le vote
      const [vote] = await db
        .insert(votes)
        .values({
          electionId: input.electionId,
          userId: ctx.user.id,
          optionIds: [input.candidateId], // Pour le moment, support un seul candidat
          votedAt: new Date(),
        })
        .returning();

      if (!vote) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'enregistrement du vote",
        });
      }

      return {
        success: true,
        message: "Votre vote a été enregistré avec succès",
        vote,
      };
    }),
  getElectionResults: protectedProcedure
    .input(
      z.object({
        electionId: z.string().uuid("ID d'élection invalide"),
      }),
    )
    .query(async ({ input, ctx }) => {
      // 1. Vérifier que l'élection existe
      const [election] = await db
        .select()
        .from(elections)
        .where(eq(elections.id, input.electionId));

      if (!election) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Élection non trouvée",
        });
      }

      // 2. Vérifier les permissions (admin ou élection terminée)
      const now = new Date();
      const isElectionEnded = now > election.endDate;
      const isAdmin = ctx.user.role === "admin";

      // Si l'utilisateur n'est pas admin et l'élection n'est pas terminée
      if (!isAdmin && !isElectionEnded) {
        // Retourner les infos de l'élection avec le temps restant au lieu d'une erreur
        const timeRemaining = election.endDate.getTime() - now.getTime();
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutesRemaining = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
        );
        const secondsRemaining = Math.floor(
          (timeRemaining % (1000 * 60)) / 1000,
        );

        return {
          election: {
            id: election.id,
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            isActive: election.isActive,
          },
          results: [], // Pas de résultats disponibles
          statistics: {
            totalVotes: 0,
            totalCandidates: 0,
            participationRate: 0,
            isElectionEnded: false,
            isAvailable: false,
            timeRemaining: {
              days: daysRemaining,
              hours: hoursRemaining,
              minutes: minutesRemaining,
              seconds: secondsRemaining,
              total: timeRemaining,
            },
          },
        };
      }

      // 3. Récupérer tous les candidats de l'élection
      const candidates = await db
        .select()
        .from(options)
        .where(eq(options.electionId, input.electionId))
        .orderBy(options.order);

      // 4. Récupérer tous les votes pour cette élection
      const allVotes = await db
        .select()
        .from(votes)
        .where(eq(votes.electionId, input.electionId));

      // 5. Compter les votes par candidat
      const voteCounts = new Map<string, number>();

      // Initialiser les compteurs à 0 pour tous les candidats
      candidates.forEach((candidate) => {
        voteCounts.set(candidate.id, 0);
      });

      // Compter les votes
      allVotes.forEach((vote) => {
        vote.optionIds.forEach((candidateId) => {
          const currentCount = voteCounts.get(candidateId) || 0;
          voteCounts.set(candidateId, currentCount + 1);
        });
      });

      // 6. Calculer les statistiques
      const totalVotes = allVotes.length;
      const participationRate =
        totalVotes > 0 ? (totalVotes / allVotes.length) * 100 : 0;

      // 7. Formater les résultats
      const results = candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        description: candidate.description,
        imageUrl: candidate.imageUrl,
        voteCount: voteCounts.get(candidate.id) || 0,
        percentage:
          totalVotes > 0
            ? ((voteCounts.get(candidate.id) || 0) / totalVotes) * 100
            : 0,
      }));

      // Trier par nombre de votes (décroissant)
      results.sort((a, b) => b.voteCount - a.voteCount);

      return {
        election: {
          id: election.id,
          title: election.title,
          description: election.description,
          startDate: election.startDate,
          endDate: election.endDate,
          isActive: election.isActive,
        },
        results,
        statistics: {
          totalVotes,
          totalCandidates: candidates.length,
          participationRate: parseFloat(participationRate.toFixed(2)),
          isElectionEnded: true,
          isAvailable: true,
        },
      };
    }),
});
