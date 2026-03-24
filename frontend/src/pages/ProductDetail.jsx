import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ShoppingCart, ArrowLeft, Star, Share2 } from 'lucide-react';
import Loader from '../components/Loader';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <Loader />;
    if (!product) return <div className="py-40 text-center font-bold text-stone-400">Product not found.</div>;

    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 mb-8 text-stone-500 hover:text-red-800 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Back to Selection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Swipable Images */}
                    <div className="w-full relative rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-stone-100">
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation={{
                                nextEl: '.swiper-next',
                                prevEl: '.swiper-prev',
                            }}
                            pagination={{ clickable: true }}
                            onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                            className="h-[500px] md:h-[600px]"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <img 
                                        src={img && img.startsWith('/uploads') ? `${API_URL}${img}` : img || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800'} 
                                        alt={`${product.name} - ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                            
                            {/* Custom Navigation Buttons */}
                            <button className="swiper-prev absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-stone-800 shadow-xl hover:scale-110 active:scale-95 transition-all">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="swiper-next absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-stone-800 shadow-xl hover:scale-110 active:scale-95 transition-all">
                                <ChevronLeft size={24} className="rotate-180" />
                            </button>
                        </Swiper>
                        
                        {/* Thumbnail Dots/Gallery indicator */}
                        {images.length > 1 && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                                {images.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 transition-all rounded-full ${activeImage === i ? 'w-8 bg-red-800' : 'w-3 bg-stone-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="lg:pl-8 space-y-8 animate-in slide-in-from-right duration-700">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                {product.category || 'Legacy Selection'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-red-950 leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-stone-500 font-bold mb-6">
                                <div className="flex text-amber-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                                <span>(Verified Royal Choice)</span>
                            </div>
                            <p className="text-3xl font-serif font-black text-red-800">
                                ₹{product.price}
                            </p>
                        </div>

                        <div className="h-px bg-stone-200" />

                        <div>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-400 mb-4">Details & Experience</h3>
                            <p className="text-stone-600 leading-relaxed text-lg">
                                {product.description}
                                {!product.description && "Experience the royal taste of handcrafted rajwada paan. Prepared with secret traditional recipes using only the finest ingredients for a truly authentic experience."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                onClick={() => {
                                    addToCart(product);
                                    navigate('/cart');
                                }}
                                className="flex-1 px-10 py-5 bg-red-800 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                <ShoppingCart size={20} />
                                Add to Royal Cart
                            </button>
                            <button 
                                className="px-8 py-5 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }}
                            >
                                <Share2 size={20} />
                            </button>
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">🍃</div>
                                100% Fresh
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">✨</div>
                                Royal Taste
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
