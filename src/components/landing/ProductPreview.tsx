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
