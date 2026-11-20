
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Users,
  Swords,
  LogOut,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ team, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/players', label: 'Player stats', icon: Users },
    { to: '/matches', label: 'Match history', icon: Swords },
    { to: '/team', label: 'Team profile', icon: Shield },
  ];

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'mobile-open' : ''}`}>

        {/* Logo and mobile burger button */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-mark">
              <Activity size={21} />
            </div>
            <span>
              ARENA<span className="brand-muted">STATS</span>
            </span>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="side-label">WORKSPACE</div>

        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Team details and logout */}
        <div className="sidebar-bottom">
          <div className="mini-team">
            {team?.logo ? (
              <img src={`http://localhost:5000${team.logo}`} alt="Team logo" />
            ) : (
              <div className="team-avatar">
                <Shield size={18} />
              </div>
            )}

            <div>
              <strong>{team?.name || 'Your team'}</strong>
              <small>Team workspace</small>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span></span>
            <b></b>
          </div>

          <div className="user-chip">
            <div className="user-avatar">
              {user?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <strong>{user?.name}</strong>
              <small>Team manager</small>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
