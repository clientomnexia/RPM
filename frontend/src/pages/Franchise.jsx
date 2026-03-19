import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';
import { Store, Loader2, ArrowRight } from 'lucide-react';

const Franchise = () => {
    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchFranchises = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/franchise`);
                setFranchises(data);
            } catch (error) {
                console.error("Error fetching franchises", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFranchises();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <div className="text-center mb-20">
                <div className="inline-flex p-3 bg-red-50 text-red-800 rounded-2xl mb-6">
                    <Store size={32} />
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-black text-red-950 mb-4">Legacy Partnership</h1>
                <p className="text-stone-500 text-lg max-w-2xl mx-auto">
                    Join India's most loved luxury paan brand. Be a part of the Rajwada tradition and build your own royal success story.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-red-800 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-12">
                    {franchises.map(plan => (
                        <div key={plan._id} className="bg-white rounded-[3rem] p-10 md:p-16 border border-stone-100 shadow-xl hover:shadow-2xl transition-all flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-serif font-bold text-red-900 uppercase tracking-tight">{plan.name}</h3>
                                    <div className="text-3xl font-serif font-black text-red-950">₹{plan.investmentAmount.toLocaleString()}</div>
                                </div>
                                <p className="text-stone-500 text-lg leading-relaxed">{plan.description}</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-stone-50">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] mb-2">Required Area</p>
                                        <p className="text-stone-900 font-bold">{plan.requiredArea}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] mb-2">Agreement Duration</p>
                                        <p className="text-stone-900 font-bold">{plan.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] mb-2">Expected ROI</p>
                                        <p className="text-stone-900 font-bold">{plan.expectedROI}</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => addToCart(plan, 'Franchise')}
                                    className="px-10 py-5 bg-red-800 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-red-700 transition-all shadow-lg"
                                >
                                    Apply for Franchise <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-32 bg-stone-950 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-800/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
                
                <h2 className="text-4xl font-serif font-bold text-white mb-6 relative z-10">Start Your Journey Today</h2>
                <p className="text-stone-400 mb-10 max-w-xl mx-auto relative z-10">
                    Fill out our comprehensive application form and our team will get back to you within 48 hours for a royal consultation.
                </p>
                <button className="px-12 py-5 bg-amber-500 text-stone-950 font-black rounded-2xl hover:bg-amber-400 transition-all relative z-10">
                    Open Inquiry Form
                </button>
            </div>
        </div>
    );
};

export default Franchise;
