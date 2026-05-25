import { useState } from 'react';
import { usePayments, useApprovePayment, useRejectPayment } from '../hooks/useSuperAdmin';
import type { Payment, PaymentStatus } from '../types/superAdmin.types';

const StatusPill = ({ status }: { status: PaymentStatus }) => {
  const config = {
    Approved: { bg: '#f0fff4', color: '#2f9e44', icon: '✓' },
    Pending:  { bg: '#fff8e1', color: '#c89b2a', icon: '⏳' },
    Rejected: { bg: '#fff5f5', color: '#e53e3e', icon: '✕' },
  }[status] ?? { bg: '#f1f3f5', color: '#7a8599', icon: '?' };
  return (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: config.bg, color: config.color, fontSize: '0.65rem' }}>
      {config.icon} {status}
    </span>
  );
};

const PlanPill = ({ plan }: { plan: string }) => {
  const config: Record<string, { bg: string; color: string }> = {
    Trial:        { bg: '#fef9e7', color: '#c89b2a' },
    Starter:      { bg: '#f1f3f5', color: '#7a8599' },
    Professional: { bg: '#eef2ff', color: '#3b5bdb' },
    Enterprise:   { bg: '#f3f0ff', color: '#7048e8' },
  };
  const c = config[plan] ?? { bg: '#f1f3f5', color: '#7a8599' };
  return (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: c.bg, color: c.color, fontSize: '0.65rem' }}>
      {plan}
    </span>
  );
};

const DetailRow = ({ label, value, mono = false, highlight }: {
  label: string; value: string; mono?: boolean; highlight?: string
}) => (
  <div className="d-flex justify-content-between align-items-center py-2"
    style={{ borderBottom: '1px solid #f0f2f5', fontSize: '0.82rem' }}>
    <span style={{ color: '#7a8599', fontSize: '0.75rem', minWidth: 130 }}>{label}</span>
    <span className="fw-semibold text-end"
      style={{
        fontFamily: mono ? 'monospace' : 'inherit',
        fontSize: mono ? '0.75rem' : '0.82rem',
        color: highlight ?? 'inherit',
      }}>
      {value}
    </span>
  </div>
);

