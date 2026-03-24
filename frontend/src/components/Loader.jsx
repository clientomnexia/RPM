import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Preparing the Royal Selection..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-32 px-4 gap-8 animate-in fade-in zoom-in duration-700">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow/Pulse */}
                <div className="absolute inset-0 w-24 h-24 bg-red-800/10 rounded-full animate-ping opacity-30" />
                
                {/* Main Spinning Border */}
                <div className="w-20 h-20 border-[3px] border-stone-100 border-t-red-800 rounded-full animate-spin" />
                
                {/* Center Icon/Logo placeholder */}
                <div className="absolute text-2xl animate-pulse">🍃</div>
            </div>
            
            <div className="text-center space-y-2">
                <p className="text-stone-900 font-serif font-bold text-lg tracking-wide uppercase">
                    Rajwada Paan
                </p>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-[1px] w-6 bg-stone-200" />
                    <p className="text-red-800 font-bold uppercase tracking-[0.4em] text-[10px] whitespace-nowrap">
                        {message}
                    </p>
                    <div className="h-[1px] w-6 bg-stone-200" />
                </div>
            </div>
        </div>
    );
};

export default Loader;
