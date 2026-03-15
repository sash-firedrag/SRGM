import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('adminToken');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
