import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Enquiry = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        item: '',
        quantity: 1,
        requirements: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [minQuantity, setMinQuantity] = useState(1);

    useEffect(() => {
        // Check if we have an item passed in the URL, e.g. ?item=Traditional%20Dhoties&moq=50
        const params = new URLSearchParams(location.search);
        const itemParam = params.get('item');
        const moqParam = params.get('moq');
        
        let initialQuantity = 1;
        if (moqParam) {
            const moq = parseInt(moqParam, 10);
            if (!isNaN(moq) && moq > 0) {
                setMinQuantity(moq);
                initialQuantity = moq;
            }
        }

        setFormData(prev => ({ 
            ...prev, 
            item: itemParam || prev.item,
            quantity: initialQuantity > prev.quantity ? initialQuantity : prev.quantity
        }));
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'quantity') {
            // Prevent taking value lower than minimum if they try to type it manually
            // But allow temporary 'empty' or early typing state until onBlur
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleQuantityBlur = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < minQuantity) {
            setFormData(prev => ({ ...prev, quantity: minQuantity }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('http://localhost:5000/api/enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Enquiry submitted successfully! We will contact you soon.' });
                setFormData({ name: '', email: '', phone: '', item: '', quantity: 1, requirements: '' });

                // We won't redirect immediately to allow them to read the success message.
                // But we will reset the form in the background.
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to submit enquiry' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An error occurred. Please make sure the backend server is running.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="enquiry-page reveal active" style={{ padding: '6rem 0 4rem', minHeight: '70vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="page-header" style={{ padding: '3rem 0', marginBottom: '3rem', borderRadius: '15px' }}>
                    <h1>Enquire Now</h1>
                    <p>Looking to purchase our products? Fill in your details and we will reach out to you shortly!</p>
                </div>

                {status.type === 'success' ? (
                    <div className="success-container" style={{
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        backgroundColor: '#f8fdf9',
                        border: '1px solid #c3e6cb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 style={{ color: '#155724', marginBottom: '1rem', fontSize: '1.5rem' }}>Successfully Submitted!</h3>
                        <p style={{ color: '#333', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            Thank you for reaching out to us. We have received your enquiry for <strong>{formData.item || 'our products'}</strong> and our team will contact you shortly using the phone number you provided.
                        </p>
                        <button
                            onClick={() => {
                                setStatus({ type: '', message: '' });
                                navigate('/products');
                            }}
                            className="btn primary-btn"
                            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                        >
                            Return to Products
                        </button>
                    </div>
                ) : (
                    <div className="contact-wrapper" style={{ boxShadow: 'var(--shadow-lg)' }}>
                        <div className="contact-form-card" style={{ width: '100%', padding: '4rem' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '2rem', fontSize: '2rem' }}>
                                Your Details
                            </h2>

                            {status.type === 'error' && (
                                <div className={`alert ${status.type}`} style={{
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8d7da',
                                    color: '#721c24',
                                    border: '1px solid #f5c6cb'
                                }}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="modern-form">
                                <div className="form-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your email address"
                                        />
                                    </div>

                                    <div className="form-group" style={{ flex: '1 1 200px' }}>
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div className="form-row" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div className="form-group" style={{ flex: '2 1 300px' }}>
                                        <label htmlFor="item">Order Item *</label>
                                        <input
                                            type="text"
                                            id="item"
                                            name="item"
                                            value={formData.item}
                                            onChange={handleChange}
                                            required
                                            placeholder="Product you are interested in"
                                        />
                                    </div>

                                    <div className="form-group" style={{ flex: '1 1 100px' }}>
                                        <label htmlFor="quantity">Quantity (in meters) *</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            onBlur={handleQuantityBlur}
                                            min={minQuantity}
                                            required
                                        />
                                        {minQuantity > 1 && <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>Minimum: {minQuantity} meters</small>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="requirements">Additional Requirements / Message</label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="E.g., specific colors, sizes, or custom requests"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="modern-submit-btn"
                                    disabled={isSubmitting}
                                    style={{
                                        opacity: isSubmitting ? 0.7 : 1,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Enquiry;
