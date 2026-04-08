import React from 'react'
import { AllElectionPublicSection } from '../sections/all-election-public-section'

interface AllElectionPublicViewProps {
  isResult: boolean
}

export const AllElectionPublicView = ({ isResult }: AllElectionPublicViewProps) => {
  return (
    <div className='px-5 md:px-10'>
      <AllElectionPublicSection isResult={isResult} />
    </div>
  )
}
