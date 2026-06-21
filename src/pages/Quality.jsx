import React, { useEffect } from 'react';

const Quality = () => {
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
                    <h1>Quality & Details</h1>
                    <p>Our commitment to excellence and authentic business practices</p>
                </div>
            </section>

            <section className="section-padding reveal" style={{ marginBottom: '4rem' }}>
                <div className="container">

                    {/* Quality Overview */}
                    <div className="quality-overview reveal-fade" style={{ marginBottom: '4rem', padding: '2rem 3rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Quality Assurance</h2>
                        <p style={{ marginBottom: '1rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
                            At <strong>Sri RajaGanapathi Mills (SRGM)</strong>, quality is not just a standard—it is our legacy.
                            We strictly enforce high-quality control measures from yarn procurement to the final weaving process.
                        </p>
                        <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '1.05rem', lineHeight: '1.8' }}>
                            <li style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold' }}>•</span>
                                100% Genuine and durable fabrics.
                            </li>
                            <li style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold' }}>•</span>
                                Rigorous testing for color fastness and shrinkage.
                            </li>
                            <li style={{ marginBottom: '0.8rem', paddingLeft: '1.5rem', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--secondary-color)', fontWeight: 'bold' }}>•</span>
                                Consistently delivering premium finishes across all product lines.
                            </li>
                        </ul>
                    </div>

                    {/* MSME Recognition Section */}
                    <div className="msme-recognition reveal-fade" style={{ marginBottom: '4rem', padding: '2rem 3rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ flex: '0 0 auto', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', borderRadius: '12px', padding: '15px' }}>
                            <img
                                src="/msme-logo.png"
                                alt="MSME Recognised Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/MSME_logo_%28colour%29.svg/512px-MSME_logo_%28colour%29.svg.png';
                                }}
                            />
                        </div>
                        <div style={{ flex: '1 1 300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--primary-color)' }}>MSME Recognised</h3>
                                <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified</span>
                            </div>
                            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                                Sri RajaGanapathi Mills (SRGM) is proud to be formally recognised by the <strong>Ministry of Micro, Small & Medium Enterprises (MSME)</strong>, Government of India. This certification reflects our authenticity, operational excellence, and commitment to delivering the highest quality in the textile industry.
                            </p>
                        </div>
                    </div>

                    {/* Company Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Legal & Tax Information */}
                        <div className="company-info-card reveal-fade" style={{ padding: '2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>
                                Legal Information
                            </h3>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>GST Registration Number</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>33AAVFS3126L1ZS</p>
                            </div>
            
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>Company Address</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.5' }}>
                                    74, Kovalan Street<br />
                                    Erode - 638107<br />
                                    Tamil Nadu, India
                                </p>
                            </div>
                        </div>

                        {/* Banking Information */}
                        <div className="company-info-card reveal-fade" style={{ padding: '2rem', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                                Banking Details
                            </h3>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Bank Name</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Punjab National Bank</p>
                            </div>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Account Name</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Sri RajaGanapathi Mills</p>
                            </div>
                        </div>

                        {/* Customization Details */}
                        <div className="company-info-card reveal-fade" style={{ padding: '2rem', backgroundColor: '#f8fdf9', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>
                                Customization Services
                            </h3>
                            <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                                <li style={{ marginBottom: '1rem', paddingLeft: '1.8rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--primary-color)', fontWeight: 'bold' }}>1.</span>
                                    We provide customization in folding the cloth, like 40-meters cutting, etc.
                                </li>
                                <li style={{ marginBottom: '1rem', paddingLeft: '1.8rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--primary-color)', fontWeight: 'bold' }}>2.</span>
                                    We can provide fabrics with or without screening based on your requirements.
                                </li>
                                <li style={{ marginBottom: '1rem', paddingLeft: '1.8rem', position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 0, color: 'var(--primary-color)', fontWeight: 'bold' }}>3.</span>
                                    Packaging is done with the utmost care, and high-quality packaging materials are used.
                                </li>
                            </ul>
                            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e8f4ea', borderRadius: '8px', borderLeft: '4px solid var(--secondary-color)' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary-color)', fontWeight: '500' }}>
                                    ✨ A custom cloth can also be printed and delivered (Sample needed).
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Quality;
