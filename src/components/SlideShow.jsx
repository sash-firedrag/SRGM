import React, { useState, useEffect } from 'react';

const SlideShow = () => {
    const [slideIndex, setSlideIndex] = useState(1);

    const slides = [
        {
            src: "/hero_textile.png",
            text: "Premium Fabrics"
        },
        {
            src: "/slideshow img-1.jpg",
            text: "State of the Art Machinery"
        },
        {
            src: "/slideshow img-2.jpg",
            text: "Quality Assurance"
        },
        {
            src: "/Screenshot 2025-10-04 232436.png",
            text: "Bulk Production"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setSlideIndex((prev) => (prev >= slides.length ? 1 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const plusSlides = (n) => {
        let newIndex = slideIndex + n;
        if (newIndex > slides.length) newIndex = 1;
        if (newIndex < 1) newIndex = slides.length;
        setSlideIndex(newIndex);
    };

    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    return (
        <section className="slideshow-section reveal active">
            <div className="container">
                <h2 className="section-title">Our Production & Quality</h2>
                <div className="slideshow-container">

                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`mySlides fade`}
                            style={{ display: slideIndex === index + 1 ? 'block' : 'none' }}
                        >
                            <div className="numbertext">{index + 1} / {slides.length}</div>
                            <img src={slide.src} alt={slide.text} />
                            <div className="text">{slide.text}</div>
                        </div>
                    ))}

                    <button className="prev" onClick={() => plusSlides(-1)} style={{ background: 'none', border: 'none', color: 'white' }}>&#10094;</button>
                    <button className="next" onClick={() => plusSlides(1)} style={{ background: 'none', border: 'none', color: 'white' }}>&#10095;</button>
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${slideIndex === index + 1 ? 'active' : ''}`}
                            onClick={() => currentSlide(index + 1)}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SlideShow;
