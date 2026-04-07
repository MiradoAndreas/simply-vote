import { z } from "zod";
import { createTRPCRouter } from "../init";
import { electionRouter } from "@/modules/election/server/procedure";
export const appRouter = createTRPCRouter({
  election: electionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
