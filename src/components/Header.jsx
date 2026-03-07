import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
    return (
        <>
            {/* Top Info Bar */}
            <div className="top-bar">
                <div className="top-left">
                    <span>📞 Call us: +91 9443320033</span>
                    <span>📍 74,Kovalan Street Erode-638107</span>
                </div>
                <div className="top-right">
                    <a href="#">WhatsApp</a>
                    <a href="#">Gmail</a>
                    <a href="#">Facebook</a>
                    <a href="#">Instagram</a>
                </div>
            </div>

            {/* Header */}
            <header>
                <div className="container">
                    <nav>
                        <img src="/SRGM_LOGO-removebg-preview.png" style={{ width: '10%' }} alt="SRGM Logo" />
                        <Link to="/" className="logo">Sri RajaGanapathi Mills</Link>
                        <div className="nav-links">
                            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Our Products</NavLink>
                            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
                            <NavLink to="/quality" className={({ isActive }) => isActive ? "active" : ""}>Quality</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink>
                        </div>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
