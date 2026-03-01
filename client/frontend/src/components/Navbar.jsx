import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { cartCount } = useCart();

    return (
        <nav>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="Raj Pan Mahal" style={{ height: '50px', objectFit: 'contain' }} />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/franchise">Franchise</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
                <Link to="/cart" className="cart-icon">
                    <ShoppingCart size={24} color="#d4af37" />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
