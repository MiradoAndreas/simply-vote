import { CreateElectionForm } from "../components/create-election-form"


export const CreateElectionSection = () => {
  return (
    <div className='px-4 pt-10 space-y-5'>
      <h1 className='text-3xl font-bold'>Créer une élection</h1>
      <p className='text-md text-muted-foreground text-balance'>Vous pouvez créer ici des nombreux types d'élections, comme des élections publiques, privées, ou des élections sur lesquelles vous pouvez voter et que vous pouvez mettre également tous les candidats liées à l'élection.</p>
      <p className='text-primary text-sm'>
        Cet création est reservée aux administrateurs pour le moment.
      </p>
      <CreateElectionForm />
    </div>
  )
}
