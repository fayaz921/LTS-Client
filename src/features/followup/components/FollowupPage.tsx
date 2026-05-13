import { useParams }
from 'react-router-dom'

import FollowupForm
from '../components/FollowupForm'

import FollowupTable
from '../components/FollowupTable'

import { useFollowups }
from '../hooks/useFollowups'

const FollowupPage = () => {

  const { caseId } = useParams()

  const {
    data,
    isLoading,
    isError
  } = useFollowups(caseId!)

  if (isLoading)
    return <p>Loading...</p>

  if (isError)
    return <p>Error loading followups</p>

  return (
    <div className="container mt-4">

      <h2>Followups</h2>

      <FollowupForm
        caseId={caseId!}
      />

      <FollowupTable
        followups={data || []}
      />

    </div>
  )
}

export default FollowupPage