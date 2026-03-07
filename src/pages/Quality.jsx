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

                    {/* Company Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                        {/* Legal & Tax Information */}
                        <div className="company-info-card reveal-fade" style={{ padding: '2rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>
                                Legal Information
                            </h3>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>GST Registration Number</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>[Your GST Number]</p>
                            </div>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>GST Registration Date</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>[Your GST Registration Date]</p>
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
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>[Your Bank Name]</p>
                            </div>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Account Name</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Sri RajaGanapathi Mills</p>
                            </div>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Account Number</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>[Your Bank Account Number]</p>
                            </div>
                            <div style={{ marginBottom: '1.2rem' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>IFSC Code</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>[Your IFSC Code]</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Quality;
