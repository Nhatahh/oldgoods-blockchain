export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="product-card-body">
        <div className="skeleton skeleton-line short"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-box-row">
          <div className="skeleton skeleton-box"></div>
          <div className="skeleton skeleton-box"></div>
        </div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}

export function TxSkeleton() {
  return (
    <div className="tx-item skeleton-card">
      <div className="skeleton skeleton-line short"></div>
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line"></div>
      <div className="skeleton skeleton-line"></div>
    </div>
  );
}
