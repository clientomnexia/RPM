import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { Plus, Loader2 } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

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
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-red-800 animate-spin" />
                    <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Unlocking Royal Selections...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 flex flex-col hover:shadow-2xl transition-all duration-500 group">
                            <div className="h-64 overflow-hidden relative">
                                <img 
                                    src={product.image && product.image.startsWith('/uploads') ? `${API_URL}${product.image}` : product.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={product.name} 
                                />
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-red-800 shadow-sm">
                                    {product.category || 'Classic'}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">{product.name}</h3>
                                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-6 flex items-center justify-between">
                                    <span className="text-2xl font-serif font-black text-red-900">₹{product.price}</span>
                                    <button 
                                        onClick={() => addToCart(product)} 
                                        className="w-12 h-12 bg-red-800 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-red-900/20"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
