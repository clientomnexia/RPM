import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { Plus, Loader2, ChevronRight, ShoppingCart, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [prodRes, catRes] = await Promise.all([
                    axios.get(`${API_URL}/api/products`),
                    axios.get(`${API_URL}/api/categories`)
                ]);
                setProducts(prodRes.data);
                setCategories(['All', ...catRes.data.map(c => c.name)]);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = filter === 'All' 
        ? products 
        : products.filter(p => p.category === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-stone-100 pb-12">
                <div>
                    <h1 className="text-5xl font-serif font-bold mb-4 text-red-950 uppercase tracking-tight">Rajwada Stuffs</h1>
                    <p className="text-stone-500 text-lg">Select your favorites and build your royal cart.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilter(cat)} 
                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                                filter === cat 
                                ? 'bg-red-800 text-white shadow-lg shadow-red-900/20' 
                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => {
                        const images = product.images && product.images.length > 0 ? product.images : [product.image];
                        const { cartItems, addToCart, updateQty, removeFromCart } = useCart();
                        const cartItem = cartItems.find(item => item._id === product._id);

                        return (
                            <div key={product._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 flex flex-col hover:shadow-2xl transition-all duration-500 group">
                                <div className="h-64 overflow-hidden relative">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        navigation={{
                                            nextEl: `.next-${product._id}`,
                                            prevEl: `.prev-${product._id}`,
                                        }}
                                        pagination={{ clickable: true }}
                                        className="h-full w-full"
                                    >
                                        {images.map((img, idx) => (
                                            <SwiperSlide key={idx} onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
                                                <img 
                                                    src={img && img.startsWith('/uploads') ? `${API_URL}${img}` : img || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} 
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                                    alt={product.name} 
                                                />
                                            </SwiperSlide>
                                        ))}
                                        
                                        {/* Custom Navigation for each card */}
                                        {images.length > 1 && (
                                            <>
                                                <button className={`prev-${product._id} absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center text-stone-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    <ChevronRight className="rotate-180" size={14} />
                                                </button>
                                                <button className={`next-${product._id} absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-center text-stone-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                    <ChevronRight size={14} />
                                                </button>
                                            </>
                                        )}
                                    </Swiper>

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-red-800 shadow-sm z-10">
                                        {product.category || 'Classic'}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-stone-900 mb-2 cursor-pointer hover:text-red-900 transition-colors" onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                                            {product.description || "Fresh handcrafted selection prepared with secret traditional recipes."}
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-6 flex items-center justify-between">
                                        <span className="text-2xl font-serif font-black text-red-900">₹{product.price}</span>
                                        
                                        {!cartItem ? (
                                            <button 
                                                onClick={() => addToCart(product)} 
                                                className="w-12 h-12 bg-red-800 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-red-900/20"
                                                title="Add to Royal Cart"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        ) : (
                                            <div className="flex items-center bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden shadow-sm animate-in zoom-in duration-300">
                                                <button 
                                                    onClick={() => {
                                                        if (cartItem.qty > 1) updateQty(product._id, cartItem.qty - 1);
                                                        else removeFromCart(product._id);
                                                    }}
                                                    className="w-10 h-10 flex items-center justify-center text-red-800 hover:bg-stone-200 transition-colors"
                                                >
                                                    <Minus size={16} strokeWidth={3} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-stone-900">{cartItem.qty}</span>
                                                <button 
                                                    onClick={() => updateQty(product._id, cartItem.qty + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-red-800 hover:bg-stone-200 transition-colors"
                                                >
                                                    <Plus size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-stone-400 font-medium">No items found in this royal category.</p>
                </div>
            )}
        </div>
    );
};

export default Products;
