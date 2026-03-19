import React from 'react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <div className="text-center mb-16">
                <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-amber-600 mb-2">Our Story</h2>
                <h1 className="text-5xl font-serif font-black text-stone-900">Rajwada Heritage</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-red-900/10 to-amber-500/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-all duration-700" />
                    <img 
                        src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800" 
                        className="w-full h-[600px] object-cover rounded-[3rem] border border-stone-100 shadow-2xl relative z-10" 
                        alt="Our Heritage" 
                    />
                </div>
                
                <div className="space-y-8">
                    <h3 className="text-3xl font-serif font-bold text-red-900">Authentic Taste Since 1995</h3>
                    <p className="text-stone-500 text-lg leading-relaxed">
                        Founded in 1995, Rajwada Paan Mahal has been the pioneer in providing premium quality pan and tobacco products. 
                        Our commitment to authentic taste and hygiene has made us a household name for millions of pan lovers.
                    </p>
                    <p className="text-stone-500 text-lg leading-relaxed">
                        Over the decades, we have evolved from a single kiosk in Indore to a prestigious national network, 
                        all while maintaining the same secret recipes that defined our first royal blend.
                    </p>

                    <div className="grid grid-cols-3 gap-8 pt-10 border-t border-stone-100">
                        <div>
                            <h4 className="text-4xl font-serif font-black text-red-800">25+</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-2">Years of Excellence</p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-serif font-black text-red-800">50+</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-2">Royal Outlets</p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-serif font-black text-red-800">100+</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mt-2">Premium Blends</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
