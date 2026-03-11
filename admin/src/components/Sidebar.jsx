import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Briefcase, Mail, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BRANDING from '../branding';
import logo from '../assets/logo.png';
import InstallApp from './InstallApp';

const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <img src={logo} alt={BRANDING.logoAlt} style={{ height: '80px', objectFit: 'contain' }} />
                <h2 style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{BRANDING.appName} ADMIN</h2>
            </div>
            <ul className="sidebar-links">
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Package size={20} /> Manage Products
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/franchise" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Briefcase size={20} /> Manage Franchise
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                        <ShoppingBag size={20} /> Manage Orders
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/messages" className={({ isActive }) => isActive ? 'active' : ''}>
                        <Mail size={20} /> Manage Messages
                    </NavLink>
                </li>
                <li style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <InstallApp />
                    <button onClick={logout} className="logout-btn" style={{ width: '100%', background: 'transparent', border: '1px solid #333', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
