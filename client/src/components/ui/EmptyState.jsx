import './EmptyState.css';

const EmptyState = ({ title = 'No results found', message = 'Try adjusting your search or filters.', icon }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon || (
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
};

export default EmptyState;
