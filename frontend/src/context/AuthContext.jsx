import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    auth 
} from '../firebase';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    avatar: firebaseUser.photoURL,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithFirebase = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // We don't necessarily need to call the backend if the user said "Backend as is"
            // but if the backend expects a token for orders, we might need to handle that.
            return result.user;
        } catch (error) {
            console.error("Firebase login failed:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, loginWithFirebase, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
