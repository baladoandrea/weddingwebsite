export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">Te esperamos. Marta & Sergio</p>
        <a href="/admin" className="admin-link" title="Acceso Administrador" aria-label="Acceso Administrador">
          <span className="lock-icon" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8V7a5 5 0 0 0-10 0v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="14" r="1" fill="currentColor" />
            </svg>
          </span>
        </a>
      </div>
    </footer>
  );
}