import React from 'react';
import { ChefHat } from 'lucide-react';

const Catering = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pt-32 animate-in fade-in duration-700">
            <div className="bg-stone-900 rounded-[3rem] overflow-hidden text-white flex flex-col lg:flex-row shadow-2xl">
                <div className="flex-1 p-12 md:p-20 space-y-8">
                    <div className="inline-flex gap-2 items-center text-amber-500 font-bold tracking-[0.2em] uppercase text-xs">
                        <ChefHat size={16} /> Services
                    </div>
                    <h1 className="text-5xl font-serif font-bold text-white">Royal Event Catering</h1>
                    <p className="text-stone-400 text-lg leading-relaxed">
                        Impress your guests with our signature live Paan counters. Perfect for weddings, corporate gatherings, and royal celebrations.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-stone-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <span>Live Crafting Sessions</span>
                        </div>
                        <div className="flex items-center gap-4 text-stone-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <span>Signature Luxury Blends</span>
                        </div>
                        <div className="flex items-center gap-4 text-stone-300">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <span>Trained Royal Artisans</span>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-amber-500 text-stone-950 font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-lg translate-y-0 active:translate-y-1">
                        Request a Quote
                    </button>
                </div>
                <div className="lg:w-1/3 min-h-[400px]">
                    <img 
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800" 
                        className="w-full h-full object-cover opacity-80" 
                        alt="Catering" 
                    />
                </div>
            </div>
        </div>
    );
};

export default Catering;