const PaymentDetailModal = ({
  payment, onClose, onApprove, onReject, isApproving,
}: {
  payment: Payment;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isApproving: boolean;
}) => {
  const [showReject, setShowReject]     = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [imgZoomed, setImgZoomed]       = useState(false);

  const methodIcon: Record<string, string> = {
    JazzCash: '🟠', EasyPaisa: '🟢', BankTransfer: '🏦',
  };

  const statusColor = {
    Approved: '#2f9e44', Pending: '#c89b2a', Rejected: '#e53e3e',
  }[payment.status] ?? '#7a8599';

  return (
    <div onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 9999, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '1rem',
      }}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: '100%',
          maxWidth: 860, maxHeight: '90vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>

        {/* Header */}
        <div style={{ background: '#1e2d45', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-2 d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 42, height: 42, background: '#c89b2a', color: '#1e2d45', fontSize: '1.1rem', flexShrink: 0 }}>
              {payment.organizationName?.charAt(0) ?? '?'}
            </div>
            <div>
              <div className="fw-bold" style={{ color: '#fff', fontSize: '0.95rem' }}>{payment.organizationName}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>Payment Request Detail</div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <StatusPill status={payment.status} />
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: '1rem' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Status color bar */}
        <div style={{ height: 4, background: statusColor, flexShrink: 0 }} />

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div className="row g-0">

            {/* Left — Details */}
            <div className="col-12 col-md-6" style={{ padding: 20, borderRight: '1px solid #f0f2f5' }}>

              {/* Amount hero */}
              <div className="rounded-3 p-3 mb-4 text-center"
                style={{ background: '#1e2d45' }}>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Payment Amount
                </div>
                <div className="fw-bold" style={{ color: '#c89b2a', fontSize: '2.2rem', lineHeight: 1 }}>
                  PKR {payment.amount.toLocaleString()}
                </div>
                <div className="mt-2 d-flex justify-content-center gap-2">
                  <PlanPill plan={payment.requestedPlan} />
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', alignSelf: 'center' }}>
                    {methodIcon[payment.paymentMethod] ?? '💳'} {payment.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Organization info */}
              <div className="mb-3">
                <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
                  Organization
                </div>
                <DetailRow label="Org Name"     value={payment.organizationName} />
                <DetailRow label="Requested Plan" value={payment.requestedPlan} />
              </div>

              {/* Sender info */}
              <div className="mb-3">
                <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
                  Sender Info
                </div>
                <DetailRow label="Sender Name"  value={payment.senderName} />
                <DetailRow label="Phone"        value={payment.senderPhone} />
                <DetailRow label="Method"       value={`${methodIcon[payment.paymentMethod] ?? ''} ${payment.paymentMethod}`} />
              </div>

              {/* Transaction info */}
              <div className="mb-3">
                <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>
                  Transaction
                </div>
                <DetailRow label="Transaction ID" value={payment.transactionId} mono />
                <DetailRow label="Submitted At"   value={new Date(payment.submittedAt).toLocaleString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                <DetailRow label="Amount"         value={`PKR ${payment.amount.toLocaleString()}`} highlight="#1e2d45" />
              </div>

              {/* Review info — agar approved/rejected */}
              {payment.status !== 'Pending' && (
                <div className="rounded-3 p-3"
                  style={{ background: payment.status === 'Approved' ? '#f0fff4' : '#fff5f5', border: `1px solid ${payment.status === 'Approved' ? '#bbf7d0' : '#fecaca'}` }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: payment.status === 'Approved' ? '#2f9e44' : '#e53e3e', marginBottom: 8 }}>
                    Review Info
                  </div>
                  <DetailRow label="Reviewed By" value={payment.reviewedBy ?? '—'} />
                  {payment.reviewedAt && (
                    <DetailRow label="Reviewed At" value={new Date(payment.reviewedAt).toLocaleString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
                  )}
                  {payment.rejectionReason && (
                    <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#e53e3e' }}>
                      <span style={{ fontWeight: 600 }}>Reason: </span>{payment.rejectionReason}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — Screenshot + Actions */}
            <div className="col-12 col-md-6" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Screenshot */}
              <div>
                <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10 }}>
                  Payment Screenshot
                </div>
                {payment.screenshotUrl ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={payment.screenshotUrl}
                      alt="Payment proof"
                      onClick={() => setImgZoomed(true)}
                      style={{
                        width: '100%', borderRadius: 10, objectFit: 'cover',
                        maxHeight: imgZoomed ? 'none' : 280,
                        cursor: 'zoom-in', border: '1px solid #e8ecf0',
                        transition: 'max-height 0.3s ease',
                      }}
                    />
                    {!imgZoomed && (
                      <div onClick={() => setImgZoomed(true)}
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                          borderRadius: '0 0 10px 10px', padding: '20px 12px 10px',
                          cursor: 'zoom-in', textAlign: 'center',
                        }}>
                        <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 600 }}>
                          🔍 Click to zoom
                        </span>
                      </div>
                    )}
                    {imgZoomed && (
                      <button onClick={() => setImgZoomed(false)}
                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: '0.72rem' }}>
                        Collapse ↑
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{ height: 180, background: '#f8fafc', border: '1px dashed #e0e3e7', color: '#7a8599', fontSize: '0.82rem' }}>
                    No screenshot uploaded
                  </div>
                )}
              </div>

              {/* Actions — sirf Pending pe */}
              {payment.status === 'Pending' && (
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10 }}>
                    Actions
                  </div>

                  <button
                    onClick={() => { onApprove(payment.id); onClose(); }}
                    disabled={isApproving}
                    className="btn w-100 fw-bold mb-2"
                    style={{ background: '#2f9e44', color: '#fff', borderRadius: 10, fontSize: '0.85rem', border: 'none', padding: '10px' }}>
                    {isApproving ? '⏳ Approving...' : '✓ Approve Payment'}
                  </button>

                  {!showReject ? (
                    <button
                      onClick={() => setShowReject(true)}
                      className="btn w-100 fw-bold"
                      style={{ background: '#fff5f5', color: '#e53e3e', borderRadius: 10, fontSize: '0.85rem', border: '1px solid #fca5a5', padding: '10px' }}>
                      ✕ Reject Payment
                    </button>
                  ) : (
                    <div className="rounded-3 p-3"
                      style={{ background: '#fff5f5', border: '1px solid #fca5a5' }}>
                      <div style={{ fontSize: '0.72rem', color: '#e53e3e', fontWeight: 600, marginBottom: 8 }}>
                        Rejection Reason *
                      </div>
                      <textarea
                        rows={3}
                        className="form-control form-control-sm mb-3"
                        placeholder="Enter reason for rejection..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        style={{ fontSize: '0.82rem', resize: 'none', borderRadius: 8 }}
                      />
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => { onReject(payment.id, rejectReason); onClose(); }}
                          disabled={!rejectReason.trim()}
                          className="btn fw-bold flex-grow-1"
                          style={{ background: '#e53e3e', color: '#fff', borderRadius: 8, fontSize: '0.78rem', border: 'none', padding: '8px' }}>
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => { setShowReject(false); setRejectReason(''); }}
                          className="btn btn-outline-secondary flex-grow-1"
                          style={{ borderRadius: 8, fontSize: '0.78rem', padding: '8px' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({
  payment,
  onClick,
}: {
  payment: Payment;
  onClick: () => void;
}) => {
  const methodIcon: Record<string, string> = {
    JazzCash: '🟠', EasyPaisa: '🟢', BankTransfer: '🏦',
  };

  const statusColor = {
    Approved: '#2f9e44', Pending: '#c89b2a', Rejected: '#e53e3e',
  }[payment.status] ?? '#7a8599';

  return (
    <div
      onClick={onClick}
      className="card border-0 mb-3"
      style={{ borderRadius: 12, border: '1px solid #e8ecf0', cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>

      {/* Status top bar */}
      <div style={{ height: 3, background: statusColor }} />

      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3">

          {/* Avatar */}
          <div className="rounded-2 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{ width: 42, height: 42, background: '#1e2d45', color: '#c89b2a', fontSize: '1.1rem' }}>
            {payment.organizationName?.charAt(0) ?? '?'}
          </div>

          {/* Main info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="fw-bold" style={{ fontSize: '0.88rem' }}>{payment.organizationName}</div>
            <div style={{ fontSize: '0.72rem', color: '#7a8599' }}>
              {methodIcon[payment.paymentMethod] ?? '💳'} {payment.paymentMethod} &nbsp;·&nbsp;
              {new Date(payment.submittedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Plan */}
          <div className="d-none d-md-block">
            <PlanPill plan={payment.requestedPlan} />
          </div>

          {/* Amount */}
          <div className="fw-bold text-end" style={{ fontSize: '0.92rem', color: '#1e2d45', minWidth: 110 }}>
            PKR {payment.amount.toLocaleString()}
          </div>

          {/* Status */}
          <div style={{ minWidth: 90, textAlign: 'right' }}>
            <StatusPill status={payment.status} />
          </div>

          {/* Arrow hint */}
          <div style={{ color: '#c89b2a', fontSize: '0.85rem', flexShrink: 0 }}>→</div>
        </div>
      </div>
    </div>
  );
};

export const PaymentsPage = () => {
  const [page, setPage]               = useState(1);
  const [statusFilter, setFilter]     = useState('');
  const [search, setSearch]           = useState('');
  const [selectedPayment, setSelected] = useState<Payment | null>(null);

  const { data, isLoading }                        = usePayments(page, 10, statusFilter || undefined);
  const { mutate: approve, isPending: isApproving } = useApprovePayment();
  const { mutate: reject }                          = useRejectPayment();

  const payments   = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const totalAmount    = payments.reduce((s, p) => s + p.amount, 0);
  const approvedAmount = payments.filter(p => p.status === 'Approved').reduce((s, p) => s + p.amount, 0);
  const pendingCount   = payments.filter(p => p.status === 'Pending').length;
  const rejectedCount  = payments.filter(p => p.status === 'Rejected').length;

  const filtered = search
    ? payments.filter(p =>
        p.organizationName.toLowerCase().includes(search.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        p.senderName.toLowerCase().includes(search.toLowerCase())
      )
    : payments;

  const handleApprove = (id: string) => approve({ id, reviewedBy: 'SuperAdmin' });
  const handleReject  = (id: string, reason: string) => reject({ id, reason });

  return (
    <div className="container-fluid py-2">

      {/* Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isApproving={isApproving}
        />
      )}

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Collected', value: `PKR ${approvedAmount.toLocaleString()}`, color: '#2f9e44', bg: '#f0fff4', border: '#bbf7d0' },
          { label: 'Total Amount',    value: `PKR ${totalAmount.toLocaleString()}`,    color: '#3b5bdb', bg: '#eef2ff', border: '#bfdbfe' },
          { label: 'Pending',         value: `${pendingCount} requests`,               color: '#c89b2a', bg: '#fff8e1', border: '#fde68a' },
          { label: 'Rejected',        value: `${rejectedCount} requests`,              color: '#e53e3e', bg: '#fff5f5', border: '#fecaca' },
        ].map(item => (
          <div className="col-6 col-lg-3" key={item.label}>
            <div className="card border-0 h-100"
              style={{ borderRadius: 12, background: item.bg, border: `1px solid ${item.border}` }}>
              <div className="card-body p-3">
                <div style={{ fontSize: '0.65rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  {item.label}
                </div>
                <div className="fw-bold mt-1" style={{ fontSize: '1.25rem', color: item.color }}>
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 mb-3" style={{ borderRadius: 12, border: '1px solid #e8ecf0' }}>
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="🔍 Search org, sender, transaction ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ borderRadius: 8, fontSize: '0.82rem' }}
              />
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2 flex-wrap">
                {[
                  { label: 'All',      value: '' },
                  { label: 'Pending',  value: 'Pending'  },
                  { label: 'Approved', value: 'Approved' },
                  { label: 'Rejected', value: 'Rejected' },
                ].map(s => (
                  <button key={s.value}
                    onClick={() => { setFilter(s.value); setPage(1); }}
                    className="btn btn-sm fw-bold"
                    style={{
                      borderRadius: 20, fontSize: '0.72rem', padding: '4px 14px',
                      background: statusFilter === s.value ? '#1e2d45' : '#f0f2f5',
                      color: statusFilter === s.value ? '#fff' : '#7a8599',
                      border: 'none',
                    }}>
                    {s.label}
                    {s.value === 'Pending' && pendingCount > 0 && (
                      <span className="ms-1 badge rounded-pill"
                        style={{ background: '#c89b2a', color: '#fff', fontSize: '0.62rem' }}>
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div style={{ fontSize: '0.72rem', color: '#7a8599', marginBottom: 12 }}>
        💡 Click on any payment card to view full details, screenshot, and approve/reject
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-5 text-muted">Loading payments...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💳</div>
          <div style={{ fontSize: '0.88rem' }}>No payment requests found</div>
        </div>
      ) : (
        filtered.map(payment => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            onClick={() => setSelected(payment)}
          />
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 py-3">
          <button disabled={!data?.hasPrevious} onClick={() => setPage(p => p - 1)}
            style={{ background: !data?.hasPrevious ? '#e2e8f0' : '#1e2d45', color: !data?.hasPrevious ? '#94a3b8' : 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: !data?.hasPrevious ? 'not-allowed' : 'pointer' }}>
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ background: page === p ? '#c89b2a' : 'white', color: page === p ? '#1e2d45' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 12px', fontWeight: page === p ? 700 : 400, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
          <button disabled={!data?.hasNext} onClick={() => setPage(p => p + 1)}
            style={{ background: !data?.hasNext ? '#e2e8f0' : '#1e2d45', color: !data?.hasNext ? '#94a3b8' : 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: !data?.hasNext ? 'not-allowed' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};