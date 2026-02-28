import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#d4af37' }}>About Raj Pan Mahal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '4rem', alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600" style={{ width: '100%', borderRadius: '15px', border: '2px solid var(--secondary)' }} alt="Our Heritage" />
                <div>
                    <h3 style={{ color: '#d4af37', marginBottom: '1.5rem' }}>Our Heritage Since 1995</h3>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Founded in 1995, Raj Pan Mahal has been the pioneer in providing premium quality pan and tobacco products. 
                        Our commitment to authentic taste and hygiene has made us a household name for millions of pan lovers.
                    </p>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Over the decades, we have evolved from a single kiosk to a multi-city franchise network, 
                        all while maintaining the same secret recipes that defined our first royal blend.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
                        <div>
                            <h4 style={{ color: '#d4af37', fontSize: '2rem' }}>25+</h4>
                            <p>Years of Experience</p>
                        </div>
                        <div>
                            <h4 style={{ color: '#d4af37', fontSize: '2rem' }}>50+</h4>
                            <p>Franchise Outlets</p>
                        </div>
                        <div>
                            <h4 style={{ color: '#d4af37', fontSize: '2rem' }}>100+</h4>
                            <p>Premium Products</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
