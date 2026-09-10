import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🎬 CineVault</span>
          <p className="footer__tagline">Discover your next favorite movie</p>
        </div>
        <div className="footer__links">
          <div className="footer__col">
            <h4>Explore</h4>
            <a href="/">Home</a>
            <a href="/discover">Discover</a>
            <a href="/wishlist">My List</a>
          </div>
          <div className="footer__col">
            <h4>Data</h4>
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB API</a>
            <span className="footer__attribution">
              Powered by TMDB
            </span>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} CineVault. Built for learning purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
