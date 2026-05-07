// ============================================================
// ReportsPage COMPONENT
// Yeh Reports ka poora page hai. Ismein:
//   1. Upar 4 stat cards hain (Total, Pending, Finalized, Upcoming)
//   2. Neeche do tables side by side — Department aur Court wise
//
// NOTE: Yeh sirf READ page hai — koi form, koi create/delete button nahi
// Sirf data dekhna hai management ke liye
// ============================================================

import { useSummaryReport } from '../hooks/useSummaryReport';
import { useDepartmentReport } from '../hooks/useDepartmentReport';
import { useCourtReport } from '../hooks/useCourtReport';

const ReportsPage = () => {

  // Teen hooks call karo — teen alag API calls hongi parallel mein
  const { data: summary, isLoading: summaryLoading } = useSummaryReport();
  const { data: deptReport, isLoading: deptLoading } = useDepartmentReport();
  const { data: courtReport, isLoading: courtLoading } = useCourtReport();

  // -------------------------------------------------------
  // HELPER COMPONENT — Stat Card
  // Ek card dikhata hai ek number ke saath
  // Yeh ek "inner component" hai — sirf is file mein use hoga
  // Props = component ko bahar se jo data diya jata hai
  // -------------------------------------------------------
  const StatCard = ({
    title,
    value,
    icon,
    color,
    isLoading,
  }: {
    title: string;
    value: number | undefined;
    icon: string;
    color: string;
    isLoading: boolean;
  }) => (
    // Inline style mein dynamic color use kiya — "color" prop se aata hai
    <div className="col-md-3 col-sm-6">
      <div
        className="card shadow-sm h-100"
        style={{ borderLeft: `5px solid ${color}` }}
      >
        <div className="card-body d-flex align-items-center gap-3">
          {/* Icon */}
          <span style={{ fontSize: '2.5rem' }}>{icon}</span>

          {/* Text info */}
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            {isLoading ? (
              // Agar load ho raha hai toh placeholder dikhao
              <div
                className="placeholder-glow"
                style={{ width: '60px', height: '2rem', background: '#e0e0e0', borderRadius: 4 }}
              />
            ) : (
              <h3 className="mb-0 fw-bold" style={{ color }}>
                {/* value ?? 0 = agar value undefined ho toh 0 dikhao */}
                {value ?? 0}
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------
  // HELPER FUNCTION — Pending % calculate karna
  // Bar chart ki jagah ek simple colored bar banate hain
  // -------------------------------------------------------
  const getPercentage = (pending: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((pending / total) * 100);
  };

  // -------------------------------------------------------
  // MAIN RETURN — Page ka poora layout
  // -------------------------------------------------------
  return (
    <div className="container-fluid py-4">

      {/* PAGE HEADER */}
      <div className="mb-4">
        <h2 style={{ color: '#1a1a2e', fontWeight: 700 }}>
          📊 Reports & Analytics
        </h2>
        <p className="text-muted">
          System ki overall performance aur statistics
        </p>
      </div>

      {/* ===================================================
          SECTION 1: 4 SUMMARY STAT CARDS
          row = Bootstrap grid row
          g-3 = 3 units ka gap har card ke beech
          mb-4 = neeche margin
      =================================================== */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Cases"
          value={summary?.totalCases}
          // "?." = optional chaining — agar summary undefined hai toh crash mat ho
          icon="📁"
          color="#0d6efd" // Bootstrap blue
          isLoading={summaryLoading}
        />
        <StatCard
          title="Pending Cases"
          value={summary?.pendingCases}
          icon="⏳"
          color="#fd7e14" // Orange
          isLoading={summaryLoading}
        />
        <StatCard
          title="Finalized Cases"
          value={summary?.finalizedCases}
          icon="✅"
          color="#198754" // Green
          isLoading={summaryLoading}
        />
        <StatCard
          title="Upcoming Hearings"
          value={summary?.upcomingHearings}
          icon="📅"
          color="#dc3545" // Red
          isLoading={summaryLoading}
        />
      </div>

      {/* ===================================================
          SECTION 2: DO TABLES SIDE BY SIDE
          col-md-6 = har table aadhi width lega medium screen pe
          Chhoti screen pe automatically neeche aayega
      =================================================== */}
      <div className="row g-4">

        {/* === LEFT TABLE: DEPARTMENT WISE REPORT === */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0">🏢 Department-wise Cases</h6>
            </div>
            <div className="card-body p-0">

              {/* Loading state */}
              {deptLoading && (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" />
                  <p className="mt-2 text-muted small">Load ho raha hai...</p>
                </div>
              )}

              {/* Table */}
              {!deptLoading && deptReport && (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Department</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Pending</th>
                        <th className="text-center">Finalized</th>
                        <th>Pending %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deptReport.map((dept, index) => {
                        const pendingPct = getPercentage(dept.pendingCases, dept.totalCases);
                        return (
                          <tr key={index}>
                            <td>
                              <strong style={{ fontSize: '0.9rem' }}>
                                {dept.departmentName}
                              </strong>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-secondary">{dept.totalCases}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">{dept.pendingCases}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">{dept.finalizedCases}</span>
                            </td>
                            <td style={{ width: '120px' }}>
                              {/* Progress bar — pending percentage dikhata hai visually */}
                              <div className="progress" style={{ height: '8px' }}>
                                <div
                                  className="progress-bar bg-warning"
                                  style={{ width: `${pendingPct}%` }}
                                  // Inline style se dynamic width set ki
                                />
                              </div>
                              <small className="text-muted">{pendingPct}%</small>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty state */}
              {!deptLoading && deptReport && deptReport.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <p>Koi department data nahi mila</p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* === RIGHT TABLE: COURT WISE REPORT === */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">⚖️ Court-wise Cases</h6>
            </div>
            <div className="card-body p-0">

              {/* Loading state */}
              {courtLoading && (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-success" />
                  <p className="mt-2 text-muted small">Load ho raha hai...</p>
                </div>
              )}

              {/* Table */}
              {!courtLoading && courtReport && (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Court</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Pending</th>
                        <th className="text-center">Finalized</th>
                        <th>Pending %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courtReport.map((court, index) => {
                        const pendingPct = getPercentage(court.pendingCases, court.totalCases);
                        return (
                          <tr key={index}>
                            <td>
                              <strong style={{ fontSize: '0.9rem' }}>
                                {court.courtName}
                              </strong>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-secondary">{court.totalCases}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">{court.pendingCases}</span>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success">{court.finalizedCases}</span>
                            </td>
                            <td style={{ width: '120px' }}>
                              <div className="progress" style={{ height: '8px' }}>
                                <div
                                  className="progress-bar bg-warning"
                                  style={{ width: `${pendingPct}%` }}
                                />
                              </div>
                              <small className="text-muted">{pendingPct}%</small>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty state */}
              {!courtLoading && courtReport && courtReport.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <p>Koi court data nahi mila</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <div className="mt-4 text-center text-muted small">
        <p> Note: Yeh reports read-only hain. Koi edit/delete nahi hota yahan se.</p>
      </div>

    </div>
  );
};

export default ReportsPage;
