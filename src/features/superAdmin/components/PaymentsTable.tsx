import type { Payment, PaymentStatus, SubscriptionPlan } from '../types/superAdmin.types';

interface Props {
  payments: Payment[];
}

const PlanPill = ({ plan }: { plan: SubscriptionPlan }) => {
  const config = {
    Basic:        { bg: '#f1f3f5', color: '#7a8599' },
    Professional: { bg: '#eef2ff', color: '#3b5bdb' },
    Enterprise:   { bg: '#f3f0ff', color: '#7048e8' },
  }[plan];
  return (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: config.bg, color: config.color, fontSize: '0.62rem' }}>
      {plan}
    </span>
  );
};

const StatusPill = ({ status }: { status: PaymentStatus }) => {
  const config = {
    Paid:    { bg: '#f0fff4', color: '#2f9e44', icon: '✓' },
    Pending: { bg: '#fff8e1', color: '#c89b2a', icon: '⏳' },
    Overdue: { bg: '#fff5f5', color: '#e53e3e', icon: '!' },
  }[status];
  return (
    <span className="px-2 py-1 rounded-pill fw-bold"
      style={{ background: config.bg, color: config.color, fontSize: '0.62rem' }}>
      {config.icon} {status}
    </span>
  );
};

const amountColor = (status: PaymentStatus) =>
  ({ Paid: '#2f9e44', Pending: '#f76707', Overdue: '#e53e3e' }[status]);

const SummaryBar = ({ payments }: { payments: Payment[] }) => {
  const total   = payments.reduce((s, p) => s + p.amount, 0);
  const paid    = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="row g-2 mb-3">
      {[
        { label: 'Total',   value: total,   color: '#1e2d45' },
        { label: 'Paid',    value: paid,    color: '#2f9e44' },
        { label: 'Pending', value: pending, color: '#f76707' },
        { label: 'Overdue', value: overdue, color: '#e53e3e' },
      ].map(item => (
        <div className="col-6 col-md-3" key={item.label}>
          <div className="rounded-3 p-2 text-center"
            style={{ background: '#f8fafc', border: '1px solid #e8ecf0' }}>
            <div style={{ fontSize: '0.6rem', color: '#7a8599', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {item.label}
            </div>
            <div className="fw-bold mt-1" style={{ fontSize: '0.85rem', color: item.color }}>
              PKR {item.value.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PaymentsTable = ({ payments }: Props) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2"
        style={{ borderBottom: '1px solid #e8ecf0' }}>
        <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: '#2f9e44' }} />
          Recent Payments
        </h6>
        <a href="#" className="text-decoration-none fw-bold" style={{ color: '#c89b2a', fontSize: '0.78rem' }}>View all →</a>
      </div>

      <SummaryBar payments={payments} />

      <div>
        {payments.map(payment => (
          <div key={payment.id} className="d-flex align-items-center gap-3 py-3"
            style={{ borderBottom: '1px solid #f0f2f5' }}>
            <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 38, height: 38, background: '#f0f2f5', fontSize: '1rem' }}>
              💳
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fw-semibold" style={{ fontSize: '0.83rem' }}>{payment.organizationName}</div>
              <div style={{ fontSize: '0.7rem', color: '#7a8599' }}>{payment.invoiceNo}</div>
            </div>
            <div className="d-none d-md-block"><PlanPill plan={payment.plan} /></div>
            <div className="d-none d-lg-block text-muted"
              style={{ fontSize: '0.75rem', minWidth: 90, textAlign: 'right' }}>
              {new Date(payment.date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="fw-bold"
              style={{ fontSize: '0.88rem', color: amountColor(payment.status), minWidth: 100, textAlign: 'right' }}>
              PKR {payment.amount.toLocaleString()}
            </div>
            <div style={{ minWidth: 80, textAlign: 'right' }}>
              <StatusPill status={payment.status} />
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-5 text-muted" style={{ fontSize: '0.85rem' }}>💳 No payments found</div>
      )}
    </div>
  </div>
);