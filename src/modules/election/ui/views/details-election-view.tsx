import { CandidateElectionSection } from "../sections/candidate-election-section"

interface DetailsElectionViewProps {
  electionId: string
}

export const DetailsElectionView = ({ electionId }: DetailsElectionViewProps) => {
  return (
    <div className="px-5 md:px-10">
      <h1 className="text-3xl font-bold text-center">Details election</h1>
      <CandidateElectionSection electionId={electionId} />
    </div>
  )
}
