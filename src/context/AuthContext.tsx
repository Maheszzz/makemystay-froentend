import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    role: 'admin' | 'employee';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        const savedRole = localStorage.getItem('admin_role') as User['role'];
        const savedEmail = localStorage.getItem('admin_email');

        if (savedToken && savedRole && savedEmail) {
            setToken(savedToken);
            setUser({ email: savedEmail, role: savedRole });
        }
    }, []);

    const login = (newToken: string, role: string, email: string) => {
        localStorage.setItem('admin_token', newToken);
        localStorage.setItem('admin_role', role);
        localStorage.setItem('admin_email', email);
        setToken(newToken);
        setUser({ email, role: role as User['role'] });
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_email');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
