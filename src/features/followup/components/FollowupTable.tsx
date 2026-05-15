import type { FollowupDto }
from '../types/followup.types'

interface Props {
  followups: FollowupDto[]
}

const FollowupTable = ({
  followups
}: Props) => {

  return (

    <table className="table">

      <thead>
        <tr>
          <th>Hearing</th>
          <th>Decision</th>
          <th>Remarks</th>
        </tr>
      </thead>

      <tbody>

        {followups.map((f) => (

          <tr key={f.id}>

            <td>{f.hearingDate}</td>

            <td>{f.decision}</td>

            <td>{f.remarks}</td>

          </tr>
        ))}

      </tbody>

    </table>
  )
}

export default FollowupTable