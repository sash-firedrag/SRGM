import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SlideShow from '../components/SlideShow';

const Home = () => {
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal, .reveal-fade');
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const elementVisible = 100;
            reveals.forEach((reveal) => {
                const elementTop = reveal.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    reveal.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
        return () => window.removeEventListener('scroll', revealOnScroll);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Sri RajaGanapathi Mills (SRGM)</h1>
                        <p>Grey Merchants & Wholesale Distributors in the heart of Erode City.<br />Providing quality Shirting, Dhoties, Lungies, & Towels since 2002.</p>
                        <Link to="/products" className="btn">Explore Collections</Link>
                    </div>
                </div>
            </section>

            <SlideShow />

            {/* About Us Section */}
            <section className="about reveal" id="about">
                <div className="container">
                    <h2 className="section-title">About SRGM</h2>
                    <p>Situated in the heart of Erode city, Sri RajaGanapathi Mills (SRGM) is a leading name in the textile industry. Established in 2002, we have over 24 years of experience as Grey Merchants and Wholesale Distributors.</p>
                    <p>We provide a wide range of quality products including shirting materials (cotton & mixed varieties), dhoties, lungies, and towels. Our commitment to quality has earned us the trust of retailers and customers alike.</p>
                    <Link to="/about" className="btn">Learn More &gt;</Link>
                    <div className="stats">
                        <div className="stat-item">
                            <h3>24+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div className="stat-item">
                            <h3>100%</h3>
                            <p>Quality Fabrics</p>
                        </div>
                        <div className="stat-item">
                            <h3>2002</h3>
                            <p>Established Year</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Product Range Section */}
            <section className="product-range reveal" style={{ backgroundColor: '#fff' }}>
                <div className="container">
                    <h2 className="section-title">Our Product Range</h2>
                    <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                        Discover our diverse range of quality textiles, tailored for comfort and tradition.
                    </p>
                    <div className="product-grid">
                        {/* Shirting Materials */}
                        <article className="product-card">
                            <div className="card-content">
                                <span className="category-tag">Apparel Fabric</span>
                                <h3>Shirting Materials</h3>
                                <p>Wide variety of <strong>Shirting Materials</strong> in <strong>Pure Cotton</strong> and <strong>Mixed Varieties</strong>. Perfect for formal and casual wear.</p>
                                <ul>
                                    <li>Cotton & Mixed Blends</li>
                                    <li>Durable & Comfortable</li>
                                    <li>Various Designs</li>
                                </ul>
                            </div>
                        </article>
                        {/* Dhoties */}
                        <article className="product-card">
                            <div className="card-content">
                                <span className="category-tag">Traditional Wear</span>
                                <h3>Dhoties</h3>
                                <p>Premium collection of <strong>Dhoties</strong>. Available in various borders and styles for festivals and daily use.</p>
                                <ul>
                                    <li>Traditional Borders</li>
                                    <li>Premium Cotton</li>
                                    <li>Elegant Look</li>
                                </ul>
                            </div>
                        </article>
                        {/* Lungies */}
                        <article className="product-card">
                            <div className="card-content">
                                <span className="category-tag">Comfort Wear</span>
                                <h3>Lungies</h3>
                                <p><strong>Lungies</strong> designed for maximum comfort. Available in vibrant colors and checks for daily wear.</p>
                                <ul>
                                    <li>Breathable Fabric</li>
                                    <li>Vibrant Colors</li>
                                    <li>Long-Lasting</li>
                                </ul>
                            </div>
                        </article>
                        {/* Towels */}
                        <article className="product-card">
                            <div className="card-content">
                                <span className="category-tag">Essentials</span>
                                <h3>Towels</h3>
                                <p>Soft, absorbent, and durable <strong>Towels</strong>. High-quality cotton gentle on the skin.</p>
                                <ul>
                                    <li>100% Cotton</li>
                                    <li>High Absorbency</li>
                                    <li>Various Sizes</li>
                                </ul>
                            </div>
                        </article>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link to="/products" className="btn">View All Details</Link>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="location-section reveal" style={{ backgroundColor: 'var(--bg-color)' }}>
                <div className="container">
                    <h2 className="section-title">Visit Us</h2>
                    <div className="map-container reveal-fade">
                        <iframe
                            title="Location Map"
                            src="https://maps.google.com/maps?q=Sri+Rajaganapathi+Mills,+Erode&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
