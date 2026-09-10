import './ErrorState.css';

const ErrorState = ({ message = 'Something went wrong', onRetry, fullPage = false }) => {
  return (
    <div className={`error-state ${fullPage ? 'error-state--full' : ''}`}>
      <div className="error-state__icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <h3 className="error-state__title">Oops!</h3>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
