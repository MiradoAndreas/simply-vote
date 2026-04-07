import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { ClientGreeting } from "../client-greeting"



const Page = async () => {
  prefetch(
    trpc.hello.queryOptions({
      text: "SimplyVote",
    })
  )
  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  )
}

export default Page