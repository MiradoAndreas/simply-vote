import { requireAdmin } from "@/lib/require-admin"
import { CreateElectionView } from "@/modules/election/ui/views/create-election"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Créer une élection"
}


const Page = async () => {
  await requireAdmin()
  return (
    <CreateElectionView />
  )
}

export default Page