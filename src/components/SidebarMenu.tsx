import { useState, useRef, useEffect } from 'react';

export default function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <div className="sidebar-wrapper" ref={menuRef}>
      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
        title="Menú"
        aria-label="Abrir menú"
      >
        <span className={`ios-menu-icon ${open ? 'open' : ''}`} aria-hidden>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </span>
      </button>
      {open && (
        <nav className="sidebar">
          <a href="/" onClick={handleNavClick}>
            Inicio
          </a>
          <a href="/rsvp" onClick={handleNavClick}>
            Confirmar asistencia
          </a>
          <a href="/info" onClick={handleNavClick}>
            Información
          </a>
          <a href="/gallery" onClick={handleNavClick}>
            Galería
          </a>
          <a href="/coruna" onClick={handleNavClick}>
            Sobre A Coruña
          </a>
        </nav>
      )}
    </div>
  );
}