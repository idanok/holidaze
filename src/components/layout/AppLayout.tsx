import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isLoggedIn, isVenueManager } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-[#E8614A]' : 'text-white/70 hover:text-white'
    }`;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FAF6F0]">

      {/* ── HEADER ── */}
      <header className="bg-[#1B2B40] sticky top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6 h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="font-serif text-[26px] font-bold text-white tracking-wide">
            Holida<span className="text-[#E8614A]">ze</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink to="/venues" className={navLinkClass}>Venues</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/destinations" className={navLinkClass}>Destinations</NavLink>
            {isLoggedIn && isVenueManager && (
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
            )}
          </nav>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#E8614A] text-white text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-[#d4553f] transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-white/70 hover:text-[#E8614A] transition-colors"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-medium px-5 py-3 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <>
            <button
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute top-[72px] left-0 right-0 z-50 bg-[#1B2B40] border-t border-white/10 shadow-xl lg:hidden">
              <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-5">
                <NavLink to="/venues" className={navLinkClass} onClick={() => setMenuOpen(false)}>Venues</NavLink>
                <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
                <NavLink to="/destinations" className={navLinkClass} onClick={() => setMenuOpen(false)}>Destinations</NavLink>

                {isLoggedIn && isVenueManager && (
                  <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                )}

                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Log In</Link>
                    <Link to="/register" className="bg-[#E8614A] text-white text-sm font-semibold px-6 py-3.5 rounded-lg text-center hover:bg-[#d4553f] transition-colors" onClick={() => setMenuOpen(false)}>Register</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="text-sm font-medium text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>{user?.name}</Link>
                    <button onClick={handleLogout} className="text-sm font-medium text-white/70 hover:text-white text-left">Log Out</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1B2B40] border-t border-white/10 w-full">
        <div className="relative mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-serif text-xl font-bold text-white">
            Holida<span className="text-[#E8614A]">ze</span>
          </Link>
          <p className="text-sm text-white/40 text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            © 2026 Holidaze. Built for Noroff Project Exam 2.
          </p>
          <div />
        </div>
      </footer>

    </div>
  );
}