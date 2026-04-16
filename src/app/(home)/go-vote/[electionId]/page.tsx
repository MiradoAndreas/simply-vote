import { AllCandidatesPublicByElectionIdView } from "@/modules/election/ui/views/all-candidates-public-by-electionid-view"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
export const dynamic = "force-dynamic"
interface PageProps {
  params: Promise<{
    electionId: string
  }>
}
const Page = async ({ params }: PageProps) => {
  const { electionId } = await params
  prefetch(
    trpc.election.getAllCandidatesPublic.queryOptions({
      electionId: electionId
    })
  )
  return (
    <HydrateClient>
      <AllCandidatesPublicByElectionIdView electionId={electionId} />
    </HydrateClient>
  )
}

export default Page