import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="contact">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-col">
                        <h4>SRGM</h4>
                        <p>Wholesale distributors in Erode since 2002. Your trusted partner for quality textiles.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/quality">Quality</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>Sri RajaGanapathi Mills</li>
                            <li>+91 94433 20033</li>
                            <li>srirajaganapathimills02@gmail.com</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Our Location</h4>
                        <iframe
                            title="Location Map"
                            src="https://maps.google.com/maps?q=Sri+Rajaganapathi+Mills,+Erode&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%" height="150" style={{ border: 0, borderRadius: '8px' }} allowFullScreen=""
                            loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2026 Sri RajaGanapathi Mills. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
