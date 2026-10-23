import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Receipt,
  Users,
} from 'lucide-react';

const dues = [
  {
    name: 'Departmental dues',
    organisation: 'Computer Science',
    amount: '₦5,000',
    status: 'Payment due',
    paid: false,
  },
  {
    name: 'Faculty dues',
    organisation: 'Faculty of Science',
    amount: '₦3,000',
    status: 'Paid',
    paid: true,
  },
];

export function DashboardPreview() {
  return (
    <div className="dashboard-preview" aria-label="Illustration of the Heightt student dashboard">
      <aside className="preview-sidebar" aria-hidden="true">
        <strong>heightt.</strong>
        <span className="active"><LayoutDashboard /> Overview</span>
        <span><FileText /> Payments</span>
        <span><Receipt /> Receipts</span>
        <span><Users /> Organisations</span>
      </aside>

      <div className="preview-main">
        <header>
          <div><strong>Good morning, Ayo</strong><small>300 Level · Computer Science</small></div>
          <span className="avatar">AB</span>
        </header>

        <div className="metric-grid">
          <article><span>Outstanding <AlertCircle /></span><strong>₦5,000</strong><small>1 due remaining</small></article>
          <article><span>Paid this session <CheckCircle2 /></span><strong>₦8,000</strong><small>2 completed payments</small></article>
          <article><span>Receipts <Receipt /></span><strong>2</strong><small>Available anytime</small></article>
        </div>

        <section className="preview-table">
          <div className="preview-table-heading"><strong>Your dues</strong><span>2026/2027 session</span></div>
          {dues.map((due) => (
            <div className="preview-row" key={due.name}>
              <span className="due-mark"><FileText /></span>
              <span className="due-copy"><strong>{due.name}</strong><small>{due.organisation}</small></span>
              <strong className="due-amount">{due.amount}</strong>
              <span className={due.paid ? 'status-paid' : 'status-pending'}>{due.status}</span>
            </div>
          ))}
        </section>
        <p className="preview-disclaimer">Illustrative dashboard data</p>
      </div>
    </div>
  );
}

export function CollectionPreview() {
  return (
    <div className="collection-preview" aria-label="Illustration of organisation collection reporting">
      <div className="collection-heading">
        <div><strong>Departmental dues</strong><small>Computer Science · 2026/2027</small></div>
        <span>Active</span>
      </div>
      <div className="collection-metrics">
        <div><small>Collected</small><strong>₦320,000</strong></div>
        <div><small>Members paid</small><strong>64 / 80</strong></div>
      </div>
      <div className="progress-track"><span /></div>
      <div className="collection-footer"><span>80% complete</span><span>16 payments remaining</span></div>
    </div>
  );
}
