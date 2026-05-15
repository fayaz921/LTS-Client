import { useState } from 'react'

import { useCreateFollowup }
from '../hooks/useCreateFollowup'

interface Props {
  caseId: string
}

const FollowupForm = ({
  caseId
}: Props) => {

  const { mutate, isPending }
    = useCreateFollowup()

  const [form, setForm] = useState({
    hearingDate: '',
    nextHearingDate: '',
    decision: '',
    remarks: ''
  })

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    mutate({
      caseId,
      ...form
    })
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="card p-3 mb-4"
    >

      <input
        type="date"
        className="form-control mb-2"
        value={form.hearingDate}
        onChange={(e) =>
          setForm({
            ...form,
            hearingDate: e.target.value
          })
        }
      />

      <input
        type="date"
        className="form-control mb-2"
        value={form.nextHearingDate}
        onChange={(e) =>
          setForm({
            ...form,
            nextHearingDate: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Decision"
        className="form-control mb-2"
        value={form.decision}
        onChange={(e) =>
          setForm({
            ...form,
            decision: e.target.value
          })
        }
      />

      <textarea
        placeholder="Remarks"
        className="form-control mb-2"
        value={form.remarks}
        onChange={(e) =>
          setForm({
            ...form,
            remarks: e.target.value
          })
        }
      />

      <button className="btn btn-primary">

        {isPending
          ? 'Saving...'
          : 'Save Followup'}

      </button>

    </form>
  )
}

export default FollowupForm