import { AllCandidates } from "../components/all-candidate"
import { CreateCandidateForm } from "../components/create-candidate-form"

interface CandidateElectionSectionProps {
  electionId: string
}

export const CandidateElectionSection = ({ electionId }: CandidateElectionSectionProps) => {
  // Afficher ici tous les candidats de cet élection
  return (
    <div className="pt-5 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-primary ">
          Candidats
        </h1>
        <CreateCandidateForm electionId={electionId} />
      </div>
      <div>
        <AllCandidates electionId={electionId} />
      </div>

    </div>
  )
}
