import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle,
  Loader2,
  ShieldCheck,
  MapPin,
  Phone
} from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, clearCart, cartTotal, cartCount } = useCart();
    const { user, loginWithFirebase } = useAuth();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState({ phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const orderData = {
                user: {
                    name: user.name,
                    email: user.email,
                    phone: userInfo.phone,
                    address: userInfo.address,
                },
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price || item.investmentAmount,
                    product: item._id,
                    itemModel: item.itemType || 'Product'
                })),
                totalPrice: cartTotal
            };
            await axios.post(`${API_URL}/api/orders`, orderData);
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-4xl font-serif font-black text-stone-900 mb-4">Order Received!</h2>
                <p className="text-stone-500 text-lg mb-10">
                    Your royal selection is being prepared with the utmost care. We will contact you shortly.
                </p>
                <div className="flex justify-center">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-in fade-in">
                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShoppingBag size={48} className="text-stone-200" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Your Bag is Empty</h2>
                <p className="text-stone-500 mb-10">Add some masterpieces to your selection to get started.</p>
                <button 
                    onClick={() => window.location.href = '/products'}
                    className="px-8 py-4 bg-red-800 text-white font-bold rounded-2xl hover:bg-red-700 transition-all"
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <h1 className="text-5xl font-serif font-black text-red-950 mb-12 uppercase tracking-tight">Your Selection</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-7 space-y-6">
                    {cartItems.map(item => (
                        <div key={item._id} className="bg-white rounded-[2rem] p-6 border border-stone-100 flex gap-6 items-center hover:shadow-lg transition-all">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                <img 
                                    src={item.image && item.image.startsWith('/uploads') ? `${API_URL}${item.image}` : item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-stone-900 truncate">{item.name}</h3>
                                <p className="text-red-800 font-serif font-bold text-xl">₹{item.price || item.investmentAmount}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center bg-stone-100 rounded-xl p-1.5 px-3">
                                        <button onClick={() => updateQty(item._id, item.qty - 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Minus size={16} /></button>
                                        <span className="w-10 text-center font-black text-sm">{item.qty}</span>
                                        <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1 hover:bg-white rounded-lg transition-colors"><Plus size={16} /></button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-3 text-stone-300 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary & Checkout Sidebar */}
                <div className="lg:col-span-5">
                    <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-10 border border-stone-100 sticky top-32">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8 border-b border-stone-200 pb-4">Order Summary</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-stone-500">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-stone-500">
                                <span>Delivery Fee</span>
                                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                                <span className="text-xl font-bold text-stone-900">Total</span>
                                <span className="text-3xl font-serif font-black text-red-950">₹{cartTotal}</span>
                            </div>
                        </div>

                        {!user ? (
                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-center space-y-4">
                                <ShieldCheck size={32} className="text-amber-600 mx-auto" />
                                <p className="text-amber-900 font-bold">Secure Delivery Login</p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Please sign in with Google to confirm your royal delivery details.
                                </p>
                                <button 
                                    onClick={loginWithFirebase}
                                    className="w-full py-4 bg-white border border-stone-200 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-stone-50 transition-all text-sm shadow-sm"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="" />
                                    Sign in with Google
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCheckout} className="space-y-4">
                                <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} alt="" /> : <Loader2 className="animate-spin text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-stone-900 font-bold text-sm leading-none mb-1">{user.name}</p>
                                        <p className="text-xs text-stone-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-red-800 transition-colors" size={18} />
                                        <input 
                                            type="tel" 
                                            placeholder="Phone Number" 
                                            required 
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-red-800 transition-all placeholder:text-stone-300"
                                            onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} 
                                        />
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-5 text-stone-400 group-focus-within:text-red-800 transition-colors" size={18} />
                                        <textarea 
                                            placeholder="Full Delivery Address" 
                                            required 
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-stone-900 focus:outline-none focus:border-red-800 transition-all min-h-[120px] placeholder:text-stone-300"
                                            onChange={e => setUserInfo({ ...userInfo, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-red-800 text-white font-black rounded-3xl hover:bg-red-900 transition-all shadow-xl shadow-red-900/20 disabled:bg-stone-300 flex items-center justify-center gap-3 mt-6 uppercase tracking-widest text-sm"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Place Order <ArrowRight size={20} /></>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
