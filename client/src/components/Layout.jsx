import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trees, LogOut, Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: Trees }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageName = location.pathname === '/' ? 'Overview' : 'Projects';

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Leaf size={22} /></div><span>Canopy</span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {nav.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <item.icon size={18} strokeWidth={1.9} /><span>{item.label}</span>
        </NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="user-chip"><div className="avatar">{user?.name?.[0] || 'C'}</div><div className="user-meta"><strong>{user?.name || 'Canopy user'}</strong><small>{user?.role || 'Viewer'}</small></div></div>
        <button className="logout-btn" onClick={logout}><LogOut size={17} /> Sign out</button>
      </div>
    </aside>
    {mobileOpen && <button aria-label="Close navigation" className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
        <div><span className="eyebrow">ENVIRONMENTAL IMPACT</span><h1>{pageName}</h1></div>
        <div className="topbar-right"><span className="online-dot" /> <span>Workspace active</span></div>
      </header>
      <div className="page-content"><Outlet /></div>
      <Footer />
    </main>
  </div>;
}
