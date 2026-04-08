"use client"
import { useRouter } from "next/navigation"
import { CreateElectionForm } from "../components/create-election-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"


export const CreateElectionSection = () => {
  const router = useRouter()
  return (
    <div className="px-4 pt-7">
      <div className='flex items-center gap-x-2 py-7'>
        <Button onClick={() => router.back()}>
          <ArrowLeft /> Retour
        </Button>
        <Button onClick={() => router.forward()}>
          Suvant <ArrowRight />
        </Button>
      </div>

      <div className='space-y-5'>
        <h1 className='text-3xl font-bold'>Créer une élection</h1>
        <p className='text-md text-muted-foreground text-balance'>Vous pouvez créer ici des nombreux types d'élections, comme des élections publiques, privées, ou des élections sur lesquelles vous pouvez voter et que vous pouvez mettre également tous les candidats liées à l'élection.</p>
        <p className='text-primary text-sm'>
          Cet création est reservée aux administrateurs pour le moment.
        </p>
        <CreateElectionForm />
      </div></div>
  )
}
