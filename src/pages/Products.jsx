import React, { useEffect } from 'react';

const Products = () => {
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
                    <article className="product-card">
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
        </section>
    );
};

export default Products;
