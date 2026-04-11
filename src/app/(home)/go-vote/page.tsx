import { AllElectionPublicView } from "@/modules/election/ui/views/all-election-public-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Voter sur SimplyVote"
}

const Page = async () => {
  prefetch(
    trpc.election.getAllElectionPublic.queryOptions()
  )
  return (
    <HydrateClient>
      <AllElectionPublicView isResult={false} />
    </HydrateClient>
  )
}

export default Page