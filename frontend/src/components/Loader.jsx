import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading the Royal Taste..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-500">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-red-800/10 rounded-full" />
                <Loader2 className="w-16 h-16 text-red-800 animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Loader;
