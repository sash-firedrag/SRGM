import { API_BASE_URL } from '../config';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const modalContentRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/products`);
                setProducts(res.data.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setCurrentSlideIndex(0);
            // Reset scroll position of modal content
            if (modalContentRef.current) {
                modalContentRef.current.scrollTo(0, 0);
            }
        }
    }, [selectedProduct]);

    const filteredProducts = products.filter(product => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (product.name && product.name.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query))
        );
    });

    const nextSlide = (e) => {
        e.stopPropagation();
        if (selectedProduct && selectedProduct.images) {
            setCurrentSlideIndex((prev) => (prev + 1) % selectedProduct.images.length);
        }
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        if (selectedProduct && selectedProduct.images) {
            setCurrentSlideIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
        }
    };

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

    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) {
            if (url.includes('mega.nz')) {
                return `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
            }
            return url;
        }
        return `${API_BASE_URL}${url}`;
    };

    return (
        <section className="products-preview products-page reveal">
            <div className="container">
                <h2 className="section-title">Our Collections</h2>
                <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem', color: '#666' }}>
                    Discover our diverse range of products, including shirting materials, dhoties, lungies, and towels,
                    suited for all your needs.
                </p>

                <div className="product-filter-container">
                    <input
                        type="text"
                        placeholder="Search products by name, category, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="product-search-input"
                    />
                </div>

                <div className="product-grid">
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '3rem' }}>Loading products...</div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '3rem', color: '#666' }}>No products available yet. Check back soon!</div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '3rem', color: '#666' }}>No products match your search.</div>
                    ) : (
                        filteredProducts.map((product) => (
                            <article
                                key={product._id}
                                className={`product-card ${product.images && product.images.length > 0 ? 'interactive' : ''}`}
                                onClick={() => product.images && product.images.length > 0 && setSelectedProduct(product)}
                                style={{ display: 'flex', flexDirection: 'column' }}
                            >
                                {product.images && product.images.length > 0 && (
                                    <div className="card-image" style={{ width: '100%', height: '220px', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
                                        <img
                                            src={getImageUrl(product.images[0])}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div className="card-content" style={{ flexGrow: 1, padding: '1.5rem' }}>
                                    <span className="category-tag">{product.category}</span>
                                    <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {product.description.length > 110 ? product.description.substring(0, 110) + '...' : product.description}
                                    </p>
                                    {product.features && product.features.length > 0 && (
                                        <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '500' }}>
                                            ✓ {product.features.length} Premium Features
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #eee', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem', backgroundColor: '#fafafa' }}>
                                    View Product Details
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Gallery */}
            <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={() => setSelectedProduct(null)}>
                <div 
                    ref={modalContentRef}
                    className="modal-content product-modal" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">&times;</button>

                    {selectedProduct && (
                        <div className="product-details-container">
                            {/* Slideshow */}
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="product-slideshow">
                                    <div className="slideshow-wrapper">
                                        <img
                                            src={getImageUrl(selectedProduct.images[currentSlideIndex])}
                                            alt={`${selectedProduct.name} view ${currentSlideIndex + 1}`}
                                            className="active-slide"
                                            style={{ objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                        />
                                        {selectedProduct.images.length > 1 && (
                                            <>
                                                <button className="slide-btn prev-btn" onClick={prevSlide}>&#10094;</button>
                                                <button className="slide-btn next-btn" onClick={nextSlide}>&#10095;</button>
                                            </>
                                        )}
                                    </div>
                                    {selectedProduct.images.length > 1 && (
                                        <div className="slideshow-dots">
                                            {selectedProduct.images.map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`dot ${currentSlideIndex === idx ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Details */}
                            <div className="product-info">
                                <span className="category-tag">{selectedProduct.category}</span>
                                <h2>{selectedProduct.name}</h2>
                                <p className="product-description" style={{ marginBottom: '1rem' }}>
                                    {selectedProduct.description}
                                </p>

                                {selectedProduct.features && selectedProduct.features.length > 0 && (
                                    <ul className="product-specs">
                                        {selectedProduct.features.map((feature, idx) => (
                                            <li key={idx} style={{ padding: '0.4rem 0', borderBottom: '1px dashed #eee' }}>{feature}</li>
                                        ))}
                                        <li style={{ padding: '0.4rem 0', borderBottom: '1px dashed #eee', fontWeight: 'bold' }}>
                                            Minimum Order: {selectedProduct.minOrderQuantity || 1} meters
                                        </li>
                                    </ul>
                                )}

                                {(!selectedProduct.features || selectedProduct.features.length === 0) && (
                                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                                        Minimum Order: {selectedProduct.minOrderQuantity || 1} meters
                                    </p>
                                )}

                                <div className="action-buttons" style={{ marginTop: '2rem' }}>
                                    <Link to={`/enquiry?item=${encodeURIComponent(selectedProduct.name)}&moq=${selectedProduct.minOrderQuantity || 1}`} className="btn primary-btn">
                                        ✉️ Enquire Now
                                    </Link>
                                    <a href={`https://wa.me/919443320033?text=Hi, I would like to enquire about the ${encodeURIComponent(selectedProduct.name)}. (Minimum Order: ${selectedProduct.minOrderQuantity || 1} meters)`} target="_blank" rel="noreferrer" className="btn whatsapp-btn">
                                        💬 WhatsApp Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Products;
