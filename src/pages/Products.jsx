import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
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
                            >
                                <div className="card-content">
                                    <span className="category-tag">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    {product.features && product.features.length > 0 && (
                                        <ul>
                                            {product.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Gallery */}
            <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={() => setSelectedProduct(null)}>
                <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close modal">&times;</button>

                    {selectedProduct && (
                        <div className="product-details-container">
                            {/* Slideshow */}
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="product-slideshow">
                                    <div className="slideshow-wrapper">
                                        <img
                                            src={selectedProduct.images[currentSlideIndex].startsWith('http') ? selectedProduct.images[currentSlideIndex] : `http://localhost:5000${selectedProduct.images[currentSlideIndex]}`}
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
                                <p className="product-description">
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
