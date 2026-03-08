import React, { useEffect, useState } from 'react';

const Products = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const dhotiesImages = [
        '/Dhoties img-1.jpeg',
        '/Dhoties img-2.jpeg',
        '/Dhoties img-3.jpeg',
        '/Dhoties img-4.jpeg',
        '/Dhoties img-5.jpeg'
    ];

    useEffect(() => {
        if (selectedCategory) {
            setCurrentSlideIndex(0);
        }
    }, [selectedCategory]);

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentSlideIndex((prev) => (prev + 1) % dhotiesImages.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentSlideIndex((prev) => (prev === 0 ? dhotiesImages.length - 1 : prev - 1));
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

                <div className="product-grid">
                    {/* Shirting Materials */}
                    <article className="product-card">
                        <div className="card-content">
                            <span className="category-tag">Apparel Fabric</span>
                            <h3>Shirting Materials</h3>
                            <p>
                                We offer a wide variety of <strong>Shirting Materials</strong> available in both
                                <strong>Pure Cotton</strong> and other <strong>Mixed Varieties</strong>. Perfect for formal wear, uniforms, and casual attire, providing comfort and style.
                            </p>
                            <ul>
                                <li>Cotton & Mixed Blends</li>
                                <li>Durable & Comfortable</li>
                                <li>Various Designs Available</li>
                            </ul>
                        </div>
                    </article>

                    {/* Dhoties */}
                    <article className="product-card interactive" onClick={() => setSelectedCategory('dhoties')}>
                        <div className="card-content">
                            <span className="category-tag">Traditional Wear</span>
                            <h3>Dhoties</h3>
                            <p>
                                Embrace tradition with our premium collection of <strong>Dhoties</strong>.
                                Available in various borders and styles, suitable for festivals, weddings, and daily use.
                            </p>
                            <ul>
                                <li>Traditional & Fancy Borders</li>
                                <li>Premium Cotton Quality</li>
                                <li>Elegant Look</li>
                            </ul>
                        </div>
                    </article>

                    {/* Lungies */}
                    <article className="product-card">
                        <div className="card-content">
                            <span className="category-tag">Comfort Wear</span>
                            <h3>Lungies</h3>
                            <p>
                                Our range of <strong>Lungies</strong> is designed for maximum comfort and durability.
                                Available in vibrant colors and checks, they are an essential part of daily wear.
                            </p>
                            <ul>
                                <li>Breathable Fabric</li>
                                <li>Vibrant Colors & Checks</li>
                                <li>Long-Lasting Quality</li>
                            </ul>
                        </div>
                    </article>

                    {/* Towels */}
                    <article className="product-card">
                        <div className="card-content">
                            <span className="category-tag">Essentials</span>
                            <h3>Towels</h3>
                            <p>
                                Soft, absorbent, and durable <strong>Towels</strong> for everyday use.
                                We provide high-quality cotton towels that are gentle on the skin.
                            </p>
                            <ul>
                                <li>100% Cotton</li>
                                <li>High Absorbency</li>
                                <li>Various Sizes Available</li>
                            </ul>
                        </div>
                    </article>
                </div>
            </div>

            {/* Modal Gallery */}
            <div className={`modal-overlay ${selectedCategory === 'dhoties' ? 'active' : ''}`} onClick={() => setSelectedCategory(null)}>
                <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setSelectedCategory(null)} aria-label="Close modal">&times;</button>

                    <div className="product-details-container">
                        {/* Slideshow */}
                        <div className="product-slideshow">
                            <div className="slideshow-wrapper">
                                <img src={dhotiesImages[currentSlideIndex]} alt={`Dhoties view ${currentSlideIndex + 1}`} className="active-slide" />
                                <button className="slide-btn prev-btn" onClick={prevSlide}>&#10094;</button>
                                <button className="slide-btn next-btn" onClick={nextSlide}>&#10095;</button>
                            </div>
                            <div className="slideshow-dots">
                                {dhotiesImages.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`dot ${currentSlideIndex === idx ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
                                    ></span>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="product-info">
                            <span className="category-tag">Premium Collection</span>
                            <h2>Traditional Dhoties</h2>
                            <p className="product-description">
                                Experience the ultimate comfort and elegance with our premium traditional dhoties, perfectly woven for daily wear and special occasions.
                            </p>

                            <ul className="product-specs">
                                <li><strong>Cloth:</strong> Komudu Cotton</li>
                                <li><strong>Available Colours:</strong> Blue, Black, and Olive Green</li>
                                <li><strong>Pattern:</strong> Solid with colored borders</li>
                                <li><strong>Texture:</strong> Soft, Breathable, and Skin-friendly</li>
                            </ul>

                            <div className="action-buttons">
                                <a href="mailto:info@srgm.com?subject=Enquiry for Traditional Dhoties" className="btn primary-btn">
                                    ✉️ Enquire Now
                                </a>
                                <a href="https://wa.me/919443320033?text=Hi, I would like to enquire about the Traditional Dhoties (Komudu Cotton)." target="_blank" rel="noreferrer" className="btn whatsapp-btn">
                                    💬 WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
