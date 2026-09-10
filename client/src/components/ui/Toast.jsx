import { useEffect, useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import './Toast.css';

const Toast = () => {
  const { toastMessage, clearToast } = useWishlist();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearToast, 300); // Wait for exit animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className={`toast toast--${toastMessage.type} ${visible ? 'toast--visible' : 'toast--hidden'}`}>
      <div className="toast__icon">
        {toastMessage.type === 'success' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {toastMessage.type === 'error' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {toastMessage.type === 'info' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <circle cx="12" cy="8" r="0.5" fill="currentColor" />
          </svg>
        )}
      </div>
      <span className="toast__text">{toastMessage.text}</span>
      <button className="toast__close" onClick={() => { setVisible(false); setTimeout(clearToast, 300); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
