import React, { useState, useEffect } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendMail = (e) => {
        e.preventDefault();
        const { name, email, subject, message } = formData;
        const mailtoLink = `mailto:srirajaganapathimills02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;

        setTimeout(() => {
            alert('Mail draft created! Please check your email app to send it.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 500);
    };

    return (
        <>
            {/* Page Header */}
            <section className="page-header reveal">
                <div className="container">
                    <h1>Get in Touch</h1>
                    <p>We are here to assist you with your textile manufacturing needs and wholesale inquiries.</p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container reveal">
                    <div className="contact-wrapper">

                        {/* Contact Info */}
                        <div className="contact-info-card">
                            <h2>Reach Out to Us</h2>
                            <p className="contact-subtext">
                                Have any questions or wholesale inquiries? We'd love to hear from you.
                                Get in touch directly or visit our office in Erode.
                            </p>

                            <div className="info-list">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div className="info-text">
                                        <h3>Office Address</h3>
                                        <p>Sri RajaGanapathi Mills (SRGM),<br />Heart of Erode City,<br />Erode, Tamil Nadu, India</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                    </div>
                                    <div className="info-text">
                                        <h3>Mobile Number</h3>
                                        <p>+91 94433 20033</p>
                                        <p>+91 95240 20033</p>
                                    </div>
                                </div>


                                <div className="info-item">
                                    <div className="info-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                    </div>
                                    <div className="info-text">
                                        <h3>Business Hours</h3>
                                        <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                                        <span className="badge closed">Sunday: Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-card">
                            <h2>Send us a Message</h2>
                            <form className="modern-form" onSubmit={handleSendMail}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input type="text" id="name" name="name" placeholder="Prakash" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" name="email" placeholder="prakash@example.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input type="text" id="subject" name="subject" placeholder="Wholesale Inquiry" value={formData.subject} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows="5" placeholder="Tell us about your requirements..." value={formData.message} onChange={handleChange} required></textarea>
                                </div>

                                <button type="submit" className="modern-submit-btn">
                                    Send Message
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="map-wrapper reveal-fade">
                        <div className="map-header">
                            <h2>Our Location</h2>
                            <p>Find us easily in the heart of Erode.</p>
                        </div>
                        <div className="map-container">
                            <iframe
                                title="Location Map"
                                src="https://maps.google.com/maps?q=Sri+Rajaganapathi+Mills,+Erode&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
