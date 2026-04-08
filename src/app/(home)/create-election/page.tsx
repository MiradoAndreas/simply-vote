import { requireAdmin } from "@/lib/require-admin"
import { CreateElectionView } from "@/modules/election/ui/views/create-election"


const Page = async () => {
  await requireAdmin()
  return (
    <CreateElectionView />
  )
}

export default Page