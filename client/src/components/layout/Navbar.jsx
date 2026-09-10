import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import useDebounce from '../../hooks/useDebounce';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate on debounced search
  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`, { replace: true });
    }
  }, [debouncedQuery, navigate]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchToggle = () => {
    if (searchOpen && searchQuery) {
      setSearchQuery('');
    }
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <div className="navbar__left">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">🎬</span>
            <span className="navbar__logo-text">CineVault</span>
          </Link>

          <ul className={`navbar__links ${mobileMenuOpen ? 'navbar__links--open' : ''}`}>
            <li>
              <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/discover" className={`navbar__link ${isActive('/discover') ? 'navbar__link--active' : ''}`}>
                Discover
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className={`navbar__link ${isActive('/wishlist') ? 'navbar__link--active' : ''}`}>
                My List
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar__right">
          <form className={`navbar__search ${searchOpen ? 'navbar__search--open' : ''}`} onSubmit={handleSearchSubmit}>
            <button type="button" className="navbar__search-btn" onClick={handleSearchToggle} aria-label="Toggle search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="text"
              className="navbar__search-input"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchOpen && searchQuery && (
              <button type="button" className="navbar__search-clear" onClick={() => setSearchQuery('')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </form>

          <Link to="/wishlist" className="navbar__wishlist-btn" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={wishlistCount > 0 ? 'var(--accent)' : 'none'} stroke={wishlistCount > 0 ? 'var(--accent)' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="navbar__wishlist-badge">{wishlistCount}</span>
            )}
          </Link>

          <button
            className={`navbar__hamburger ${mobileMenuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && <div className="navbar__overlay" onClick={() => setMobileMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
