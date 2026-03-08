import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
    return (
        <>
            {/* Top Info Bar */}
            <div className="top-bar">
                <div className="top-left">
                    <span>📞 Call us: +91 9443320033 | +91 9524020033</span>
                    <span>📍 74,Kovalan Street Erode-638107</span>
                </div>
                <div className="top-right" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <a href="https://wa.me/919443320033" target="_blank" rel="noreferrer" title="WhatsApp Us" style={{ display: 'flex', alignItems: 'center', color: 'inherit', transition: 'color 0.3s' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                        </svg>
                    </a>
                    <a href="mailto:srirajaganapathimills02@gmail.com" title="Email Us" style={{ display: 'flex', alignItems: 'center', color: 'inherit', transition: 'color 0.3s' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                        </svg>
                    </a>
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
