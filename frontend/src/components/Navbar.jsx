import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChefHat, 
  Store, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, loginWithFirebase } = useAuth(); // Assuming we'll add loginWithFirebase
    const { cartCount, setIsCartOpen } = useCart(); // Assuming we'll add setIsCartOpen if needed or keep it as page
    const navigate = useNavigate();

    const NavItem = ({ to, label, icon: Icon }) => (
        <Link 
            to={to}
            onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold text-stone-600 hover:bg-stone-100`}
        >
            {Icon && <Icon size={16} />}
            {label}
        </Link>
    );

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
                    <div className="w-12 h-12 bg-red-800 rounded-xl flex items-center justify-center text-white font-serif text-2xl shadow-xl group-hover:rotate-6 transition-transform">R</div>
                    <div>
                        <h1 className="text-xl font-serif font-black tracking-tighter text-red-950 leading-none">RAJWADA</h1>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-amber-600">Paan Mahal</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-2">
                    <NavItem to="/" label="Home" />
                    <NavItem to="/products" label="The Menu" />
                    <NavItem to="/catering" label="Catering" icon={ChefHat} />
                    <NavItem to="/franchise" label="Franchise" icon={Store} />
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-stone-50 rounded-full border border-stone-100">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white overflow-hidden">
                                {user.avatar ? <img src={user.avatar} alt="" /> : <User size={16} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-stone-400 font-bold uppercase leading-none">Member</span>
                                <span className="text-xs font-bold text-stone-700 truncate max-w-[80px]">{user.name?.split(' ')[0]}</span>
                            </div>
                            <button onClick={logout} className="p-1.5 hover:text-red-800 transition-colors" title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => loginWithFirebase?.()} // To be implemented
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-red-800 transition-colors font-bold text-sm"
                        >
                            <User size={18} /> Login
                        </button>
                    )}
                    
                    <button 
                        onClick={() => navigate('/cart')}
                        className="relative p-2.5 text-red-900 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                    >
                        <ShoppingBag size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button className="lg:hidden p-2 text-red-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[45] bg-white pt-24 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                    <NavItem to="/" label="Home" />
                    <NavItem to="/products" label="The Mahal Shop" />
                    <NavItem to="/catering" label="Royal Catering" icon={ChefHat} />
                    <NavItem to="/franchise" label="Franchise" icon={Store} />
                    {!user && (
                        <button onClick={() => loginWithFirebase?.()} className="mt-4 w-full py-4 bg-stone-100 rounded-2xl font-bold flex items-center justify-center gap-2">
                            <User size={20} /> Login / Sign Up
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
