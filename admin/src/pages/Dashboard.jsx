import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Briefcase, ShoppingBag, Mail, PlusCircle, ExternalLink } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, franchises: 0, orders: 0, messages: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo'))?.token}`
                    }
                };
                const [p, f, o, m] = await Promise.all([
                    axios.get('http://localhost:3000/api/products'),
                    axios.get('http://localhost:3000/api/franchise'),
                    axios.get('http://localhost:3000/api/orders', config),
                    axios.get('http://localhost:3000/api/contact', config)
                ]);
                setStats({
                    products: p.data.length,
                    franchises: f.data.length,
                    orders: o.data.length,
                    messages: m.data.length
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db' }}>
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p>{stats.products}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' }}>
                        <Briefcase size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Franchise Plans</h3>
                        <p>{stats.franchises}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(155, 89, 182, 0.1)', color: '#9b59b6' }}>
                        <ShoppingBag size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p>{stats.orders}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(230, 126, 34, 0.1)', color: '#e67e22' }}>
                        <Mail size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Inquiries</h3>
                        <p>{stats.messages}</p>
                    </div>
                </div>
            </div>
            
            <div className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="btn btn-add" onClick={() => window.location.href='/products'}>
                        <PlusCircle size={18} /> Update Inventory
                    </button>
                    <button className="btn btn-edit" onClick={() => window.location.href='/orders'}>
                        <ExternalLink size={18} /> Review Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
