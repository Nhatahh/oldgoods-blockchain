export function ProductCardSkeleton() {
  return (
    <div className="og-card og-skeleton-card">
      <div className="og-skeleton-img"></div>
      <div className="og-card__body">
        <div className="og-skeleton-text og-skeleton-text--title"></div>
        <div className="og-skeleton-text"></div>
        <div className="og-skeleton-text"></div>
        <div className="og-skeleton-row">
          <div className="og-skeleton-box"></div>
          <div className="og-skeleton-box"></div>
        </div>
        <div className="og-skeleton-btn"></div>
      </div>
    </div>
  );
}

export function TxSkeleton() {
  return (
    <div className="og-tx-card og-skeleton-card">
      <div className="og-skeleton-text og-skeleton-text--title"></div>
      <div className="og-skeleton-text"></div>
      <div className="og-skeleton-text"></div>
      <div className="og-skeleton-text"></div>
    </div>
  );
}
