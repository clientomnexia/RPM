import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config';

/**
 * AuthContext — Customer-side Google OAuth authentication.
 * Stores user data (name, email, avatar, token) in localStorage.
 * Provides loginWithGoogle(), logout(), and user state.
 */
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('rpmUser');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    /**
     * Sends Google credential to backend for verification.
     * Backend returns user data + JWT token.
     */
    const loginWithGoogle = useCallback(async (credentialResponse) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/google`, {
                credential: credentialResponse.credential,
            });

            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                token: data.token,
            };

            localStorage.setItem('rpmUser', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Google login failed:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('rpmUser');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
