import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                setProducts(data.slice(0, 3)); // Only feature top 3
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover brightness-[0.4]" 
                        alt="Royal" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 to-transparent" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-2xl space-y-6">
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-white leading-tight">
                            Order the Finest <br/>
                            <span className="text-amber-400">Paan Online.</span>
                        </h1>
                        <p className="text-xl text-stone-300 leading-relaxed font-medium">
                            Authentic Rajwada taste delivered to your doorstep. Handcrafted, fresh, and royal.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => navigate('/products')} 
                                className="px-10 py-5 bg-red-800 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-2xl transition-all"
                            >
                                Order Now <ArrowRight size={20} />
                            </button>
                            <button 
                                onClick={() => navigate('/catering')} 
                                className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold transition-all"
                            >
                                Catering Service
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Items */}
            <section className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-amber-600 mb-2">Our Stuffs</h2>
                    <h3 className="text-4xl font-serif font-bold text-stone-900">Handcrafted Masterpieces</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map(p => (
                        <div key={p._id} className="group cursor-pointer" onClick={() => navigate('/products')}>
                            <div className="h-96 rounded-3xl overflow-hidden mb-6 relative">
                                <img 
                                    src={p.image && p.image.startsWith('/uploads') ? `${API_URL}${p.image}` : p.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={p.name} 
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <h4 className="font-bold text-lg text-stone-900">{p.name}</h4>
                                    <p className="text-red-800 font-serif font-bold">₹{p.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/products" className="inline-flex items-center gap-2 text-red-800 font-bold hover:underline">
                        View Full Menu <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Special Mix Section */}
            <section className="py-24 bg-stone-50 border-y border-stone-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-amber-600 mb-2">Special Selections</h2>
                    <h3 className="text-4xl font-serif font-bold text-stone-900 mb-16">Curated for Every Mood</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all text-center">
                            <div className="text-4xl mb-6">🍃</div>
                            <h4 className="font-bold text-lg mb-2 text-stone-900">Paan Specials</h4>
                            <p className="text-stone-500 text-sm">Hand-crafted traditional favorites</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all text-center">
                            <div className="text-4xl mb-6">🥤</div>
                            <h4 className="font-bold text-lg mb-2 text-stone-900">Chilled Drinks</h4>
                            <p className="text-stone-500 text-sm">Refreshing beverages to cool down</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all text-center">
                            <div className="text-4xl mb-6">🍿</div>
                            <h4 className="font-bold text-lg mb-2 text-stone-900">Snack Bites</h4>
                            <p className="text-stone-500 text-sm">The perfect companion for your breaks</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl transition-all text-center">
                            <div className="text-4xl mb-6">🎁</div>
                            <h4 className="font-bold text-lg mb-2 text-stone-900">Gift Combos</h4>
                            <p className="text-stone-500 text-sm">Premium assortments for special occasions</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
