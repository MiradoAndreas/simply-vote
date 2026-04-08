import { AllResultsPublicByElectionIdSection } from "../sections/all-results-public-by-election-id-section"

interface AllResultsPublicByElectionIdViewProps {
  electionId: string
}

export const AllResultsPublicByElectionIdView = ({ electionId }: AllResultsPublicByElectionIdViewProps) => {
  return (
    <div className="px-4 md:px-7">
      <AllResultsPublicByElectionIdSection electionId={electionId} />
    </div>
  )
}
