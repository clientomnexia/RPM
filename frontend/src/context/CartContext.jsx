import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, type = 'Product') => {
        setCartItems(prev => {
            const existItem = prev.find(x => x._id === item._id);
            if (existItem) {
                return prev.map(x => x._id === item._id ? { ...x, qty: x.qty + 1 } : x);
            }
            return [...prev, { ...item, qty: 1, itemType: type }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(x => x._id !== id));
    };

    const updateQty = (id, qty) => {
        if (qty < 1) return;
        setCartItems(prev => prev.map(x => x._id === id ? { ...x, qty } : x));
    };

    const cartTotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.price || item.investmentAmount || 0;
        return acc + itemPrice * item.qty;
    }, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
