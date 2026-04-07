import React from 'react'
import { AllCandidatesPublicByElectionIdSection } from '../sections/all-candidates-public-by-electionid-section'

interface Props {
  electionId: string
}

export const AllCandidatesPublicByElectionIdView = ({ electionId }: Props) => {
  return (
    <div className='px-2 md:px-7'>
      <AllCandidatesPublicByElectionIdSection electionId={electionId} />
    </div>
  )
}
