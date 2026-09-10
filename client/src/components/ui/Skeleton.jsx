import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, className = '', variant = 'rect', count = 1 }) => {
  const elements = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton skeleton-card-image" />
        <div className="skeleton-card-content">
          <div className="skeleton skeleton-card-title" />
          <div className="skeleton skeleton-card-subtitle" />
        </div>
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={`skeleton-row-container ${className}`}>
        <div className="skeleton skeleton-row-title" />
        <div className="skeleton-row-cards">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="skeleton skeleton-row-card" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`skeleton-hero ${className}`}>
        <div className="skeleton skeleton-hero-bg" />
        <div className="skeleton-hero-content">
          <div className="skeleton skeleton-hero-title" />
          <div className="skeleton skeleton-hero-text" />
          <div className="skeleton skeleton-hero-text short" />
          <div className="skeleton-hero-buttons">
            <div className="skeleton skeleton-hero-btn" />
            <div className="skeleton skeleton-hero-btn" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={`skeleton-detail ${className}`}>
        <div className="skeleton skeleton-detail-backdrop" />
        <div className="skeleton-detail-body">
          <div className="skeleton skeleton-detail-poster" />
          <div className="skeleton-detail-info">
            <div className="skeleton skeleton-detail-title" />
            <div className="skeleton skeleton-detail-meta" />
            <div className="skeleton skeleton-detail-overview" />
            <div className="skeleton skeleton-detail-overview short" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {elements.map((i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{
            width: width || '100%',
            height: height || '20px',
            borderRadius: borderRadius || 'var(--radius-md)',
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
