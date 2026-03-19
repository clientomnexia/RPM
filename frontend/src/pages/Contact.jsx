import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/contact`, formData);
            setSubmitted(true);
        } catch (error) {
            console.error("Message failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto px-4 py-32 text-center animate-in zoom-in">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Message Sent!</h2>
                <p className="text-stone-500">We'll get back to you with a royal response shortly.</p>
                <button 
                   onClick={() => setSubmitted(false)}
                   className="mt-8 text-red-800 font-bold hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <div className="text-center mb-16">
                <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-amber-600 mb-2">Get in Touch</h2>
                <h1 className="text-5xl font-serif font-black text-stone-900">Contact the Mahal</h1>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-stone-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-800/5 rounded-full -mr-16 -mt-16" />
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-red-800 transition-all font-medium text-stone-900"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-red-800 transition-all font-medium text-stone-900"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Phone Number</label>
                            <input 
                                type="tel" 
                                required 
                                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-red-800 transition-all font-medium text-stone-900"
                                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Your Message</label>
                            <textarea 
                                required 
                                className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-red-800 transition-all font-medium text-stone-900 min-h-[150px]"
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-stone-900 text-white font-black rounded-2xl hover:bg-stone-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:bg-stone-300"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Send Message <Send size={20} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
