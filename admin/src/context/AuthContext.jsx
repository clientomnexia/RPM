import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('adminInfo')) || null);

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:3000/api/users/login', { email, password });
        localStorage.setItem('adminInfo', JSON.stringify(data));
        setAdmin(data);
    };

    const logout = () => {
        localStorage.removeItem('adminInfo');
        setAdmin(null);
    };

    // Global axios header for auth
    useEffect(() => {
        if (admin && admin.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [admin]);

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
