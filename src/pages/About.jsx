import React, { useEffect } from 'react';

const About = () => {
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
            {/* Page Header */}
            <section className="page-header reveal">
                <div className="container">
                    <h1>About SRGM</h1>
                    <p>Grey Merchants & Wholesale Distributors in Erode City since 2002</p>
                </div>
            </section>

            {/* About Content */}
            <section className="section-padding reveal" style={{ marginBottom: '4rem' }}>
                <div className="container">
                    <div className="about-content">
                        {/* Image/Placeholder */}
                        <div className="about-image reveal-fade">
                            <div className="placeholder">
                                <img src="/SRGM_LOGO-removebg-preview.png" style={{ width: '35%' }} alt="SRGM Logo" />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="about-text">
                            <h2 className="section-title" style={{ textAlign: 'left' }}>Who We Are</h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Sri RajaGanapathi Mills (SRGM) was established in the year <strong>2002</strong>.
                                We are a prominent name in Erode, operating as Grey Merchants and Wholesale Distributors in
                                textile products.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                With <strong>24+ years of experience</strong> in this field, we have garnered a reputation for
                                reliability and quality.
                                Located in the heart of Erode city, we serve a vast network of clients with varied textile
                                needs.
                            </p>
                        </div>
                    </div>

                    {/* Our Product Range Section */}
                    <div className="product-range-section reveal-fade" style={{ marginTop: '4rem', marginBottom: '2rem', padding: '2rem 3rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '2rem' }}>Our Product Range</h2>
                        <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>•</span>
                                <strong>Shirting Materials:</strong> A wide variety of Pure Cotton and Mixed Varieties perfect for formal and casual wear.
                            </li>
                            <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>•</span>
                                <strong>Dhoties:</strong> Premium collection of Dhoties available with various traditional borders and styles.
                            </li>
                            <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>•</span>
                                <strong>Lungies:</strong> Designed for maximum comfort, available in vibrant colors and checks for daily wear.
                            </li>
                            <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>•</span>
                                <strong>Towels:</strong> Soft, highly absorbent, and durable 100% cotton towels that are gentle on the skin.
                            </li>
                        </ul>
                    </div>

                    {/* Stats */}
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

            {/* Map Section */}
            <section className="location-section reveal" style={{ padding: '4rem 0' }}>
                <div className="container">
                    <h2 className="section-title">Visit Us</h2>
                    <div className="map-container reveal-fade"
                        style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
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

export default About;
