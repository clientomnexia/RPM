import React from 'react';
import {
  Instagram,
  Facebook,
  MapPin,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-20 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-800 rounded-lg flex items-center justify-center overflow-hidden">
               <img src="/logo.png" alt="Rajwada Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white uppercase">RAJWADA</h1>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed text-stone-500 text-sm">
            Preserving the 400-year-old tradition of Indian hospitality. Handcrafted with luxury, taste, and absolute hygiene in the heart of Indore.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center hover:text-white hover:bg-red-900 transition-all"><Instagram size={22} /></a>
            <a href="#" className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center hover:text-white hover:bg-red-900 transition-all"><Facebook size={22} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Shop Stuffs</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/products" className="hover:text-amber-500 transition-colors">Our Paan Menu</Link></li>
            <li><Link to="/products" className="hover:text-amber-500 transition-colors">Premium Mukhwas</Link></li>
            <li><Link to="/products" className="hover:text-amber-500 transition-colors">Signature Masalas</Link></li>
            <li><Link to="/products" className="hover:text-amber-500 transition-colors">Gift Hampers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-[10px]">Contact</h4>
          <div className="space-y-4 text-sm">
            <p className="flex gap-3 items-start"><MapPin size={18} className="text-red-800 flex-shrink-0" />66, Nallurahalli Main Rd, Palm Meadows, Nallurhalli, Whitefield, Bengaluru, Karnataka 560066</p>
            <p className="flex gap-3 items-center"><Phone size={18} className="text-red-800" /> +91 9559582937 </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
